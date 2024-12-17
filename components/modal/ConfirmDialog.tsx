import { BaseDialog } from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const effectiveLayout = isMobile ? "vertical" : layout;

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
      <motion.div className="space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 dark:text-gray-300"
        >
          {message}
        </motion.p>
        <motion.div
          className={cn(
            "grid gap-2",
            effectiveLayout === "horizontal" ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          <Button
            variant={buttonVariant}
            onClick={onClose}
            className="transition-all hover:scale-105"
          >
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
        </motion.div>
      </motion.div>
    </BaseDialog>
  );
}
