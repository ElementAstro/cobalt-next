import React, { useState, useEffect } from "react";
import { Star, StarHalf, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RatingProps {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | string;
  color?: string;
  selectedColor?: string;
  hoverColor?: string;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  halfIcon?: React.ReactNode;
  tooltips?: string[];
  name?: string;
  precision?: 0.5 | 1;
  emptyIcon?: React.ReactNode;
  highlightOnlySelected?: boolean;
  allowClear?: boolean;
  clearIcon?: React.ReactNode;
  loading?: boolean;
  onHoverChange?: (value: number | null) => void;
  className?: string;
  labelText?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  animation?: "pulse" | "bounce" | "none";
}

const Rating: React.FC<RatingProps> = ({
  max = 5,
  value = 0,
  onChange,
  readonly = false,
  disabled = false,
  size = "md",
  color = "text-gray-300",
  selectedColor = "text-yellow-400",
  hoverColor = "text-yellow-200",
  icon = <Star />,
  selectedIcon,
  halfIcon = <StarHalf />,
  emptyIcon,
  tooltips,
  name,
  precision = 1,
  highlightOnlySelected = false,
  allowClear = false,
  clearIcon = "×",
  loading = false,
  onHoverChange,
  className,
  labelText,
  showValue = false,
  valueFormatter = (v) => v.toFixed(1),
  animation = "none",
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [value]);

  const handleMouseEnter = (index: number) => {
    if (!readonly && !disabled) {
      setHoverValue(index);
      onHoverChange && onHoverChange(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
    onHoverChange && onHoverChange(null);
  };

  const handleClick = (index: number) => {
    if (!readonly && !disabled && onChange) {
      if (allowClear && value === index) {
        onChange(0);
      } else {
        onChange(index);
      }
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-6 h-6";
      case "lg":
        return "w-8 h-8";
      default:
        return size;
    }
  };

  const getAnimationClass = (index: number) => {
    if (animation === "none") return "";
    if (index <= Math.floor(value)) {
      return animation === "pulse" ? "animate-pulse" : "animate-bounce";
    }
    return "";
  };

  const renderStar = (index: number) => {
    const isActive = (hoverValue !== null ? hoverValue : value) >= index;
    const isHalf =
      precision === 0.5 &&
      (hoverValue !== null ? hoverValue : value) === index - 0.5;
    const starIcon = isActive ? selectedIcon || icon : emptyIcon || icon;
    const starColor = isActive
      ? hoverValue !== null
        ? hoverColor
        : selectedColor
      : highlightOnlySelected && Math.floor(value) !== index - 1
      ? color
      : selectedColor;

    const star = (
      <span
        className={cn(
          `inline-block ${getSizeClass(
            size
          )} cursor-pointer transition-all duration-200`,
          starColor,
          getAnimationClass(index),
          disabled && "opacity-50 cursor-not-allowed",
          readonly && "cursor-default"
        )}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
        key={`${index}-${animationKey}`}
      >
        {isHalf ? halfIcon : starIcon}
      </span>
    );

    return tooltips && tooltips[index - 1] ? (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>{star}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltips[index - 1]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      star
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {labelText && (
        <label className="block text-sm font-medium text-gray-700">
          {labelText}
        </label>
      )}
      <div className="flex items-center space-x-1" role="radiogroup">
        {loading ? (
          <Loader2 className={`${getSizeClass(size)} animate-spin ${color}`} />
        ) : (
          <>
            {[...Array(max)].map((_, index) => renderStar(index + 1))}
            {allowClear && value > 0 && (
              <span
                className={`inline-block ${getSizeClass(
                  size
                )} ${color} cursor-pointer ml-2`}
                onClick={() => onChange && onChange(0)}
              >
                {clearIcon}
              </span>
            )}
          </>
        )}
        {showValue && !loading && (
          <span className="ml-2 text-sm text-gray-600">
            {valueFormatter(value)}
          </span>
        )}
      </div>
      {name && <Input type="hidden" name={name} value={value} />}
    </div>
  );
};

export default Rating;
