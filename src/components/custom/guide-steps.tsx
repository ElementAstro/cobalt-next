import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: "pending" | "active" | "completed" | "error";
  validation?: () => boolean;
  children?: React.ReactNode;
}

interface GuideStepsProps {
  steps: Step[];
  orientation?: "horizontal" | "vertical";
  showNumbers?: boolean;
  showIcons?: boolean;
  showStatus?: boolean;
  allowSkip?: boolean;
  onComplete?: () => void;
  className?: string;
  separator?: React.ReactNode;
  previousButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
}

const stepVariants = {
  hidden: { opacity: 0, y: 20, x: 0 },
  visible: { opacity: 1, y: 0, x: 0 },
  exit: { opacity: 0, y: -20, x: 0 },
  enterFromLeft: { opacity: 0, y: 0, x: -50 },
  enterFromRight: { opacity: 0, y: 0, x: 50 },
};

export function GuideSteps({
  steps: initialSteps,
  orientation = "horizontal",
  showNumbers = true,
  showIcons = true,
  showStatus = true,
  allowSkip = false,
  onComplete,
  className,
  separator,
  previousButtonText = "上一步",
  nextButtonText = "下一步",
  completeButtonText = "完成",
}: GuideStepsProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setSteps((prev) =>
      prev.map((step, i) => ({
        ...step,
        status:
          i === currentStep
            ? "active"
            : i < currentStep
            ? "completed"
            : "pending",
      }))
    );
  }, [currentStep]);

  const handleNext = () => {
    const current = steps[currentStep];
    if (current.validation && !current.validation()) {
      setSteps((prev) =>
        prev.map((step, i) =>
          i === currentStep ? { ...step, status: "error" } : step
        )
      );
      return;
    }

    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (allowSkip || index <= currentStep) {
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
    }
  };

  const getStatusIcon = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "w-full",
        orientation === "horizontal" ? "flex flex-col" : "flex flex-col",
        className
      )}
    >
      <div
        className={cn(
          "flex gap-4",
          orientation === "horizontal" ? "flex-row" : "flex-col"
        )}
      >
        {steps.map((step, index) => (
          <>
            {separator && index !== 0 && (
              <div className="flex items-center justify-center">
                {separator}
              </div>
            )}
            <Button
              key={step.id}
              onClick={() => handleStepClick(index)}
              variant={step.status === "active" ? "secondary" : "ghost"}
              className={cn(
                "flex-1 h-auto justify-start gap-4",
                !allowSkip &&
                  index > currentStep &&
                  "pointer-events-none opacity-50"
              )}
              aria-current={step.status === "active" ? "step" : undefined}
              disabled={!allowSkip && index > currentStep}
            >
              {showNumbers && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                  {index + 1}
                </span>
              )}

              {showIcons && step.icon && (
                <span className="flex h-6 w-6 items-center justify-center">
                  {step.icon}
                </span>
              )}

              <div className="flex-1 text-left">
                <h3 className="font-medium">{step.title}</h3>
                {step.description && (
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>

              {showStatus && getStatusIcon(step.status)}
            </Button>
          </>
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={steps[currentStep].id}
          variants={stepVariants}
          initial={direction === 1 ? "enterFromRight" : "enterFromLeft"}
          animate="visible"
          exit={direction === 1 ? "exit" : "hidden"}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {steps[currentStep].children}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-8 justify-end">
        {currentStep > 0 && (
          <Button onClick={handlePrevious} variant="outline">
            {previousButtonText}
          </Button>
        )}

        <Button onClick={handleNext}>
          {currentStep === steps.length - 1
            ? completeButtonText
            : nextButtonText}
        </Button>
      </div>
    </div>
  );
}
