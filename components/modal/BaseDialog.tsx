import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/use-media-query";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  position?: "center" | "top" | "bottom" | "left" | "right";
  fullScreen?: boolean;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  icon?: React.ReactNode;
  animationPreset?: "fade" | "slide" | "scale" | "rotate";
  blur?: "none" | "sm" | "md" | "lg";
  glassmorphism?: boolean;
  scrollBehavior?: "inside" | "outside";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  rotate: {
    initial: { rotate: -10, opacity: 0 },
    animate: { rotate: 0 },
    exit: { rotate: 10, opacity: 0 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
  elastic: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
    transition: { type: "spring", damping: 10 },
  },
};

const sizeMap = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function BaseDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  position = "center",
  fullScreen = false,
  showCloseButton = true,
  closeOnClickOutside = true,
  icon,
  animationPreset = "fade",
  blur = "sm",
  glassmorphism = false,
  scrollBehavior = "inside",
  size = "md",
}: BaseDialogProps) {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const positionAnimation = {
    center: animations[animationPreset],
    top: animations.slideDown,
    bottom: animations.slideUp,
    left: {
      ...animations[animationPreset],
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 },
    },
    right: {
      ...animations[animationPreset],
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 },
    },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeOnClickOutside ? onClose : undefined}
    >
      <DialogContent
        className={cn(
          "transition-all duration-300",
          "dark:bg-gray-900 dark:text-white",
          "backdrop-blur-sm bg-opacity-95",
          "border dark:border-gray-800",
          "shadow-lg dark:shadow-gray-900/30",
          fullScreen && "w-screen h-screen max-w-none m-0 rounded-none",
          position === "top" && "items-start",
          position === "bottom" && "items-end",
          position === "left" && "justify-start",
          position === "right" && "justify-end",
          isMobile && "w-[95vw] max-h-[90vh] overflow-y-auto",
          "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700",
          "transition-transform ease-in-out",
          isMobile && "w-[95vw] max-h-[95vh] p-4",
          isMobile && fullScreen && "w-screen h-screen p-0",
          className,
          sizeMap[size],
          glassmorphism && "bg-opacity-30 backdrop-blur-xl border-opacity-20",
          `backdrop-blur-${blur}`,
          scrollBehavior === "inside" ? "overflow-y-auto" : "overflow-visible",
          "transform-gpu", // 使用GPU加速
          "will-change-transform" // 优化动画性能
        )}
      >
        <motion.div
          initial={positionAnimation[position].initial}
          animate={positionAnimation[position].animate}
          exit={positionAnimation[position].exit}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {(icon || title || description) && (
            <DialogHeader>
              <div className="flex items-center space-x-2">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <div>
                  {title && <DialogTitle>{title}</DialogTitle>}
                  {description && (
                    <DialogDescription>{description}</DialogDescription>
                  )}
                </div>
              </div>
            </DialogHeader>
          )}
          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
