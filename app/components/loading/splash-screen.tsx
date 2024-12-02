"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingAnimation } from "./loading-animation";
import Image from "next/image";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center min-h-screen"
          >
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <LoadingAnimation progress={progress} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-screen"
          >
            <h1 className="text-4xl font-bold text-gray-100">
              欢迎来到我的应用！
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
