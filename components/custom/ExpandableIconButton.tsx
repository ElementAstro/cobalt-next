"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeIcon as type, LucideIcon } from "lucide-react";

interface ExpandableIconButtonProps {
  icon: LucideIcon;
  text: string;
  expandDirection?: "right" | "left" | "up" | "down";
  expandTrigger?: "hover" | "click";
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  iconSize?: number;
  fontSize?: number;
  animationDuration?: number;
  borderRadius?: string;
  shadow?: string;
  hoverShadow?: string;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  iconRotation?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderColor?: string;
  borderWidth?: string;
  onClick?: () => void;
}

export function ExpandableIconButton({
  icon: Icon,
  text,
  expandDirection = "right",
  expandTrigger = "hover",
  backgroundColor = "bg-primary",
  textColor = "text-primary-foreground",
  hoverBackgroundColor = "hover:bg-primary-dark",
  hoverTextColor = "hover:text-primary-foreground",
  iconSize = 20,
  fontSize = 14,
  animationDuration = 0.3,
  borderRadius = "rounded-full",
  shadow = "shadow-md",
  hoverShadow = "hover:shadow-lg",
  gradient = false,
  gradientFrom = "from-primary",
  gradientTo = "to-primary-dark",
  iconRotation = 0,
  textTransform = "none",
  fontWeight = "font-medium",
  padding = "p-2",
  margin = "m-1",
  borderColor = "border-transparent",
  borderWidth = "border-2",
  onClick,
}: ExpandableIconButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    if (expandTrigger === "click") {
      setIsExpanded(!isExpanded);
    }
  };

  const handleMouseEnter = () => {
    if (expandTrigger === "hover") {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (expandTrigger === "hover") {
      setIsExpanded(false);
    }
  };

  const getExpandStyles = () => {
    switch (expandDirection) {
      case "left":
        return { flexDirection: "row-reverse" as const };
      case "up":
        return { flexDirection: "column-reverse" as const };
      case "down":
        return { flexDirection: "column" as const };
      default:
        return { flexDirection: "row" as const };
    }
  };

  const getTextStyles = () => {
    switch (expandDirection) {
      case "left":
      case "right":
        return { width: isExpanded ? "auto" : 0, height: "auto" };
      case "up":
      case "down":
        return { width: "auto", height: isExpanded ? "auto" : 0 };
    }
  };

  const gradientClass = gradient
    ? `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
    : backgroundColor;

  return (
    <motion.button
      className={`
        flex items-center justify-center overflow-hidden
        ${borderRadius} ${shadow} ${hoverShadow} ${gradientClass}
        ${textColor} ${hoverBackgroundColor} ${hoverTextColor}
        ${padding} ${margin} ${borderColor} ${borderWidth}
        transition-all duration-300 ease-in-out
      `}
      style={getExpandStyles()}
      onClick={(e) => {
        handleExpand();
        onClick && onClick();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`flex items-center justify-center w-10 h-10`}
        animate={{ rotate: isExpanded ? iconRotation : 0 }}
        transition={{ duration: animationDuration }}
      >
        <Icon size={iconSize} />
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            className={`
              overflow-hidden whitespace-nowrap
              ${fontWeight} ${textTransform}
            `}
            style={{ fontSize: `${fontSize}px` }}
            initial={getTextStyles()}
            animate={{ ...getTextStyles(), opacity: 1 }}
            exit={{ ...getTextStyles(), opacity: 0 }}
            transition={{ duration: animationDuration, ease: "easeInOut" }}
          >
            {["right", "down"].includes(expandDirection) && (
              <span className="ml-2">{text}</span>
            )}
            {["left", "up"].includes(expandDirection) && (
              <span className="mr-2">{text}</span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
