import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}

const TimelineContext = createContext({ horizontal: false });

export function Timeline({
  children,
  className,
  horizontal = false,
}: TimelineProps) {
  return (
    <TimelineContext.Provider value={{ horizontal }}>
      <div
        className={cn(
          "relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md",
          horizontal ? "flex overflow-x-auto space-x-8" : "space-y-6",
          className
        )}
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </TimelineContext.Provider>
  );
}

interface TimelineItemProps {
  title: string;
  children?: React.ReactNode;
  time?: string;
  type?: "default" | "success" | "error" | "warning" | "info";
  icon?: React.ReactNode;
  collapsible?: boolean;
  onClick?: () => void;
}

export function TimelineItem({
  title,
  children,
  time,
  type = "default",
  icon,
  collapsible = false,
  onClick,
}: TimelineItemProps) {
  const { horizontal } = useContext(TimelineContext);
  const [isOpen, setIsOpen] = useState(true);

  const dotColors = {
    default: "bg-gray-400 dark:bg-gray-500",
    success: "bg-green-500 dark:bg-green-600",
    error: "bg-red-500 dark:bg-red-600",
    warning: "bg-yellow-500 dark:bg-yellow-600",
    info: "bg-blue-500 dark:bg-blue-600",
  };

  const lineColors = {
    default: "border-gray-200 dark:border-gray-700",
    success: "border-green-200 dark:border-green-700",
    error: "border-red-200 dark:border-red-700",
    warning: "border-yellow-200 dark:border-yellow-700",
    info: "border-blue-200 dark:border-blue-700",
  };

  const handleToggle = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      className={cn("relative", horizontal ? "flex-shrink-0 w-64" : "pl-8")}
    >
      {/* Dot or Icon */}
      <div
        className={cn(
          "absolute -left-3 top-2 w-6 h-6 rounded-full flex items-center justify-center",
          dotColors[type],
          horizontal ? "top-0 transform -translate-y-1/2" : ""
        )}
      >
        {icon ? icon : null}
      </div>

      {/* Line */}
      {!horizontal && (
        <div
          className={cn(
            "absolute left-0 top-6 bottom-0 w-0 border-l-2",
            lineColors[type],
            "last:border-transparent"
          )}
        />
      )}

      {/* Content */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
        <Button
          variant="ghost"
          className={cn(
            "flex items-center p-0 h-auto font-medium text-left w-full text-gray-800 dark:text-gray-100",
            onClick || collapsible ? "cursor-pointer" : "cursor-default"
          )}
          onClick={handleToggle}
        >
          {collapsible &&
            (isOpen ? (
              <ChevronDown className="mr-2 h-4 w-4" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            ))}
          {title}
        </Button>
        <AnimatePresence initial={false}>
          {(!collapsible || isOpen) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              {children && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {children}
                </div>
              )}
              {time && (
                <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {time}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
