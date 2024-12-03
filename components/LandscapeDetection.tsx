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
  const [isLandscape, setIsLandscape] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [autoRotateSupported, setAutoRotateSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();
  const resizeTimeout = useRef<number | null>(null);

  const checkFullscreen = useCallback(() => {
    setIsFullscreen(
      document.fullscreenElement !== null ||
        (document as any).webkitFullscreenElement !== null
    );
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      }
      checkFullscreen();
      console.log("Entered fullscreen");
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
      console.log("Exited fullscreen");
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, [checkFullscreen]);

  const debounce = (func: () => void, delay: number) => {
    return () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      resizeTimeout.current = window.setTimeout(func, delay);
    };
  };

  useEffect(() => {
    const checkOrientation = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      setIsLandscape(aspectRatio >= aspectRatioThreshold);
    };

    const checkDevice = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };

    const checkAutoRotate = () => {
      setAutoRotateSupported("orientation" in screen);
    };

    checkOrientation();
    checkDevice();
    checkAutoRotate();
    checkFullscreen();

    const debouncedCheckOrientation = debounce(checkOrientation, 300);
    window.addEventListener("resize", debouncedCheckOrientation);
    window.addEventListener("fullscreenchange", checkFullscreen);
    window.addEventListener("webkitfullscreenchange", checkFullscreen);
    if (autoRotateSupported) {
      window.addEventListener("orientationchange", debouncedCheckOrientation);
    }

    // Load user preference
    if (persistPreference) {
      const savedPreference = localStorage.getItem("landscapePreference");
      if (savedPreference === "ignored") {
        setIsLandscape(true);
      }
    }

    return () => {
      window.removeEventListener("resize", debouncedCheckOrientation);
      window.removeEventListener("fullscreenchange", checkFullscreen);
      window.removeEventListener("webkitfullscreenchange", checkFullscreen);
      if (autoRotateSupported) {
        window.removeEventListener(
          "orientationchange",
          debouncedCheckOrientation
        );
      }
    };
  }, [
    aspectRatioThreshold,
    autoRotateSupported,
    persistPreference,
    checkFullscreen,
  ]);

  useEffect(() => {
    if (isMobile && forceFullscreen && !isFullscreen) {
      enterFullscreen();
    }
  }, [isMobile, forceFullscreen, isFullscreen, enterFullscreen]);

  useEffect(() => {
    if (enableSound && isMobile && !isLandscape) {
      const audio = new Audio("/notification.mp3");
      audio.play();
    }
  }, [enableSound, isMobile, isLandscape]);

  const ignoreWarning = () => {
    setIsLandscape(true);
    if (persistPreference) {
      localStorage.setItem("landscapePreference", "ignored");
    }
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (isMobile && !isLandscape) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  }, [isMobile, isLandscape]);

  return (
    <>
      {!isMobile || isLandscape ? (
        <>{children}</>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`bg-gray-900 text-white ${className}`}>
            <DialogHeader>
              <DialogTitle>{customMessage || t("pleaseRotate")}</DialogTitle>
              <DialogDescription>{t("bestExperience")}</DialogDescription>
            </DialogHeader>
            <div className="w-16 h-16 mx-auto mb-4 animate-spin">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            {autoRotateSupported && (
              <DialogDescription className="text-center">
                {t("autoRotateEnabled")}
              </DialogDescription>
            )}
            <DialogDescription className="text-center">
              {isFullscreen ? t("fullscreenEnabled") : t("fullscreenDisabled")}
            </DialogDescription>
            <DialogFooter className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={ignoreWarning}
                aria-label={t("ignore")}
                className="bg-gray-700 text-white border-gray-600 w-full"
              >
                {t("ignore")}
              </Button>
              <Button
                variant="default"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                aria-label={
                  isFullscreen ? t("exitFullscreen") : t("enterFullscreen")
                }
                className="bg-blue-600 text-white w-full"
              >
                {isFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
