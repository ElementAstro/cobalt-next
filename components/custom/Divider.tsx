import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  color?: string;
  thickness?: number;
  spacing?: number;
  label?: React.ReactNode;
  labelPosition?: "left" | "center" | "right";
  className?: string;
  children?: React.ReactNode;
}

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "solid",
  color = "currentColor",
  thickness = 1,
  spacing = 16,
  label,
  labelPosition = "center",
  className,
  children,
  ...props
}) => {
  const lineStyle = {
    backgroundColor: variant === "solid" ? color : "transparent",
    borderColor: color,
    borderStyle: variant,
    [orientation === "horizontal"
      ? "borderTopWidth"
      : "borderLeftWidth"]: `${thickness}px`,
  };

  const labelClass = cn(
    "flex-shrink-0 text-sm",
    orientation === "horizontal" ? `mx-${spacing / 4}` : `my-${spacing / 4}`,
    {
      "mr-auto": labelPosition === "left",
      "ml-auto": labelPosition === "right",
    }
  );

  return (
    <div
      className={cn(
        "flex items-center",
        orientation === "horizontal" ? "w-full" : "h-full flex-col",
        className
      )}
      {...props}
    >
      {(label || children) && labelPosition !== "right" && (
        <Separator
          orientation={orientation}
          className={cn(
            "flex-grow",
            orientation === "horizontal" ? "w-auto" : "h-auto",
            className
          )}
          style={{
            ...lineStyle,
            [orientation === "horizontal" ? "width" : "height"]:
              labelPosition === "center" ? "auto" : spacing,
            [orientation === "horizontal" ? "height" : "width"]: thickness,
          }}
        />
      )}
      {label || children ? (
        <div className={labelClass}>{label || children}</div>
      ) : null}
      <Separator
        orientation={orientation}
        className="flex-grow"
        style={{
          ...lineStyle,
          [orientation === "horizontal" ? "height" : "width"]: thickness,
        }}
      />
    </div>
  );
};

export { Divider };
