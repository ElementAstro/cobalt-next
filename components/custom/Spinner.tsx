import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("inline-block rounded-full animate-spin", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
    },
    variant: {
      default: "border-4 border-primary border-r-transparent",
      secondary: "border-4 border-secondary border-r-transparent",
      success: "border-4 border-green-500 border-r-transparent",
      danger: "border-4 border-red-500 border-r-transparent",
      warning: "border-4 border-yellow-500 border-r-transparent",
      info: "border-4 border-blue-500 border-r-transparent",
      custom: "border-custom-color border-r-transparent",
    },
    animation: {
      spin: "animate-spin",
      pulse: "animate-pulse",
      ping: "animate-ping",
    },
    thickness: {
      thin: "border-2",
      medium: "border-4",
      thick: "border-6",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
    animation: "spin",
    thickness: "medium",
    shape: "circle",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
  duration?: number;
  customColor?: string;
  borderThickness?: "thin" | "medium" | "thick";
  shape?: "circle" | "square";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size,
      variant,
      animation,
      label,
      duration = 1,
      customColor,
      borderThickness = "medium",
      shape = "circle",
      style,
      ...props
    },
    ref
  ) => {
    const spinnerStyle = React.useMemo(
      () => ({
        ...style,
        animationDuration: `${duration}s`,
        borderColor: customColor || undefined,
      }),
      [style, duration, customColor]
    );

    const appliedVariant =
      variant === "custom" && customColor ? "custom" : variant;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Loading"}
        className={cn("relative", className)}
        {...props}
      >
        <div
          className={cn(
            spinnerVariants({
              size,
              variant: appliedVariant,
              animation,
              thickness: borderThickness,
              shape,
            })
          )}
          style={spinnerStyle}
        />
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
