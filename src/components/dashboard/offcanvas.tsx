import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  backdrop?: boolean | "blur" | "dark";
  animation?: {
    duration?: number;
    easing?: string;
    type?: "slide" | "fade" | "scale";
  };
  scrollBehavior?: "inside" | "outside";
  className?: string;
  children: React.ReactNode;
}

const Offcanvas: React.FC<OffcanvasProps> = ({
  isOpen,
  onClose,
  position = "left",
  size = "md",
  backdrop = true,
  animation = {
    duration: 0.3,
    type: "slide",
  },
  scrollBehavior = "inside",
  className,
  children,
}) => {
  const offcanvasRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        offcanvasRef.current &&
        !offcanvasRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return position === "left" || position === "right" ? "w-64" : "h-64";
      case "md":
        return position === "left" || position === "right" ? "w-96" : "h-96";
      case "lg":
        return position === "left" || position === "right"
          ? "w-[600px]"
          : "h-[600px]";
      case "xl":
        return position === "left" || position === "right"
          ? "w-[800px]"
          : "h-[800px]";
      case "full":
        return position === "left" || position === "right"
          ? "w-screen"
          : "h-screen";
      default:
        return "";
    }
  };

  // Get animation variants
  const getAnimationVariants = () => {
    const baseVariants = {
      open: { opacity: 1 },
      closed: { opacity: 0 },
    };

    switch (animation.type) {
      case "slide":
        return {
          ...baseVariants,
          open: {
            ...baseVariants.open,
            x: position === "left" ? 0 : position === "right" ? 0 : undefined,
            y: position === "top" ? 0 : position === "bottom" ? 0 : undefined,
          },
          closed: {
            ...baseVariants.closed,
            x:
              position === "left"
                ? "-100%"
                : position === "right"
                ? "100%"
                : undefined,
            y:
              position === "top"
                ? "-100%"
                : position === "bottom"
                ? "100%"
                : undefined,
          },
        };
      case "fade":
        return baseVariants;
      case "scale":
        return {
          ...baseVariants,
          open: { ...baseVariants.open, scale: 1 },
          closed: { ...baseVariants.closed, scale: 0.95 },
        };
      default:
        return baseVariants;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {backdrop && (
            <motion.div
              className={cn(
                "fixed inset-0 bg-black/50 z-40",
                backdrop === "blur" && "backdrop-blur-sm",
                backdrop === "dark" && "bg-black/75"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: animation.duration }}
              onClick={onClose}
            />
          )}
          <motion.div
            ref={offcanvasRef}
            className={cn(
              "fixed z-50 bg-background shadow-lg",
              position === "left" && "inset-y-0 left-0",
              position === "right" && "inset-y-0 right-0",
              position === "top" && "inset-x-0 top-0",
              position === "bottom" && "inset-x-0 bottom-0",
              getSizeClasses(),
              scrollBehavior === "inside" && "overflow-y-auto",
              className
            )}
            variants={getAnimationVariants()}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{
              duration: animation.duration,
              ease: animation.easing,
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Offcanvas;
