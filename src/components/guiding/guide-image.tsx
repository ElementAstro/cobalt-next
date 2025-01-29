"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomColors } from "@/types/guiding";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Eraser,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Shape {
  type: "circle" | "square";
  position: { x: number; y: number };
  radius?: number;
  size?: number;
  color: string;
}

interface Point {
  id: string;
  x: number;
  y: number;
  type: "primary" | "reference" | "calibration";
  label?: string;
  timestamp: number;
}

interface GuideImageProps {
  imageUrl: string | null;
  colors: CustomColors;
  crosshairSize?: number;
  crosshairThickness?: number;
  showGrid?: boolean;
  gridSize?: number;
  brightness?: number;
  contrast?: number;
  shapes?: Shape[];
  showCrosshair?: boolean;
  height?: string | number;
  markedPoints?: Point[];
  onPointAdd?: (point: Point) => void;
  onPointRemove?: (pointId: string) => void;
  onPointUpdate?: (point: Point) => void;
  measurementMode?: "distance" | "angle" | "none";
  showMeasurements?: boolean;
  gridStep?: number;
  zoomToFit?: boolean;
  quality?: "low" | "medium" | "high";
  rendering?: "auto" | "crisp-edges" | "pixelated";
}

export function GuideImage({
  imageUrl,
  colors,
  crosshairSize = 10,
  crosshairThickness = 2,
  showGrid = false,
  gridSize = 50,
  brightness = 100,
  contrast = 100,
  shapes = [],
  showCrosshair = true,
  markedPoints = [],
  onPointAdd,
  measurementMode = "none",
  showMeasurements = true,
  gridStep = 50,
  zoomToFit = true,
  quality = "high",
  rendering = "auto",
}: GuideImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [lastScale, setLastScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [filter, setFilter] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationHistory, setOperationHistory] = useState<
    Array<{
      scale: number;
      offset: { x: number; y: number };
      rotation: number;
      flip: { horizontal: boolean; vertical: boolean };
    }>
  >([]);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [markers, setMarkers] = useState<{ x: number; y: number }[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<{
    distances: Array<{ from: string; to: string; value: number }>;
    angles: Array<{ p1: string; center: string; p2: string; value: number }>;
  }>({
    distances: [],
    angles: [],
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const lastRenderTimeRef = useRef(0);

  const getPointColor = (type: string) => {
    switch (type) {
      case "primary":
        return colors.primary;
      case "reference":
        return colors.accent;
      case "calibration":
        return colors.secondary;
      default:
        return colors.accent;
    }
  };

  const getCanvasPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const calculateAngle = (p1: Point, p2: Point, p3: Point) => {
    const a = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
    const b = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
    const c = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    return (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI;
  };

  const drawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
      try {
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(
          offset.x + ctx.canvas.width / 2,
          offset.y + ctx.canvas.height / 2
        );
        ctx.scale(
          scale * (flip.horizontal ? -1 : 1),
          scale * (flip.vertical ? -1 : 1)
        );
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${filter}`;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        if (showGrid) {
          ctx.strokeStyle = `${colors.accent}40`;
          ctx.lineWidth = 0.5;
          for (let x = 0; x < ctx.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < ctx.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
          }
        }

        shapes.forEach((shape) => {
          ctx.fillStyle = shape.color;
          ctx.strokeStyle = shape.color;
          ctx.lineWidth = 1;
          if (shape.type === "circle" && shape.radius) {
            ctx.beginPath();
            ctx.arc(
              shape.position.x,
              shape.position.y,
              shape.radius,
              0,
              2 * Math.PI
            );
            ctx.fill();
          } else if (shape.type === "square" && shape.size) {
            ctx.fillRect(
              shape.position.x - shape.size / 2,
              shape.position.y - shape.size / 2,
              shape.size,
              shape.size
            );
          }
        });

        if (showCrosshair) {
          const centerX = ctx.canvas.width / 2;
          const centerY = ctx.canvas.height / 2;
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = crosshairThickness;
          ctx.beginPath();
          ctx.moveTo(centerX - crosshairSize, centerY);
          ctx.lineTo(centerX + crosshairSize, centerY);
          ctx.moveTo(centerX, centerY - crosshairSize);
          ctx.lineTo(centerX, centerY + crosshairSize);
          ctx.stroke();
        }

        // Draw markers
        markers.forEach((marker, index) => {
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = colors.accent;
          ctx.fill();
          ctx.fillText(`#${index + 1}`, marker.x + 8, marker.y + 8);
        });
      } catch (err) {
        setError("绘制图像时出错");
        console.error("绘制错误:", err);
      }
    },
    [markers, colors, scale, offset, rotation, flip, filter]
  );

  const validateImage = (url: string): boolean => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".tiff", ".fits"];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
      setError("不支持的图像格式");
      return false;
    }

    // 实际大小检查需要在加载时进行
    return true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (imageUrl) {
      if (!validateImage(imageUrl)) return;

      setIsLoading(true);
      setError(null);

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = () => {
        if (img.width * img.height > 10000 * 10000) {
          setError("图像分辨率过高");
          setIsLoading(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        drawImage(ctx, img);
        setIsLoading(false);
      };

      img.onerror = () => {
        setError("加载图像失败");
        setIsLoading(false);
      };
    }
  }, [
    imageUrl,
    colors,
    scale,
    offset,
    showGrid,
    gridSize,
    brightness,
    contrast,
    crosshairSize,
    crosshairThickness,
    rotation,
    flip,
    filter,
    shapes,
    showCrosshair,
  ]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(0.1, Math.min(10, scale + delta));
    setScale(newScale);
    addToHistory();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setOffset(newOffset);
      addToHistory();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    } else if (e.touches.length === 2) {
      setIsPinching(true);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
      setLastScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && !isPinching) {
      const newOffset = {
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      };
      setOffset(newOffset);
      addToHistory();
    } else if (isPinching && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance / initialPinchDistance;
      const newScale = Math.max(0.1, Math.min(10, lastScale * delta));
      setScale(newScale);
      addToHistory();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
  };

  const addToHistory = () => {
    setOperationHistory((prev) => [
      ...prev.slice(-9), // 保留最后10个操作
      {
        scale,
        offset,
        rotation,
        flip,
      },
    ]);
  };

  const undoLastOperation = () => {
    if (operationHistory.length > 0) {
      const lastState = operationHistory[operationHistory.length - 1];
      setScale(lastState.scale);
      setOffset(lastState.offset);
      setRotation(lastState.rotation);
      setFlip(lastState.flip);
      setOperationHistory((prev) => prev.slice(0, -1));
    } else {
      toast({
        title: "没有可撤销的操作",
        variant: "destructive",
      });
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast({
        title: "保存失败",
        description: "无法获取画布",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "guide-image.png";
      link.click();
      toast({
        title: "保存成功",
        description: "图像已保存为PNG格式",
      });
    } catch (err) {
      toast({
        title: "保存失败",
        description: "保存图像时出错",
        variant: "destructive",
      });
      console.error("保存错误:", err);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isMarking) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMarkers((prev) => [...prev, { x, y }]);
  };

  // 优化的渲染逻辑
  const drawMarkedPoints = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      markedPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle =
          point.id === selectedPoint
            ? colors.accent
            : getPointColor(point.type);
        ctx.fill();

        if (point.label) {
          ctx.fillStyle = colors.text;
          ctx.font = "12px monospace";
          ctx.fillText(point.label, point.x + 8, point.y + 8);
        }
      });
    },
    [markedPoints, selectedPoint, colors]
  );

  // 创建网格图案
  const createGridPattern = useCallback((size: number, color: string) => {
    const patternCanvas = new OffscreenCanvas(size, size);
    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) return patternCanvas;

    patternCtx.strokeStyle = color;
    patternCtx.lineWidth = 1;

    patternCtx.beginPath();
    patternCtx.moveTo(size, 0);
    patternCtx.lineTo(size, size);
    patternCtx.lineTo(0, size);
    patternCtx.stroke();

    return patternCanvas;
  }, []);

  const drawMeasurements = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      measurements.distances.forEach(({ from, to, value }) => {
        const fromPoint = markedPoints.find((p) => p.id === from);
        const toPoint = markedPoints.find((p) => p.id === to);
        if (!fromPoint || !toPoint) return;

        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.strokeStyle = colors.accent;
        ctx.stroke();

        const midX = (fromPoint.x + toPoint.x) / 2;
        const midY = (fromPoint.y + toPoint.y) / 2;
        ctx.fillStyle = colors.text;
        ctx.fillText(`${value.toFixed(2)}px`, midX, midY);
      });
    },
    [measurements, markedPoints, colors]
  );

  // 网格绘制优化
  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const pattern = ctx.createPattern(
        createGridPattern(gridStep, colors.accent + "20"),
        "repeat"
      );
      if (!pattern) return;

      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    [gridStep, colors]
  );

  // 性能优化：使用防抖处理重绘
  const debouncedDraw = useCallback(
    (ctx: CanvasRenderingContext2D, timestamp: number) => {
      if (timestamp - lastRenderTimeRef.current < 16) {
        animationFrameRef.current = requestAnimationFrame((t) =>
          debouncedDraw(ctx, t)
        );
        return;
      }
      lastRenderTimeRef.current = timestamp;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = ctx.canvas.width;
      tempCanvas.height = ctx.canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.imageSmoothingEnabled = quality !== "low";
      tempCtx.imageSmoothingQuality = quality === "high" ? "high" : "medium";

      if (imageRef.current) {
        tempCtx.drawImage(imageRef.current, 0, 0);
      }

      if (showGrid) {
        drawGrid(tempCtx);
      }

      drawMarkedPoints(tempCtx);
      if (showMeasurements) {
        drawMeasurements(tempCtx);
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    },
    [
      showGrid,
      markedPoints,
      showMeasurements,
      measurements,
      quality,
      drawGrid,
      drawMarkedPoints,
      drawMeasurements,
    ]
  );

  // 处理测量功能
  const handleMeasurement = useCallback(
    (point: Point) => {
      if (measurementMode === "distance") {
        setMeasurements((prev) => {
          const lastPoint = markedPoints[markedPoints.length - 1];
          if (!lastPoint) return prev;

          const distance = Math.sqrt(
            Math.pow(point.x - lastPoint.x, 2) +
              Math.pow(point.y - lastPoint.y, 2)
          );

          return {
            ...prev,
            distances: [
              ...prev.distances,
              { from: lastPoint.id, to: point.id, value: distance },
            ],
          };
        });
      } else if (measurementMode === "angle") {
        setMeasurements((prev) => {
          const lastTwoPoints = markedPoints.slice(-2);
          if (lastTwoPoints.length !== 2) return prev;

          const angle = calculateAngle(
            lastTwoPoints[0],
            lastTwoPoints[1],
            point
          );

          return {
            ...prev,
            angles: [
              ...prev.angles,
              {
                p1: lastTwoPoints[0].id,
                center: lastTwoPoints[1].id,
                p2: point.id,
                value: angle,
              },
            ],
          };
        });
      }
    },
    [measurementMode, markedPoints]
  );

  // 缩放适配
  useEffect(() => {
    if (!zoomToFit || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    );

    setScale(scale);
    setOffset({
      x: (canvas.width - image.width * scale) / 2,
      y: (canvas.height - image.height * scale) / 2,
    });
  }, [zoomToFit, imageUrl]);

  // 优化的事件处理
  const handlePointerEvents = useMemo(
    () => ({
      onPointerDown: (e: React.PointerEvent) => {
        const point = getCanvasPoint(e);
        if (measurementMode !== "none") {
          const newPoint: Point = {
            id: `p${Date.now()}`,
            ...point,
            type: "reference",
            timestamp: Date.now(),
          };
          onPointAdd?.(newPoint);
          handleMeasurement(newPoint);
        }
        setIsDrawing(true);
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (!isDrawing) return;
        const point = getCanvasPoint(e);
        // 处理绘制逻辑
      },
      onPointerUp: () => {
        setIsDrawing(false);
      },
    }),
    [measurementMode, isDrawing, handleMeasurement]
  );

  return (
    <TooltipProvider>
      <div className="relative w-full h-full">
        {/* Floating Tools Panel */}
        <AnimatePresence>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: toolsOpen ? 0 : -300 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 z-10"
          >
            <Card className="w-[300px] bg-background/80 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">图像工具</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setToolsOpen(!toolsOpen)}
                >
                  {toolsOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Transform Controls */}
                <div className="space-y-2">
                  <Label>变换</Label>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setRotation((r) => r - 90)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>逆时针旋转</TooltipContent>
                    </Tooltip>
                    {/* Add more transform controls... */}
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="space-y-2">
                  <Label>滤镜</Label>
                  <Select
                    value={selectedFilter}
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择滤镜" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      <SelectItem value="grayscale(100%)">黑白</SelectItem>
                      <SelectItem value="sepia(100%)">复古</SelectItem>
                      <SelectItem value="invert(100%)">反色</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Marker Tools */}
                <div className="space-y-2">
                  <Label>标注工具</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">启用标注</span>
                    <Switch
                      checked={isMarking}
                      onCheckedChange={setIsMarking}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setMarkers([])}
                  >
                    <Eraser className="h-4 w-4 mr-2" />
                    清除所有标注
                  </Button>
                </div>

                {/* Save Button */}
                <Button className="w-full" onClick={saveImage}>
                  <Save className="h-4 w-4 mr-2" />
                  保存图像
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Main Canvas */}
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full border rounded cursor-move"
          style={{
            borderColor: colors.primary,
            imageRendering: rendering,
            touchAction: "none",
          }}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          {...handlePointerEvents}
        />

        {/* Loading & Error States */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
