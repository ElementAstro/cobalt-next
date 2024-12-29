"use client";

import { useState, useRef, useEffect } from "react";
import { usePeakChartStore } from "@/store/useGuidingStore";
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
import {
  RotateCcw,
  Save,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Brush,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

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
  }, [data, height, width, strokeColor, strokeWidth, showGrid]);

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
      <div
        className="w-full max-w-5xl relative cursor-pointer"
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="w-full h-full rounded shadow-lg"></canvas>
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