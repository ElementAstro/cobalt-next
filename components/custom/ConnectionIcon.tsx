import React, { useState } from "react";

interface BluetoothIconProps {
  size?: number;
  color?: string;
  strength?: "none" | "weak" | "medium" | "strong" | number;
  className?: string;
  strokeWidth?: number;
  shape?: "square" | "circle";
  animate?: boolean;
  showStrengthValue?: boolean;
  theme?: "default" | "colorful" | "monochrome";
}

export const BluetoothIcon: React.FC<BluetoothIconProps> = ({
  size = 24,
  color = "currentColor",
  strength = "strong",
  className = "",
  strokeWidth = 2,
  shape = "square",
  animate = false,
  showStrengthValue = false,
  theme = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = () => {
    if (theme === "colorful") {
      return "#2196F3";
    }
    if (theme === "monochrome") {
      return "currentColor";
    }
    return color;
  };

  const getOpacity = () => {
    if (typeof strength === "number") {
      return Math.max(0.2, Math.min(1, strength / 100));
    }
    if (strength === "none") return 0.2;
    if (strength === "weak") return 0.4;
    if (strength === "medium") return 0.7;
    return 1;
  };

  const strengthValue =
    typeof strength === "number"
      ? strength
      : strength === "none"
      ? 0
      : strength === "weak"
      ? 33
      : strength === "medium"
      ? 66
      : 100;

  const animationClass = animate ? "animate-pulse" : "";
  const shapeClass = shape === "circle" ? "rounded-full" : "";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${shapeClass} ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={getColor()}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`bluetooth-icon ${animationClass}`}
        style={{ opacity: getOpacity() }}
      >
        <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
      </svg>
      {showStrengthValue && (
        <div
          className="absolute bottom-0 right-0 bg-white rounded-full px-1 text-xs font-bold"
          style={{ color: getColor() }}
        >
          {strengthValue}%
        </div>
      )}
      {isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          Bluetooth Strength: {strengthValue}%
        </div>
      )}
    </div>
  );
};

interface WiFiIconProps {
  size?: number;
  color?: string;
  strength?: "none" | "weak" | "medium" | "strong" | number;
  className?: string;
  strokeWidth?: number;
  shape?: "square" | "circle";
  animate?: boolean;
  showStrengthValue?: boolean;
  theme?: "default" | "colorful" | "monochrome";
}

export const WiFiIcon: React.FC<WiFiIconProps> = ({
  size = 24,
  color = "currentColor",
  strength = "strong",
  className = "",
  strokeWidth = 2,
  shape = "square",
  animate = false,
  showStrengthValue = false,
  theme = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPathOpacity = (pathStrength: "weak" | "medium" | "strong") => {
    if (typeof strength === "number") {
      if (strength <= 0) return 0.2;
      if (pathStrength === "weak" && strength > 0) return 1;
      if (pathStrength === "medium" && strength > 33) return 1;
      if (pathStrength === "strong" && strength > 66) return 1;
      return 0.2;
    }

    if (strength === "none") return 0.2;
    if (strength === "weak" && pathStrength !== "weak") return 0.2;
    if (strength === "medium" && pathStrength === "strong") return 0.2;
    return 1;
  };

  const getColor = (pathStrength: "weak" | "medium" | "strong") => {
    if (theme === "colorful") {
      if (pathStrength === "weak") return "#FF9800";
      if (pathStrength === "medium") return "#4CAF50";
      return "#2196F3";
    }
    if (theme === "monochrome") {
      return "currentColor";
    }
    return color;
  };

  const strengthValue =
    typeof strength === "number"
      ? strength
      : strength === "none"
      ? 0
      : strength === "weak"
      ? 33
      : strength === "medium"
      ? 66
      : 100;

  const animationClass = animate ? "animate-pulse" : "";
  const shapeClass = shape === "circle" ? "rounded-full" : "";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${shapeClass} ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`wifi-icon ${animationClass}`}
      >
        <path
          d="M5 12.55a11 11 0 0 1 14.08 0"
          stroke={getColor("strong")}
          opacity={getPathOpacity("strong")}
        />
        <path
          d="M1.42 9a16 16 0 0 1 21.16 0"
          stroke={getColor("strong")}
          opacity={getPathOpacity("strong")}
        />
        <path
          d="M8.53 16.11a6 6 0 0 1 6.95 0"
          stroke={getColor("medium")}
          opacity={getPathOpacity("medium")}
        />
        <path
          d="M12 20h.01"
          stroke={getColor("weak")}
          opacity={getPathOpacity("weak")}
        />
      </svg>
      {showStrengthValue && (
        <div
          className="absolute bottom-0 right-0 bg-white rounded-full px-1 text-xs font-bold"
          style={{ color }}
        >
          {strengthValue}%
        </div>
      )}
      {isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          Signal Strength: {strengthValue}%
        </div>
      )}
    </div>
  );
};
