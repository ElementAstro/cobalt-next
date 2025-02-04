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
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface LandscapeStore {
  isVisible: boolean;
  showDialog: () => void;
  hideDialog: () => void;
  hasInteracted: boolean;
  setHasInteracted: (value: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const useLandscapeStore = create<LandscapeStore>((set) => ({
  isVisible: false,
  showDialog: () => set({ isVisible: true }),
  hideDialog: () => set({ isVisible: false }),
  hasInteracted: false,
  setHasInteracted: (value) => set({ hasInteracted: value }),
  isFullscreen: false,
  setIsFullscreen: (value) => set({ isFullscreen: value }),
}));

interface AnimationConfig {
  duration?: number;
  easing?: string;
  progressBarColor?: string;
  iconRotation?: boolean;
  bounceEffect?: boolean;
}

interface SoundConfig {
  enable?: boolean;
  soundUrl?: string;
  volume?: number;
  loop?: boolean;
}

interface LandscapeDetectorProps {
  children: React.ReactNode;
  aspectRatioThreshold?: number;
  customMessage?: string;
  soundConfig?: SoundConfig;
  animationConfig?: AnimationConfig;
  persistPreference?: boolean;
  forceFullscreen?: boolean;
  className?: string;
  customIcon?: React.ReactNode;
  backgroundImage?: string;
  layout?: "centered" | "bottom" | "top";
}

export default function LandscapeDetector({
  children,
  aspectRatioThreshold = 1,
  customMessage,
  soundConfig = {},
  animationConfig = {},
  persistPreference = false,
  forceFullscreen = true,
  className,
  customIcon,
  backgroundImage,
  layout = "centered",
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    enable: enableSound = false,
    soundUrl = "/notification.mp3",
    volume = 1,
    loop = false,
  } = soundConfig;

  const {
    duration = 2000,
    easing = "ease-in-out",
    progressBarColor = "primary",
    iconRotation = true,
    bounceEffect = true,
  } = animationConfig;

  // Progress animation with configurable duration
  useEffect(() => {
    let animationFrame: number;
    let startTime: number;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setProgress(progress);

      if (progress < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    if (isVisible) {
      setProgress(0);
      animationFrame = requestAnimationFrame(animateProgress);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, duration]);

  // Sound management
  useEffect(() => {
    if (enableSound && isMobile && isVisible) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [enableSound, isMobile, isVisible, soundUrl, volume, loop]);

  const checkFullscreen = useCallback(() => {
    const fullscreen =
      document.fullscreenElement !== null ||
      (document as any).webkitFullscreenElement !== null;
    setIsFullscreen(fullscreen);
  }, [setIsFullscreen]);

  const [error, setError] = useState<string | null>(null);

  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      } else {
        setError(t("fullscreenNotSupported"));
        return;
      }
      checkFullscreen();
    } catch (error) {
      setError(t("fullscreenError"));
      console.error("Failed to enter fullscreen:", error);
    }
  }, [checkFullscreen, t]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else {
        setError(t("fullscreenNotSupported"));
        return;
      }
      checkFullscreen();
    } catch (error) {
      setError(t("fullscreenError"));
      console.error("Failed to exit fullscreen:", error);
    }
  }, [checkFullscreen, t]);

  const checkOrientation = useCallback(() => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio < aspectRatioThreshold) {
      showDialog();
    } else {
      hideDialog();
    }
  }, [aspectRatioThreshold, showDialog, hideDialog]);

  const [sensitivity, setSensitivity] = useState(300); // Default 300ms debounce

  const debounce = useCallback((func: () => void, delay: number) => {
    let timer: number | null = null;
    return () => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(func, delay);
    };
  }, []);

  const debouncedCheckOrientation = useRef(
    debounce(checkOrientation, sensitivity)
  );

  const handleSensitivityChange = (value: number) => {
    setSensitivity(value);
    localStorage.setItem("landscapeSensitivity", value.toString());
  };

  useEffect(() => {
    const savedSensitivity = localStorage.getItem("landscapeSensitivity");
    if (savedSensitivity) {
      setSensitivity(Number(savedSensitivity));
    }
  }, []);

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

  const ignoreWarning = () => {
    hideDialog();
    if (persistPreference) {
      localStorage.setItem("landscapePreference", "ignored");
    }
    setHasInteracted(true);
  };

  const dialogClasses = cn(
    "bg-background/95 backdrop-blur-sm border-none shadow-2xl",
    "w-[90vw] max-w-[380px] p-4",
    "rounded-xl",
    {
      "fixed top-4 left-1/2 -translate-x-1/2": layout === "top",
      "fixed bottom-4 left-1/2 -translate-x-1/2": layout === "bottom",
      "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2":
        layout === "centered",
    },
    className
  );

  return (
    <>
      <Dialog open={isVisible && isMobile} onOpenChange={() => {}}>
        <DialogContent className={dialogClasses}>
          <div className="space-y-4">
            <DialogHeader className="space-y-2 text-center">
              <div className="relative w-12 h-12 mx-auto">
                {customIcon || (
                  <motion.svg
                    className={cn("w-full h-full text-foreground/80", {
                      "animate-rotate": iconRotation,
                      "animate-bounce": bounceEffect,
                    })}
                    animate={{
                      rotate: iconRotation ? [0, 90] : 0,
                      y: bounceEffect ? [0, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </motion.svg>
                )}
              </div>
              <DialogTitle className="text-lg font-semibold">
                {customMessage || t("pleaseRotate")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("bestExperience")}
              </DialogDescription>
            </DialogHeader>

            <Progress
              value={progress}
              className="h-1.5 rounded-full"
              style={{
                transition: `width ${duration}ms ${easing}`,
              }}
            />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <Label htmlFor="sensitivity" className="font-medium">
                  {t("sensitivity")}
                </Label>
                <motion.span
                  className="px-2 py-0.5 rounded bg-primary/10 font-medium"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  key={sensitivity}
                >
                  {sensitivity}ms
                </motion.span>
              </div>
              <Slider
                id="sensitivity"
                min={100}
                max={1000}
                step={50}
                value={[sensitivity]}
                onValueChange={([value]) => handleSensitivityChange(value)}
                className="w-full"
                aria-label={t("sensitivity")}
              />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              {isFullscreen ? t("fullscreenEnabled") : t("fullscreenDisabled")}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={ignoreWarning}
                className="w-full text-sm h-9"
              >
                {t("ignore")}
              </Button>
              <Button
                variant="default"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                className="w-full text-sm h-9"
              >
                {isFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {!isVisible && children}
    </>
  );
}
