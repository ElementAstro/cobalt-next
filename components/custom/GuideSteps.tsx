"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  title: string;
  description: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

interface GuideStepsProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
  colorScheme?: {
    active: string;
    completed: string;
    default: string;
  };
  showStepNumbers?: boolean;
  animationDuration?: number;
  allowStepClick?: boolean;
  showStepContent?: boolean;
  autoExpandCurrent?: boolean;
  darkMode?: boolean;
}

export function GuideSteps({
  steps,
  currentStep,
  onStepChange,
  className,
  orientation = "horizontal",
  colorScheme = {
    active: "blue",
    completed: "green",
    default: "gray",
  },
  showStepNumbers = true,
  animationDuration = 0.5,
  allowStepClick = true,
  showStepContent = false,
  autoExpandCurrent = false,
  darkMode = false,
}: GuideStepsProps) {
  const [isVertical, setIsVertical] = useState(orientation === "vertical");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < 640 || orientation === "vertical");
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    if (autoExpandCurrent) {
      setExpandedStep(currentStep - 1);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [orientation, autoExpandCurrent, currentStep]);

  const handleStepClick = (index: number) => {
    if (allowStepClick) {
      onStepChange(index + 1);
    }
    if (showStepContent) {
      setExpandedStep(expandedStep === index ? null : index);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        darkMode ? "dark" : "",
        "w-full",
        isVertical
          ? "flex flex-col space-y-4"
          : "flex flex-wrap justify-center items-center",
        className
      )}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex items-start",
            isVertical ? "w-full" : "flex-col items-center",
            index < steps.length - 1 && !isVertical && "mb-4 sm:mb-0 sm:mr-4"
          )}
        >
          <motion.div
            className={cn(
              "flex items-center cursor-pointer",
              isVertical ? "w-full" : "flex-col"
            )}
            onClick={() => handleStepClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                index < currentStep
                  ? `bg-${colorScheme.completed}-100 dark:bg-${colorScheme.completed}-800`
                  : index === currentStep - 1
                  ? `bg-${colorScheme.active}-100 dark:bg-${colorScheme.active}-800`
                  : `bg-${colorScheme.default}-100 dark:bg-${colorScheme.default}-700`
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: animationDuration }}
            >
              {index < currentStep ? (
                <motion.svg
                  className={`w-6 h-6 text-${colorScheme.completed}-500 dark:text-${colorScheme.completed}-400`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: animationDuration }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              ) : step.icon ? (
                step.icon
              ) : showStepNumbers ? (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {index + 1}
                </span>
              ) : null}
            </motion.div>
            <div
              className={cn(
                "flex flex-col",
                isVertical ? "ml-4" : "items-center text-center mt-2"
              )}
            >
              <motion.h3
                className="font-semibold text-gray-800 dark:text-gray-100 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: animationDuration,
                  delay: animationDuration * 0.2,
                }}
              >
                {step.title}
              </motion.h3>
              <motion.p
                className="text-xs text-gray-600 dark:text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: animationDuration,
                  delay: animationDuration * 0.4,
                }}
              >
                {step.description}
              </motion.p>
            </div>
            {showStepContent && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedStep(expandedStep === index ? null : index);
                }}
              >
                {expandedStep === index ? <ChevronDown /> : <ChevronRight />}
              </Button>
            )}
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              className={cn(
                isVertical
                  ? `w-0.5 h-full ml-5 my-2`
                  : "hidden sm:block h-0.5 w-full mt-2",
                `bg-${colorScheme.default}-200 dark:bg-${colorScheme.default}-700`
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: animationDuration }}
            >
              <motion.div
                className={cn(
                  isVertical ? "h-full" : "w-full",
                  `bg-${colorScheme.completed}-500 dark:bg-${colorScheme.completed}-500`
                )}
                initial={{ scale: 0 }}
                animate={{ scale: index < currentStep - 1 ? 1 : 0 }}
                transition={{ duration: animationDuration }}
              />
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            {showStepContent &&
              (expandedStep === index ||
                (autoExpandCurrent && currentStep - 1 === index)) && (
                <motion.div
                  layout
                  className="w-full mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.content}
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
}
