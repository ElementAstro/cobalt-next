"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PolarScope: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRotate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(Number(event.target.value));
  };

  const handleZoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(event.target.value));
  };

  const getTimeFromAngle = (angle: number) => {
    const hours = (angle / 15 + 6) % 24;
    return `${Math.floor(hours).toString().padStart(2, "0")}:00`;
  };

  const getPolarisPosition = () => {
    const latitude = 40; // 假设观测位置在北纬40度
    const hourAngle =
      (currentTime.getHours() + currentTime.getMinutes() / 60) * 15 - 180;
    const x = 192 + 150 * Math.cos(((90 - latitude) * Math.PI) / 180);
    const y = 192 - 150 * Math.sin(((90 - latitude) * Math.PI) / 180);
    return { x, y, hourAngle };
  };

  const polarisPosition = getPolarisPosition();

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-96 h-96 border-4 border-gray-800 rounded-full overflow-hidden bg-gray-900">
        <motion.svg
          className="w-full h-full"
          viewBox="0 0 384 384"
          style={{
            rotate: rotation,
            scale: zoom,
          }}
        >
          {/* 绘制极坐标网格 */}
          {[...Array(5)].map((_, i) => (
            <circle
              key={`circle-${i}`}
              cx="192"
              cy="192"
              r={38.4 * (i + 1)}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
            />
          ))}
          {[...Array(24)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1="192"
              y1="192"
              x2="192"
              y2="0"
              stroke="rgba(255,255,255,0.2)"
              transform={`rotate(${i * 15} 192 192)`}
            />
          ))}

          {/* 添加时间刻度标记 */}
          {[...Array(24)].map((_, i) => (
            <text
              key={`text-${i}`}
              x="192"
              y="24"
              fill="white"
              fontSize="12"
              textAnchor="middle"
              transform={`rotate(${i * 15} 192 192)`}
            >
              {getTimeFromAngle(i * 15)}
            </text>
          ))}

          {/* 添加半径一半的圆环 */}
          <circle
            cx="192"
            cy="192"
            r="96"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
          />

          {/* 添加十字线 */}
          <line
            x1="0"
            y1="192"
            x2="384"
            y2="192"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          <line
            x1="192"
            y1="0"
            x2="192"
            y2="384"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />

          {/* 添加中心十字线 */}
          <line
            x1="187"
            y1="192"
            x2="197"
            y2="192"
            stroke="red"
            strokeWidth="2"
          />
          <line
            x1="192"
            y1="187"
            x2="192"
            y2="197"
            stroke="red"
            strokeWidth="2"
          />

          {/* 添加北极星标记 */}
          <circle
            cx={polarisPosition.x}
            cy={polarisPosition.y}
            r="4"
            fill="yellow"
          />
          <text
            x={polarisPosition.x + 10}
            y={polarisPosition.y}
            fill="yellow"
            fontSize="12"
          >
            北极星
          </text>
        </motion.svg>
      </div>

      <div className="flex space-x-4">
        <div>
          <label
            htmlFor="rotation"
            className="block text-sm font-medium text-gray-700"
          >
            旋转
          </label>
          <input
            type="range"
            id="rotation"
            min="0"
            max="360"
            value={rotation}
            onChange={handleRotate}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="zoom"
            className="block text-sm font-medium text-gray-700"
          >
            缩放
          </label>
          <input
            type="range"
            id="zoom"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={handleZoom}
            className="mt-1 block w-full"
          />
        </div>
      </div>
      <div className="text-white">
        当前时间: {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PolarScope;
