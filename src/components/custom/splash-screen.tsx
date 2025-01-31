"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingAnimation } from "./loading-animation";
import Image from "next/image";
import useMediaQuery from "react-responsive";
import { Particles } from "@/components/ui/particles";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });

  // 使用相同的动画和加载逻辑
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
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
      }, 1000);

      return () => clearTimeout(hideTimer);
    }
  }, [loading]);

  // 优化动画变体配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        when: "beforeChildren",
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Particles
            className="absolute inset-0 z-0"
            quantity={100}
            staticity={30}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="splash"
                className={`relative z-10 flex ${
                  isLandscape
                    ? "lg:flex-row lg:items-center lg:space-x-12"
                    : "flex-col items-center space-y-8"
                } justify-center w-full max-w-4xl mx-auto px-6`}
                variants={containerVariants}
              >
                <motion.div variants={logoVariants} className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <Image
                    src="/atom.png"
                    alt="Logo"
                    width={isLandscape ? 180 : 120}
                    height={isLandscape ? 180 : 120}
                    className="relative drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    priority
                  />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="w-full max-w-md mx-auto"
                >
                  <LoadingAnimation progress={progress} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                ref={contentRef}
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 space-y-8"
                variants={containerVariants}
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-bold text-center md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  欢迎来到 Cobalt
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-gray-300 text-center max-w-2xl text-lg leading-relaxed"
                >
                  探索无限可能，开启您的数字之旅
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex space-x-4"
                >
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform">
                    开始探索
                  </button>
                  <button className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
                    了解更多
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
