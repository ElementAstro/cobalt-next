import { BaseDialog } from "./base-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionButton = motion(Button);

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  layout?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  buttonVariant?: "default" | "outline" | "ghost";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "确认",
  cancelText = "取消",
  danger = false,
  layout = "horizontal",
  size = "md",
  buttonVariant = "default",
}: ConfirmDialogProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={cn(sizeClasses[size], "p-4 md:p-6")}
      animationPreset="bounce"
      icon={
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <AlertTriangle
            className={cn(
              "h-6 w-6",
              danger ? "text-red-500" : "text-yellow-500"
            )}
          />
        </motion.div>
      }
    >
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <p className="text-gray-600 dark:text-gray-300">
          {message}
        </p>
        <div className={cn("grid gap-2", "grid-cols-1")}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <MotionButton
              variant={buttonVariant}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              {cancelText}
            </MotionButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <MotionButton
              onClick={() => {
                onConfirm();
                onClose();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-full",
                danger && "bg-red-500 hover:bg-red-600"
              )}
            >
              {confirmText}
            </MotionButton>
          </motion.div>
        </div>
      </motion.div>
    </BaseDialog>
  );
}
