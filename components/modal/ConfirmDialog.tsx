import { BaseDialog } from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
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
}: ConfirmDialogProps) {
  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
      animationPreset="scale"
      icon={
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.5 }}
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "transition-all hover:scale-105",
              danger && "bg-red-500 hover:bg-red-600"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </motion.div>
    </BaseDialog>
  );
}
