import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";
import React, { useEffect, useCallback } from "react";
import { useMediaQuery } from "react-responsive";

interface OffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "left" | "right";
  width?: string;
  showBackdrop?: boolean;
}

export function Offcanvas({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  width = "w-80 md:w-2/3",
  showBackdrop = true,
}: OffcanvasProps) {
  const controls = useAnimation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // 禁用页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 拖拽处理
  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 0.5;
      const velocity = side === "right" ? info.velocity.x : -info.velocity.x;
      const offset = side === "right" ? info.offset.x : -info.offset.x;

      if (velocity > 500 || offset > 100 * threshold) {
        onClose();
      } else {
        controls.start({ x: 0 });
      }
    },
    [controls, onClose, side]
  );

  const slideVariants = {
    hidden: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 400,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        delay: 0.2,
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
              aria-hidden="true"
            />
          )}

          <motion.div
            className={`fixed top-0 ${side}-0 ${width} h-full bg-background/95 shadow-2xl z-50 flex flex-col backdrop-blur supports-[backdrop-filter]:bg-background/60`}
            variants={slideVariants}
            initial="hidden"
            animate={controls}
            exit="exit"
            drag={isMobile ? "x" : false}
            dragDirectionLock
            dragElastic={0.1}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offcanvas-title"
          >
            <motion.div
              className="flex justify-between items-center border-b p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 id="offcanvas-title" className="text-xl font-semibold">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-accent"
                aria-label="关闭侧边栏"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {children}
            </motion.div>

            {isMobile && (
              <motion.div
                className="absolute top-1/2 -left-2 w-1 h-16 bg-accent/30 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
