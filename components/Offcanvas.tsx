// FILE: Offcanvas.tsx
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";

interface OffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Offcanvas({
  isOpen,
  onClose,
  title,
  children,
}: OffcanvasProps) {
  // 禁用页面滚动当 Offcanvas 打开时
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // 清理效果
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 侧边栏面板 */}
          <motion.div
            className="fixed top-0 right-0 w-80 md:w-2/3 max-w-full h-full bg-gray-800 dark:bg-gray-900 shadow-lg z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offcanvas-title"
          >
            {title && (
              <div className="flex justify-between items-center border-b border-gray-700 p-4">
                <h2
                  id="offcanvas-title"
                  className="text-xl font-semibold text-white"
                >
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="关闭侧边栏"
                >
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>
            )}
            {/* 使用 flex-1 和 overflow-y-auto 实现内部滚动 */}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
