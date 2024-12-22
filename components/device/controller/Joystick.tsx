"use client";

import React, { useState, useEffect, useRef } from "react";

interface JoystickProps {
  size: number;
  baseColor?: string;
  stickColor?: string;
  onMove?: (x: number, y: number, direction: string) => void;
  onRelease?: () => void;
}

export const Joystick: React.FC<JoystickProps> = ({
  size,
  baseColor = "bg-gray-200",
  stickColor = "bg-blue-500",
  onMove,
  onRelease,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const getDirection = (x: number, y: number): string => {
    const angle = (Math.atan2(-y, x) * 180) / Math.PI;
    const directions = [
      "E",
      "ENE",
      "NE",
      "NNE",
      "N",
      "NNW",
      "NW",
      "WNW",
      "W",
      "WSW",
      "SW",
      "SSW",
      "S",
      "SSE",
      "SE",
      "ESE",
    ];
    const index = Math.round(((angle + 180) % 360) / 22.5);
    return directions[index % 16];
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = size / 2;

      if (distance > maxDistance) {
        dx *= maxDistance / distance;
        dy *= maxDistance / distance;
      }

      setPosition({ x: dx, y: dy });

      // Normalize coordinates to -1 to 1 range
      const normalizedX = dx / maxDistance;
      const normalizedY = -dy / maxDistance; // Invert Y axis

      const direction = getDirection(-normalizedX, normalizedY);

      onMove && onMove(normalizedX, normalizedY, direction);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setActive(true);
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (active) {
      handleMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onRelease && onRelease();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setActive(true);
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (active) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [active]);

  return (
    <div
      ref={joystickRef}
      className={`relative rounded-full ${baseColor}`}
      style={{ width: size, height: size }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className={`absolute rounded-full ${stickColor}`}
        style={{
          width: size / 3,
          height: size / 3,
          left: `calc(50% - ${size / 6}px)`,
          top: `calc(50% - ${size / 6}px)`,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: active ? "none" : "transform 0.2s ease-out",
        }}
      />
    </div>
  );
};

export default Joystick;
