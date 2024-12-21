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
import { Progress } from "@/components/ui/progress";
import useLandscapeStore from "@/lib/store/landscape-detection";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";

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
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [progress, setProgress] = useState(0);

  // 进度条动画
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 1;
        });
      }, 20);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isVisible]);

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
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
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
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
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
      if (timer) clearTimeout(timer);
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
      audio.play().catch(() => {});
    }
  }, [enableSound, isMobile, isVisible]);

  const ignoreWarning = () => {
    hideDialog();
    if (persistPreference) {
      localStorage.setItem("landscapePreference", "ignored");
    }
    setHasInteracted(true);
  };

  return (
    <>
      <Dialog open={isVisible && isMobile} onOpenChange={() => {}}>
        <DialogContent
          className={cn(
            "bg-background/95 backdrop-blur-sm border-none shadow-2xl w-full max-w-md",
            className
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {customMessage || t("pleaseRotate")}
            </DialogTitle>
            <DialogDescription>{t("bestExperience")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="relative w-16 h-16 mx-auto">
              <svg
                className="w-full h-full transform rotate-90 text-foreground/80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
            </div>

            <Progress value={progress} className="w-full h-2" />

            <DialogDescription className="text-center">
              {isFullscreen ? t("fullscreenEnabled") : t("fullscreenDisabled")}
            </DialogDescription>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={ignoreWarning}
              className="w-full"
            >
              {t("ignore")}
            </Button>
            <Button
              variant="default"
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="w-full"
            >
              {isFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!isVisible && children}
    </>
  );
}
