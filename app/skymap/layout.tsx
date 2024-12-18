"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [isLocking, setIsLocking] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscape);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    // 添加触摸事件处理
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventZoom, { passive: false });

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchmove", preventZoom);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-black w-full h-full">
      <AnimatePresence>
        {!isLandscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <div className="text-center text-white space-y-4">
              <motion.div
                animate={{ rotate: 90 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 mx-auto"
              >
                📱
              </motion.div>
              <p className="text-lg font-semibold">请旋转设备至横屏模式</p>
              <p className="text-sm text-gray-400">获得最佳观看体验</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export default Layout;
