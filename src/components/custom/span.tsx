"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  tooltip?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  hoverEffect?: "opacity" | "scale" | "underline" | "none";
  animate?: "pulse" | "bounce" | "shake" | "none";
  size?: "sm" | "md" | "lg";
  truncate?: boolean;
  maxWidth?: string;
  copyable?: boolean;
  breakWords?: boolean;
  highlightOnHover?: boolean;
}

export const Span: React.FC<SpanProps> = ({
  children,
  icon: Icon,
  tooltip,
  variant = "default",
  hoverEffect = "none",
  animate = "none",
  size = "md",
  truncate = false,
  maxWidth,
  copyable = false,
  breakWords = false,
  highlightOnHover = false,
  className,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const variantStyles = {
    default: "text-gray-800 dark:text-gray-200",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const hoverStyles = {
    opacity: "hover:opacity-80",
    scale: "hover:scale-105",
    underline: "hover:underline",
    none: "",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(children as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const spanContent = (
    <span
      className={cn(
        "inline-flex items-center",
        variantStyles[variant],
        sizeStyles[size],
        hoverStyles[hoverEffect],
        truncate && "truncate",
        breakWords && "break-words",
        highlightOnHover && "hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      style={{ maxWidth: maxWidth }}
      {...props}
    >
      {Icon && <Icon className="mr-1 h-4 w-4" />}
      {children}
      {copyable && (
        <button
          onClick={handleCopy}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          {isCopied ? "✓" : "📋"}
        </button>
      )}
    </span>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{spanContent}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return spanContent;
};
