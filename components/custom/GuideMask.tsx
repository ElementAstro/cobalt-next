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
import { useTheme } from "next-themes";

interface Step {
  target: string;
  content: string;
  skippable?: boolean;
  interaction?: () => void;
  condition?: () => boolean;
  customStyle?: React.CSSProperties;
  hotkey?: string;
}

interface GuideMaskProps {
  steps: Step[];
  onComplete: () => void;
  language?: "en" | "zh" | "es"; // 增加更多语言选项
  saveProgress?: boolean;
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
    interact: "Interact",
    hotkeys: "Show Hotkeys",
    hideHotkeys: "Hide Hotkeys",
  },
  zh: {
    previous: "上一步",
    next: "下一步",
    finish: "完成",
    skip: "跳过",
    interact: "交互",
    hotkeys: "显示快捷键",
    hideHotkeys: "隐藏快捷键",
  },
  es: {
    // 西班牙语示例
    previous: "Anterior",
    next: "Siguiente",
    finish: "Terminar",
    skip: "Saltar",
    interact: "Interactuar",
    hotkeys: "Mostrar Atajos",
    hideHotkeys: "Ocultar Atajos",
  },
};

export function GuideMask({
  steps,
  onComplete,
  language = "en",
  saveProgress = false,
}: GuideMaskProps) {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (saveProgress) {
      const saved = localStorage.getItem("guideMaskProgress");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const { theme } = useTheme();
  const t = translations[language];
  const containerRef = useRef<HTMLDivElement>(null);

  const updateTargetRect = useCallback(() => {
    if (steps.length === 0) return;

    const currentStepData = steps[currentStep];
    if (currentStepData.condition && !currentStepData.condition()) {
      handleNext();
      return;
    }

    const targetElement = document.querySelector(currentStepData.target);
    if (targetElement && containerRef.current) {
      const rect = targetElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // 计算相对于视口的位置
      const top = rect.top;
      const left = rect.left;
      const width = rect.width;
      const height = rect.height;

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

      // 平滑滚动到元素
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (steps.length === 0) {
      onComplete();
      return;
    }

    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);
    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [currentStep, steps, onComplete, updateTargetRect]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "Enter") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "Escape") {
        onComplete();
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
  }, [currentStep, steps, onComplete]);

  useEffect(() => {
    if (saveProgress) {
      localStorage.setItem("guideMaskProgress", currentStep.toString());
    }
  }, [currentStep, saveProgress]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      let nextStep = currentStep + 1;
      while (
        nextStep < steps.length &&
        steps[nextStep].condition &&
        !steps[nextStep].condition()
      ) {
        nextStep++;
      }
      if (nextStep < steps.length) {
        setCurrentStep(nextStep);
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
        !steps[prevStep].condition()
      ) {
        prevStep--;
      }
      if (prevStep >= 0) {
        setCurrentStep(prevStep);
      }
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleInteraction = () => {
    if (steps[currentStep].interaction) {
      steps[currentStep].interaction();
    }
  };

  if (steps.length === 0 || !steps[currentStep]) return null;

  const currentStepData = steps[currentStep];

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 ${
        theme === "dark" ? "bg-black bg-opacity-70" : "bg-white bg-opacity-70"
      } flex items-center justify-center p-4 sm:p-6`}
    >
      <AnimatePresence>
        {targetRect && (
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
        )}
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
              {currentStepData.hotkey && (
                <p>
                  {currentStepData.hotkey.toUpperCase()}: {t.interact}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
