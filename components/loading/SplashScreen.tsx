"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingAnimation } from "./LoadingAnimation";
import Image from "next/image";
import useMediaQuery from "react-responsive";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });

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
      }, 700);

      return () => clearTimeout(hideTimer);
    }
  }, [loading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 bg-gray-900"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="splash"
                className={`flex flex-col items-center justify-center min-h-screen
                  ${isLandscape ? "lg:flex-row lg:space-x-8" : "space-y-6"}`}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Image
                    src="/atom.png"
                    alt="Logo"
                    width={isLandscape ? 150 : 100}
                    height={isLandscape ? 150 : 100}
                    className="drop-shadow-2xl"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <LoadingAnimation progress={progress} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                ref={contentRef}
                className="flex flex-col items-center justify-center min-h-screen p-4"
                variants={containerVariants}
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-bold text-gray-100 text-center
                    md:text-5xl lg:text-6xl"
                >
                  欢迎来到 Cobalt
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="mt-4 text-gray-400 text-center max-w-lg"
                >
                  探索无限可能，开启您的数字之旅
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
