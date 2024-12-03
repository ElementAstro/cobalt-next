import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  color?: string;
  content?: string;
  lineType?: "default" | "dashed";
  time?: string;
  title?: string;
  type?: "default" | "success" | "info" | "warning" | "error";
  iconSize?: number;
  icon?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  children?: ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  color,
  content,
  lineType = "default",
  time,
  title,
  type = "default",
  iconSize,
  icon,
  footer,
  header,
  children,
}) => {
  const dotColors = {
    default: "bg-gray-400 dark:bg-gray-500",
    success: "bg-green-500 dark:bg-green-600",
    error: "bg-red-500 dark:bg-red-600",
    warning: "bg-yellow-500 dark:bg-yellow-600",
    info: "bg-blue-500 dark:bg-blue-600",
  };

  const lineColors = {
    default: "border-gray-200 dark:border-gray-700",
    dashed: "border-dashed border-gray-200 dark:border-gray-700",
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      className={cn("relative pl-8 mb-8", "last:mb-0")}
      style={{ "--item-color": color } as React.CSSProperties}
    >
      {/* Dot or Icon */}
      <div
        className={cn(
          "absolute -left-3 top-2 w-6 h-6 rounded-full flex items-center justify-center",
          dotColors[type]
        )}
        style={{ width: iconSize, height: iconSize }}
      >
        {icon || <div className="default-icon" />}
      </div>

      {/* Line */}
      <div
        className={cn(
          "absolute left-0 top-6 bottom-0 w-0 border-l-2",
          lineColors[lineType]
        )}
      />

      {/* Content */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
        {header && <div className="timeline-item-header mb-2">{header}</div>}
        {title && (
          <h3 className="timeline-item-title text-lg font-semibold mb-1">
            {title}
          </h3>
        )}
        {time && (
          <div className="timeline-item-time text-sm text-gray-400 dark:text-gray-500 mb-2">
            {time}
          </div>
        )}
        <div className="timeline-item-body text-sm text-gray-600 dark:text-gray-300">
          {content || children}
        </div>
        {footer && <div className="timeline-item-footer mt-2">{footer}</div>}
      </div>
    </motion.div>
  );
};

export default TimelineItem;
