"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePeakChartStore } from "@/store/usePeakChartStore";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Square, Eye, EyeOff, Crosshair } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGuidingStore } from "@/store/useGuidingStore";
import { Badge } from "@/components/ui/badge";

export function PeakChart() {
  const height = usePeakChartStore((state) => state.height);
  const width = usePeakChartStore((state) => state.width);
  const strokeColor = usePeakChartStore((state) => state.strokeColor);
  const strokeWidth = usePeakChartStore((state) => state.strokeWidth);
  const showGrid = usePeakChartStore((state) => state.showGrid);
  const setHeight = usePeakChartStore((state) => state.setHeight);
  const setWidth = usePeakChartStore((state) => state.setWidth);
  const setStrokeColor = usePeakChartStore((state) => state.setStrokeColor);
  const setStrokeWidth = usePeakChartStore((state) => state.setStrokeWidth);
  const setShowGrid = usePeakChartStore((state) => state.setShowGrid);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [peakStats, setPeakStats] = useState({
    mainPeak: 0,
    fwhm: 0,
    snr: 0,
    centroid: 0,
    background: 0,
  });
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [measurementHistory, setMeasurementHistory] = useState<
    Array<{
      timestamp: number;
      fwhm: number;
      snr: number;
    }>
  >([]);

  // 生成带有峰值的示例数据
  const generatePeakData = () => {
    const data = [];
    for (let x = -50; x <= 50; x++) {
      const y = Math.exp(-(x * x) / 200) * 100; // 高斯峰
      data.push({ x, y });
    }
    return data;
  };

  const data = generatePeakData();

  // 新增峰值分析功能
  const analyzePeak = useCallback((data: number[]) => {
    const max = Math.max(...data);
    const background = Math.min(...data);
    const maxIndex = data.indexOf(max);

    // 计算半高宽
    const halfMax = (max + background) / 2;
    let leftHalf = maxIndex;
    let rightHalf = maxIndex;

    while (leftHalf > 0 && data[leftHalf] > halfMax) leftHalf--;
    while (rightHalf < data.length - 1 && data[rightHalf] > halfMax)
      rightHalf++;

    const fwhm = rightHalf - leftHalf;
    const snr = (max - background) / Math.sqrt(background);

    // 计算质心
    let weightedSum = 0;
    let sumIntensity = 0;
    data.forEach((value, index) => {
      weightedSum += value * index;
      sumIntensity += value;
    });
    const centroid = weightedSum / sumIntensity;

    setPeakStats({
      mainPeak: max,
      fwhm,
      snr,
      centroid,
      background,
    });

    // 更新测量历史
    setMeasurementHistory((prev) =>
      [...prev, { timestamp: Date.now(), fwhm, snr }].slice(-100)
    ); // 保留最近100个测量
  }, []);

  const handleZoom = useCallback((factor: number) => {
    setZoomLevel((prev) => Math.max(0.1, Math.min(10, prev * factor)));
  }, []);

  const handlePan = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setPanOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置画布大小
    canvas.width = width;
    canvas.height = height;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    if (showGrid) {
      const gridSize = 50;
      ctx.strokeStyle = "#444444";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // 绘制曲线
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = ((point.x + 50) / 100) * canvas.width;
      const y = canvas.height - (point.y / 100) * canvas.height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // 增强绘制功能
    const drawEnhancedChart = () => {
      // 添加测量标记
      if (showMeasurements) {
        ctx.save();
        ctx.strokeStyle = "#FF0000";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(peakStats.centroid * zoomLevel + panOffset.x, 0);
        ctx.lineTo(peakStats.centroid * zoomLevel + panOffset.x, canvas.height);
        ctx.stroke();

        // FWHM 指示器
        const halfMaxY = canvas.height - (peakStats.mainPeak / 2) * zoomLevel;
        ctx.beginPath();
        ctx.moveTo(
          (peakStats.centroid - peakStats.fwhm / 2) * zoomLevel + panOffset.x,
          halfMaxY
        );
        ctx.lineTo(
          (peakStats.centroid + peakStats.fwhm / 2) * zoomLevel + panOffset.x,
          halfMaxY
        );
        ctx.stroke();
        ctx.restore();
      }

      // 添加十字准线
      if (showCrosshair) {
        ctx.save();
        ctx.strokeStyle = "#FFFFFF40";
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    drawEnhancedChart();
  }, [
    data,
    height,
    width,
    strokeColor,
    strokeWidth,
    showGrid,
    showMeasurements,
    showCrosshair,
    zoomLevel,
    panOffset,
    peakStats,
  ]);

  const handleDoubleClick = () => {
    setIsDialogOpen(true);
  };

  const handleTouchStart = () => {
    touchTimer.current = setTimeout(() => {
      setIsDialogOpen(true);
    }, 700); // 长按700ms
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-2 flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleZoom(1.2)}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleZoom(0.8)}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMeasurements(!showMeasurements)}
        >
          {showMeasurements ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCrosshair(!showCrosshair)}
        >
          <Crosshair className="w-4 h-4" />
        </Button>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline" size="sm">
              <Square className="w-4 h-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">峰值统计</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">FWHM</p>
                  <p className="text-sm">{peakStats.fwhm.toFixed(2)} px</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SNR</p>
                  <p className="text-sm">{peakStats.snr.toFixed(2)} db</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">峰值</p>
                  <p className="text-sm">{peakStats.mainPeak.toFixed(0)} ADU</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">本底</p>
                  <p className="text-sm">
                    {peakStats.background.toFixed(0)} ADU
                  </p>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div
        className="relative w-full max-w-5xl cursor-pointer"
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded shadow-lg"
          onMouseDown={(e) => {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
          }}
          onMouseMove={handlePan}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />

        {/* 测量历史趋势 */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="text-xs">
            平均FWHM:{" "}
            {(
              measurementHistory.reduce((acc, curr) => acc + curr.fwhm, 0) /
              Math.max(1, measurementHistory.length)
            ).toFixed(2)}{" "}
            px
          </Badge>
        </div>
      </div>

      {/* 设置对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {/* 隐藏触发器 */}
          <span></span>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white rounded-lg shadow-lg max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>峰值图表设置</DialogTitle>
            <DialogDescription>
              调整图表的高度、宽度、线条颜色、线条宽度及网格显示。
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            {/* 高度设置 */}
            <div>
              <Label htmlFor="height" className="block mb-2">
                高度: {height}px
              </Label>
              <Slider
                id="height"
                min={100}
                max={600}
                step={10}
                value={[height]}
                onValueChange={(value) => setHeight(value[0])}
                className="w-full"
              />
            </div>
            {/* 宽度设置 */}
            <div>
              <Label htmlFor="width" className="block mb-2">
                宽度: {width}px
              </Label>
              <Slider
                id="width"
                min={300}
                max={1200}
                step={50}
                value={[width]}
                onValueChange={(value) => setWidth(value[0])}
                className="w-full"
              />
            </div>
            {/* 线条颜色设置 */}
            <div>
              <Label htmlFor="strokeColor" className="block mb-2">
                线条颜色
              </Label>
              <Select
                value={strokeColor}
                onValueChange={(value) => setStrokeColor(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择颜色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#ffffff">白色</SelectItem>
                  <SelectItem value="#ff0000">红色</SelectItem>
                  <SelectItem value="#00ff00">绿色</SelectItem>
                  <SelectItem value="#0000ff">蓝色</SelectItem>
                  <SelectItem value="#ffa500">橙色</SelectItem>
                  <SelectItem value="#800080">紫色</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 线条宽度设置 */}
            <div>
              <Label htmlFor="strokeWidth" className="block mb-2">
                线条宽度: {strokeWidth}px
              </Label>
              <Slider
                id="strokeWidth"
                min={1}
                max={10}
                step={0.5}
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                className="w-full"
              />
            </div>
            {/* 网格显示设置 */}
            <div>
              <Label htmlFor="showGrid" className="block mb-2">
                显示网格
              </Label>
              <Select
                value={showGrid ? "显示" : "隐藏"}
                onValueChange={(value) => setShowGrid(value === "显示")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="显示">显示</SelectItem>
                  <SelectItem value="隐藏">隐藏</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
              className="px-4 py-2"
            >
              取消
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
