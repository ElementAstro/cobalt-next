import React, { useState } from "react";
import { motion } from "framer-motion";

type GradientType = "primary" | "info" | "success" | "warning" | "error";
type TextAlign = "left" | "center" | "right";

interface Gradient {
  from: string;
  to: string;
  deg?: number | string;
}

interface GradientTextProps {
  gradient?: string | Gradient;
  size?:
    | number
    | string
    | {
        xs?: number | string;
        sm?: number | string;
        md?: number | string;
        lg?: number | string;
        xl?: number | string;
      };
  type?: GradientType;
  children: React.ReactNode;
  fontWeight?: number | string;
  textAlign?: TextAlign;
  animate?: boolean;
  hoverEffect?: boolean;
  className?: string;
  darkThemeGradient?: string | Gradient; // Gradient for dark theme
}

const defaultGradients: Record<GradientType, Gradient> = {
  primary: { from: "#409EFF", to: "#2D6FF7", deg: "90deg" },
  info: { from: "#909399", to: "#6B6D71", deg: "90deg" },
  success: { from: "#67C23A", to: "#4D9E2D", deg: "90deg" },
  warning: { from: "#E6A23C", to: "#C87E2D", deg: "90deg" },
  error: { from: "#F56C6C", to: "#E24B4B", deg: "90deg" },
};

const GradientText: React.FC<GradientTextProps> = ({
  gradient,
  size = "md",
  type = "primary",
  children,
  fontWeight = "normal",
  textAlign = "left",
  animate = false,
  hoverEffect = false,
  className = "",
  darkThemeGradient,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getGradientStyle = (isDark: boolean) => {
    if (isDark && darkThemeGradient) {
      if (typeof darkThemeGradient === "string") {
        return darkThemeGradient;
      } else {
        const { from, to, deg = "90deg" } = darkThemeGradient;
        return `linear-gradient(${deg}, ${from}, ${to})`;
      }
    }

    if (typeof gradient === "string") {
      return gradient;
    } else if (typeof gradient === "object") {
      const { from, to, deg = "90deg" } = gradient;
      return `linear-gradient(${deg}, ${from}, ${to})`;
    } else {
      const { from, to, deg } = defaultGradients[type];
      return `linear-gradient(${deg}, ${from}, ${to})`;
    }
  };

  const getResponsiveSizeClasses = () => {
    if (typeof size === "object") {
      return [
        size.xs ? `text-${size.xs}` : "",
        size.sm ? `sm:text-${size.sm}` : "",
        size.md ? `md:text-${size.md}` : "",
        size.lg ? `lg:text-${size.lg}` : "",
        size.xl ? `xl:text-${size.xl}` : "",
      ]
        .filter(Boolean)
        .join(" ");
    }

    return typeof size === "number" ? `text-[${size}px]` : `text-${size}`;
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: animate ? -10 : 0 }}
      animate={{ opacity: 1, y: animate ? 0 : 0 }}
      whileHover={hoverEffect ? { scale: 1.05, filter: "brightness(1.2)" } : {}}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: getGradientStyle(false),
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
        fontWeight,
        textAlign,
      }}
      className={`inline-block ${getResponsiveSizeClasses()} ${className} ${
        hoverEffect ? "transform transition-transform duration-300" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
