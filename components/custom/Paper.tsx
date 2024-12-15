import React, { useState } from "react";

interface PaperProps {
  children?: React.ReactNode;
  elevation?: number;
  variant?: "elevation" | "outlined";
  square?: boolean;
  className?: string;
  color?: string;
  borderRadius?: number;
  collapsible?: boolean;
  animated?: boolean;
}

export const Paper: React.FC<PaperProps> = ({
  children,
  elevation = 1,
  variant = "elevation",
  square = false,
  className = "",
  color,
  borderRadius,
  collapsible = false,
  animated = false,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Map elevation levels to Tailwind box-shadow classes
  const elevationClasses: { [key: number]: string } = {
    0: "shadow-none",
    1: "shadow-sm",
    2: "shadow",
    3: "shadow-md",
    4: "shadow-lg",
    6: "shadow-xl",
    8: "shadow-2xl",
    12: "shadow-3xl",
    16: "shadow-4xl",
    24: "shadow-5xl",
  };

  const paperClasses = [
    "bg-white", // Default background
    "text-gray-800", // Default text color
    "transition", // Animation
    "rounded-lg", // Default rounded corners
    "p-4", // Default padding
    collapsible ? "cursor-pointer overflow-hidden transition-all" : "",
    isCollapsed ? "max-h-12" : "max-h-full",
    animated ? "transform duration-300 hover:scale-105" : "",
    !square ? "rounded-lg" : "rounded-none",
    variant === "outlined"
      ? "border border-gray-300"
      : elevationClasses[elevation],
    className, // Custom classes from props
  ]
    .filter(Boolean)
    .join(" ");

  const paperStyle: React.CSSProperties = {
    backgroundColor: color,
    borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
  };

  return (
    <div
      className={paperClasses}
      style={paperStyle}
      onClick={handleToggle}
      {...props}
    >
      {children}
    </div>
  );
};
