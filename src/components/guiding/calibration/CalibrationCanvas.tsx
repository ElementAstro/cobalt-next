"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/store/useGuidingStore";
import { Move } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function CalibrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const { toast } = useToast();
  const animationFrameRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dpr, setDpr] = useState(1);
  const [renderStats, setRenderStats] = useState({
    fps: 0,
    drawTime: 0,
    lastFrameTime: performance.now(),
  });

  const {
    showGrid,
    lineLength,
    showAnimation,
    autoRotate,
    rotationSpeed,
    zoomLevel,
  } = useGuidingStore().calibration;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化 DPR
    try {
      const newDpr = window.devicePixelRatio || 1;
      if (newDpr < 1 || newDpr > 3) {
        throw new Error(`Invalid device pixel ratio: ${newDpr}`);
      }
      setDpr(newDpr);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Device Pixel Ratio Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setDpr(1);
    }

    // 初始化 worker
    workerRef.current = new Worker(
      new URL("../../workers/canvas.worker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      const { data } = event;
      if (data.type === "render") {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.putImageData(data.imageData, 0, 0);

        // 更新渲染统计
        const now = performance.now();
        setRenderStats((prev) => ({
          fps: Math.round(1000 / (now - prev.lastFrameTime)),
          drawTime: data.drawTime,
          lastFrameTime: now,
        }));
      } else if (data.type === "error") {
        toast({
          variant: "destructive",
          title: "Rendering Error",
          description: data.error,
        });
      }
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      workerRef.current?.terminate();
    };
  }, [toast]);

  // 渲染循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !workerRef.current) return;

    const render = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      workerRef.current?.postMessage({
        type: "render",
        width,
        height,
        dpr,
        offset,
        zoomLevel,
        rotationSpeed,
        autoRotate,
        showGrid,
        lineLength,
        celestialObjects: [],
        calibrationStatus: "idle",
      });

      if (showAnimation) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    showGrid,
    lineLength,
    showAnimation,
    autoRotate,
    rotationSpeed,
    zoomLevel,
    offset,
    dpr,
  ]);

  // 指针事件处理
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.isPrimary) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !e.isPrimary) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.isPrimary) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="relative w-full aspect-square">
      <motion.canvas
        ref={canvasRef}
        className="w-full h-full bg-gray-900 border border-gray-700 shadow-inner rounded-lg cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          touchAction: "none",
          imageRendering: "crisp-edges",
        }}
      />

      <TooltipProvider>
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
            FPS: {renderStats.fps}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setOffset({ x: 0, y: 0 })}
              >
                <Move className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>重置位置</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
