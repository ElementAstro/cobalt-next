"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  target: string;
  content: string | React.ReactNode;
  skippable?: boolean;
  interaction?: () => void;
  condition?: () => boolean;
  customStyle?: React.CSSProperties;
  hotkey?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  tooltipStyle?: React.CSSProperties;
  animation?: {
    type?: "fade" | "slide" | "zoom";
    duration?: number;
    delay?: number;
  };
  onEnter?: () => void;
  onExit?: () => void;
  validate?: () => boolean;
  customComponent?: React.ComponentType;
}

interface GuideMaskProps {
  steps: Step[];
  onComplete: () => void;
  language?: "en" | "zh" | "es" | "fr" | "de" | "ja" | "ko";
  saveProgress?: boolean;
  skipAll?: boolean;
  showProgress?: boolean;
  progressFormat?: (current: number, total: number) => string;
  onStepChange?: (current: number, previous: number) => void;
  onSkip?: (current: number) => void;
  onError?: (error: Error) => void;
  maskColor?: string;
  maskOpacity?: number;
  clickThrough?: boolean;
  disableBackdrop?: boolean;
  keyboardNavigation?: boolean;
  scrollPadding?: number;
  scrollBehavior?: "auto" | "smooth";
  debug?: boolean;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

const translations = {
  en: {
    previous: "Previous",
    next: "Next",
    finish: "Finish",
    skip: "Skip",
    skipAll: "Skip All",
    interact: "Interact",
    hotkeys: "Show Hotkeys",
    hideHotkeys: "Hide Hotkeys",
    progress: "Step {current} of {total}",
  },
  zh: {
    previous: "上一步",
    next: "下一步",
    finish: "完成",
    skip: "跳过",
    skipAll: "全部跳过",
    interact: "交互",
    hotkeys: "显示快捷键",
    hideHotkeys: "隐藏快捷键",
    progress: "第 {current} 步，共 {total} 步",
  },
  es: {
    previous: "Anterior",
    next: "Siguiente",
    finish: "Terminar",
    skip: "Saltar",
    skipAll: "Saltar Todo",
    interact: "Interactuar",
    hotkeys: "Mostrar Atajos",
    hideHotkeys: "Ocultar Atajos",
    progress: "Paso {current} de {total}",
  },
  fr: {
    previous: "Précédent",
    next: "Suivant",
    finish: "Terminer",
    skip: "Sauter",
    skipAll: "Tout sauter",
    interact: "Interagir",
    hotkeys: "Afficher les raccourcis",
    hideHotkeys: "Masquer les raccourcis",
    progress: "Étape {current} sur {total}",
  },
  de: {
    previous: "Zurück",
    next: "Weiter",
    finish: "Beenden",
    skip: "Überspringen",
    skipAll: "Alle überspringen",
    interact: "Interagieren",
    hotkeys: "Tastenkombinationen anzeigen",
    hideHotkeys: "Tastenkombinationen ausblenden",
    progress: "Schritt {current} von {total}",
  },
  ja: {
    previous: "前へ",
    next: "次へ",
    finish: "完了",
    skip: "スキップ",
    skipAll: "すべてスキップ",
    interact: "操作",
    hotkeys: "ショートカットを表示",
    hideHotkeys: "ショートカットを非表示",
    progress: "{current}/{total} ステップ",
  },
  ko: {
    previous: "이전",
    next: "다음",
    finish: "완료",
    skip: "건너뛰기",
    skipAll: "모두 건너뛰기",
    interact: "상호 작용",
    hotkeys: "단축키 표시",
    hideHotkeys: "단축키 숨기기",
    progress: "{current}/{total} 단계",
  },
};

export function GuideMask({
  steps,
  onComplete,
  language = "en",
  saveProgress = false,
  skipAll = false,
  showProgress = true,
  progressFormat,
  onStepChange,
  onSkip,
  onError,
  maskColor,
  maskOpacity = 0.7,
  clickThrough = false,
  disableBackdrop = false,
  keyboardNavigation = true,
  scrollPadding = 16,
  scrollBehavior = "smooth",
  debug = false,
}: GuideMaskProps) {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (saveProgress) {
      try {
        const saved = localStorage.getItem("guideMaskProgress");
        return saved ? Math.min(parseInt(saved, 10), steps.length - 1) : 0;
      } catch (error) {
        onError?.(error as Error);
        return 0;
      }
    }
    return 0;
  });
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const theme = "dark";
  const t = translations[language];
  const containerRef = useRef<HTMLDivElement>(null);

  const updateTargetRect = useCallback(() => {
    if (steps.length === 0) return;

    const currentStepData = steps[currentStep];
    try {
      if (currentStepData.condition && !currentStepData.condition()) {
        handleNext();
        return;
      }

      if (currentStepData.validate && !currentStepData.validate()) {
        throw new Error(`Validation failed for step ${currentStep}`);
      }

      const targetElement = document.querySelector(currentStepData.target);
      if (targetElement && containerRef.current) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate position with scroll padding
        const top = rect.top - scrollPadding;
        const left = rect.left - scrollPadding;
        const width = rect.width + scrollPadding * 2;
        const height = rect.height + scrollPadding * 2;

        setTargetRect({
          top,
          left,
          width,
          height,
          bottom: top + height,
          right: left + width,
          x: left,
          y: top,
        });

        // Scroll to element with configurable behavior
        targetElement.scrollIntoView({
          behavior: scrollBehavior,
          block: "center",
          inline: "center",
        });

        // Call onEnter callback
        currentStepData.onEnter?.();
      } else {
        setTargetRect(null);
      }
    } catch (error) {
      onError?.(error as Error);
      handleNext();
    }
  }, [currentStep, steps, scrollPadding, scrollBehavior, onError]);

  useEffect(() => {
    if (steps.length === 0) {
      onComplete();
      return;
    }

    updateTargetRect();
    const resizeObserver = new ResizeObserver(updateTargetRect);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [currentStep, steps, onComplete, updateTargetRect]);

  useEffect(() => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "Enter") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "Escape") {
        onComplete();
      } else if (event.key === "s" && event.ctrlKey) {
        handleSkipAll();
      } else {
        const currentStepData = steps[currentStep];
        if (
          currentStepData.hotkey &&
          event.key.toLowerCase() === currentStepData.hotkey.toLowerCase()
        ) {
          handleInteraction();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, steps, onComplete, keyboardNavigation]);

  useEffect(() => {
    if (saveProgress) {
      try {
        localStorage.setItem("guideMaskProgress", currentStep.toString());
      } catch (error) {
        onError?.(error as Error);
      }
    }
  }, [currentStep, saveProgress, onError]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      let nextStep = currentStep + 1;
      while (
        nextStep < steps.length &&
        steps[nextStep].condition &&
        !steps[nextStep].condition?.()
      ) {
        nextStep++;
      }
      if (nextStep < steps.length) {
        const previousStep = currentStep;
        steps[currentStep].onExit?.();
        setCurrentStep(nextStep);
        onStepChange?.(nextStep, previousStep);
      } else {
        onComplete();
      }
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      let prevStep = currentStep - 1;
      while (
        prevStep >= 0 &&
        steps[prevStep].condition &&
        steps[prevStep].condition instanceof Function &&
        steps[prevStep].condition &&
        !steps[prevStep].condition?.()
      ) {
        prevStep--;
      }
      if (prevStep >= 0) {
        const previousStep = currentStep;
        steps[currentStep].onExit?.();
        setCurrentStep(prevStep);
        onStepChange?.(prevStep, previousStep);
      }
    }
  };

  const handleSkip = () => {
    onSkip?.(currentStep);
    handleNext();
  };

  const handleSkipAll = () => {
    onSkip?.(currentStep);
    onComplete();
  };

  const handleInteraction = () => {
    try {
      if (steps[currentStep].interaction) {
        steps[currentStep].interaction();
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  if (steps.length === 0 || !steps[currentStep] || skipAll) return null;

  const currentStepData = steps[currentStep];
  const progressText = progressFormat
    ? progressFormat(currentStep + 1, steps.length)
    : t.progress
        .replace("{current}", (currentStep + 1).toString())
        .replace("{total}", steps.length.toString());

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 ${
        disableBackdrop ? "" : theme === "dark" ? "bg-black" : "bg-white"
      } ${disableBackdrop ? "" : `bg-opacity-[${maskOpacity * 100}%]`} ${
        clickThrough ? "pointer-events-none" : ""
      } flex items-center justify-center p-4 sm:p-6`}
      style={{
        backgroundColor: maskColor
          ? `rgba(${parseInt(maskColor.slice(1, 3), 16)}, ${parseInt(
              maskColor.slice(3, 5),
              16
            )}, ${parseInt(maskColor.slice(5, 7), 16)}, ${maskOpacity})`
          : undefined,
      }}
    >
      <AnimatePresence>
        {targetRect ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`absolute border-4 rounded-lg shadow-lg pointer-events-none transition-transform duration-300 ease-in-out ${
              theme === "dark" ? "border-primary-dark" : "border-primary"
            }`}
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              ...currentStepData.customStyle,
            }}
          />
        ) : null}
      </AnimatePresence>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onComplete}
        >
          <X className="h-4 w-4" />
        </Button>
        <p className="mb-6 text-sm md:text-base">{currentStepData.content}</p>
        <div className="mb-4 flex justify-center">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
              className={`mx-1 h-2 w-2 rounded-full ${
                index === currentStep
                  ? theme === "dark"
                    ? "bg-primary-dark"
                    : "bg-primary"
                  : theme === "dark"
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t.previous}
          </Button>
          {currentStepData.interaction && (
            <Button
              onClick={handleInteraction}
              className="flex-1 flex items-center justify-center"
            >
              {t.interact}
            </Button>
          )}
          {currentStepData.skippable && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 flex items-center justify-center"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              {t.skip}
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center"
          >
            {currentStep === steps.length - 1 ? t.finish : t.next}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHotkeys(!showHotkeys)}
          className="mt-2 w-full flex items-center justify-center"
        >
          <Keyboard className="mr-2 h-4 w-4" />
          {showHotkeys ? t.hideHotkeys : t.hotkeys}
        </Button>
        <AnimatePresence>
          {showHotkeys && (
            <motion.div
              className={`mt-2 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>→ / Enter: {t.next}</p>
              <p>←: {t.previous}</p>
              <p>Esc: {t.finish}</p>
              {currentStepData.hotkey ? (
                <p>
                  {currentStepData.hotkey.toUpperCase()}: {t.interact}
                </p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
