"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VersionDisplayProps {
  version: string;
  prefix?: string;
  suffix?: string;
  tooltipContent?: string;
  showCopyButton?: boolean;
  showRefreshButton?: boolean;
  animationType?: "fade" | "scale" | "slide";
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onVersionClick?: () => void;
  onRefresh?: () => void;
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({
  version,
  prefix = "v",
  suffix = "",
  tooltipContent,
  showCopyButton = false,
  showRefreshButton = false,
  animationType = "fade",
  badgeVariant = "default",
  size = "md",
  className = "",
  onVersionClick,
  onRefresh,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sizeClasses = useMemo(
    () => ({
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-0.5",
      lg: "text-base px-3 py-1",
    }),
    []
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(version);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [version]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 2000);
    }
  }, [onRefresh]);

  const animationVariants = useMemo(
    () => ({
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      scale: {
        initial: { scale: 0 },
        animate: { scale: 1 },
        exit: { scale: 0 },
      },
      slide: {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 },
      },
    }),
    []
  );

  const VersionBadge = (
    <motion.div
      initial={animationVariants[animationType].initial}
      animate={animationVariants[animationType].animate}
      exit={animationVariants[animationType].exit}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2"
    >
      <Badge
        variant={badgeVariant}
        className={`${sizeClasses[size]} ${className} ${
          onVersionClick ? "cursor-pointer" : "cursor-default"
        } select-none flex items-center`}
        onClick={onVersionClick}
      >
        {prefix}
        {version}
        {suffix}
      </Badge>
      {showCopyButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          aria-label={isCopied ? "版本已复制" : "复制版本"}
          className="p-1"
        >
          {isCopied ? (
            <Check
              size={size === "sm" ? 12 : size === "md" ? 14 : 16}
              className="text-green-500"
            />
          ) : (
            <Copy size={size === "sm" ? 12 : size === "md" ? 14 : 16} />
          )}
        </Button>
      )}
      {showRefreshButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
          aria-label="刷新版本"
          className="p-1"
        >
          <RefreshCcw
            size={size === "sm" ? 12 : size === "md" ? 14 : 16}
            className={`${isRefreshing ? "animate-spin" : ""} text-gray-500`}
          />
        </Button>
      )}
    </motion.div>
  );

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {tooltipContent ? (
          <Tooltip key="tooltip">
            <TooltipTrigger asChild>{VersionBadge}</TooltipTrigger>
            <TooltipContent>
              <p>{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <React.Fragment key="no-tooltip">{VersionBadge}</React.Fragment>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default VersionDisplay;
