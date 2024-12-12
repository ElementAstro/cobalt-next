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
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 10, opacity: 0 },
  },
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
}: BaseDialogProps) {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
          className
        )}
      >
        <motion.div
          initial={animations[animationPreset].initial}
          animate={animations[animationPreset].animate}
          exit={animations[animationPreset].exit}
          transition={{ duration: 0.2 }}
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
