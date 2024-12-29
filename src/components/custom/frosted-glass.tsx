import React from "react";
import { cn } from "@/lib/utils";

interface FrostedGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  blur?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  intensity?: "none" | "light" | "medium" | "heavy" | "solid";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: "none" | "thin" | "medium" | "thick";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverEffect?: boolean;
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
  ...props
}: FrostedGlassProps) {
  return (
    <div
      className={cn(
        blurMap[blur],
        intensityMap[intensity],
        borderWidthMap[borderWidth],
        roundedMap[rounded],
        shadowMap[shadow],
        textColor,
        borderColor,
        bgColor,
        hoverEffect &&
          "transition-all duration-300 hover:scale-105 hover:shadow-xl",
        className
      )}
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
