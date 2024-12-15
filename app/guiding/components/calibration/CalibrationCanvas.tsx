"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/lib/store/guiding/calibration";

export default function CalibrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showGrid, lineLength, showAnimation, setLineLength } =
    useGuidingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawCanvas = () => {
      canvas.width = 300;
      canvas.height = 300;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 渐变背景
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#1f2937");
      gradient.addColorStop(1, "#111827");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制坐标系
      ctx.strokeStyle = "#4b5563";
      ctx.lineWidth = 1;

      // 轴线
      ctx.beginPath();
      ctx.moveTo(0, 150);
      ctx.lineTo(300, 150);
      ctx.moveTo(150, 0);
      ctx.lineTo(150, 300);
      ctx.stroke();

      // 网格线
      if (showGrid) {
        ctx.strokeStyle = "#374151";
        for (let i = 30; i < 300; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 300);
          ctx.moveTo(0, i);
          ctx.lineTo(300, i);
          ctx.stroke();
        }
      }

      // 校准线
      // RA线（红色）
      ctx.strokeStyle = "#f87171";
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(150 + lineLength, 150 - lineLength / 2);
      ctx.stroke();

      // DEC线（蓝色）
      ctx.strokeStyle = "#60a5fa";
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(150 - lineLength / 2, 150 + lineLength);
      ctx.stroke();
    };

    drawCanvas();

    if (showAnimation) {
      let animationFrame = 0;
      const animate = () => {
        animationFrame++;
        const progress = Math.sin(animationFrame * 0.1) * 0.5 + 0.5;
        setLineLength(50 + progress * 100);
        drawCanvas();
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [showGrid, lineLength, showAnimation, setLineLength]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full aspect-square bg-gray-900 border border-gray-700 shadow-inner rounded-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
