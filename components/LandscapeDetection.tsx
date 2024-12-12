"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import useLandscapeStore from "@/lib/store/landscape-detection";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";

interface LandscapeDetectorProps {
  children: React.ReactNode;
  aspectRatioThreshold?: number;
  customMessage?: string;
  enableSound?: boolean;
  persistPreference?: boolean;
  forceFullscreen?: boolean;
  className?: string;
}

export default function LandscapeDetector({
  children,
  aspectRatioThreshold = 1,
  customMessage,
  enableSound = false,
  persistPreference = false,
  forceFullscreen = true,
  className,
}: LandscapeDetectorProps) {
  const {
    isVisible,
    showDialog,
    hideDialog,
    hasInteracted,
    setHasInteracted,
    isFullscreen,
    setIsFullscreen,
  } = useLandscapeStore();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const checkFullscreen = useCallback(() => {
    const fullscreen =
      document.fullscreenElement !== null ||
      (document as any).webkitFullscreenElement !== null;
    setIsFullscreen(fullscreen);
  }, [setIsFullscreen]);

  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      }
      checkFullscreen();
      console.log("进入全屏模式");
    } catch (error) {
      console.error("进入全屏模式失败:", error);
    }
  }, [checkFullscreen]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      checkFullscreen();
      console.log("退出全屏模式");
    } catch (error) {
      console.error("退出全屏模式失败:", error);
    }
  }, [checkFullscreen]);

  const checkOrientation = useCallback(() => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio < aspectRatioThreshold) {
      showDialog();
    } else {
      hideDialog();
    }
  }, [aspectRatioThreshold, showDialog, hideDialog]);

  const debounce = useCallback((func: () => void, delay: number) => {
    let timer: number | null = null;
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = window.setTimeout(func, delay);
    };
  }, []);

  const debouncedCheckOrientation = useRef(debounce(checkOrientation, 300));

  useEffect(() => {
    const handleResize = debouncedCheckOrientation.current;

    checkOrientation();
    checkFullscreen();

    window.addEventListener("resize", handleResize);
    window.addEventListener("fullscreenchange", checkFullscreen);
    window.addEventListener("webkitfullscreenchange", checkFullscreen);

    // 加载用户偏好
    if (persistPreference) {
      const savedPreference = localStorage.getItem("landscapePreference");
      if (savedPreference === "ignored") {
        hideDialog();
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fullscreenchange", checkFullscreen);
      window.removeEventListener("webkitfullscreenchange", checkFullscreen);
      // 确保组件存在时再尝试移除
      if (isVisible) {
        hideDialog();
      }
    };
  }, [
    checkOrientation,
    checkFullscreen,
    hideDialog,
    persistPreference,
    isVisible,
  ]);

  useEffect(() => {
    if (isMobile && forceFullscreen && !isFullscreen) {
      enterFullscreen();
    }
  }, [isMobile, forceFullscreen, isFullscreen, enterFullscreen]);

  useEffect(() => {
    if (enableSound && isMobile && isVisible) {
      const audio = new Audio("/notification.mp3");
      audio.play();
    }
  }, [enableSound, isMobile, isVisible]);

  const ignoreWarning = () => {
    hideDialog();
    if (persistPreference) {
      localStorage.setItem("landscapePreference", "ignored");
    }
    setHasInteracted(true);
  };

  const toggleThemeMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden ${className}`}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customMessage || t("pleaseRotate")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                    {t("bestExperience")}
                  </DialogDescription>
                </DialogHeader>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        staggerChildren: 0.2,
                      },
                    },
                  }}
                  className="space-y-4"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin"
                    >
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <DialogDescription className="text-center">
                      {isFullscreen
                        ? t("fullscreenEnabled")
                        : t("fullscreenDisabled")}
                    </DialogDescription>
                  </motion.div>
                </motion.div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Button
                      variant="outline"
                      onClick={ignoreWarning}
                      aria-label={t("ignore")}
                      className="bg-gray-700 text-white border-gray-600 w-full"
                    >
                      {t("ignore")}
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Button
                      variant="default"
                      onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                      aria-label={
                        isFullscreen
                          ? t("exitFullscreen")
                          : t("enterFullscreen")
                      }
                      className="bg-blue-600 text-white w-full"
                    >
                      {isFullscreen
                        ? t("exitFullscreen")
                        : t("enterFullscreen")}
                    </Button>
                  </motion.div>
                </DialogFooter>
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                >
                  <Button
                    onClick={toggleThemeMode}
                    variant="ghost"
                    className="mt-4 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {theme === "dark" ? t("switchToLight") : t("switchToDark")}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isVisible && children}
    </>
  );
}
