import React from "react";
import { cn } from "@/lib/utils";

interface FrostedGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  blur?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | number;
  intensity?: "none" | "light" | "medium" | "heavy" | "solid";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: "none" | "thin" | "medium" | "thick";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverEffect?: boolean;
  opacity?: number;
  transitionDuration?: number;
  gradient?: string;
  clickEffect?: boolean;
  hoverScale?: number;
  hoverRotate?: number;
}

const blurMap = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

const intensityMap = {
  none: "bg-transparent",
  light: "bg-white/10",
  medium: "bg-white/20",
  heavy: "bg-white/30",
  solid: "bg-white",
};

const borderWidthMap = {
  none: "border-0",
  thin: "border",
  medium: "border-2",
  thick: "border-4",
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const shadowMap = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export function FrostedGlass({
  children,
  className,
  blur = "md",
  intensity = "medium",
  bgColor,
  textColor = "text-white",
  borderColor = "border-white/20",
  borderWidth = "thin",
  rounded = "lg",
  shadow = "lg",
  hoverEffect = false,
  opacity = 1,
  transitionDuration = 300,
  gradient,
  clickEffect = false,
  hoverScale = 1.05,
  hoverRotate = 0,
  ...props
}: FrostedGlassProps) {
  return (
    <div
      className={cn(
        typeof blur === 'number' ? '' : blurMap[blur],
        intensityMap[intensity],
        borderWidthMap[borderWidth],
        roundedMap[rounded],
        shadowMap[shadow],
        textColor,
        borderColor,
        bgColor,
        hoverEffect && `transition-all duration-${transitionDuration} hover:scale-${hoverScale} hover:shadow-xl hover:rotate-${hoverRotate}`,
        clickEffect && 'active:scale-95',
        className
      )}
      style={{
        backdropFilter: typeof blur === 'number' ? `blur(${blur}px)` : "blur(8px)",
        WebkitBackdropFilter: typeof blur === 'number' ? `blur(${blur}px)` : "blur(8px)",
        opacity,
        background: gradient,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
