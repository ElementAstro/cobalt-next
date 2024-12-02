"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingAnimation } from "./LoadingAnimation";
import Image from "next/image";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 200);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoading(false);
        observer.disconnect();
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 700); // 延迟隐藏时间与动画持续时间一致

      return () => clearTimeout(hideTimer);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="min-h-screen bg-gray-900"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="splash"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col items-center justify-center min-h-screen"
              >
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
                <LoadingAnimation progress={progress} />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center min-h-screen"
                ref={contentRef}
              >
                <h1 className="text-4xl font-bold text-gray-100">
                  欢迎来到Cobalt！
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
