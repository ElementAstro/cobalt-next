import { BaseDialog } from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "info" | "success" | "warning";
}

const variantStyles = {
  info: { icon: Info, color: "text-blue-500" },
  success: { icon: CheckCircle, color: "text-green-500" },
  warning: { icon: AlertTriangle, color: "text-yellow-500" },
};

export function InfoDialog({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
}: InfoDialogProps) {
  const Icon = variantStyles[variant].icon;

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
      animationPreset="slide"
      icon={
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className={`h-6 w-6 ${variantStyles[variant].color}`} />
        </motion.div>
      }
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        <Button
          onClick={onClose}
          className="w-full transition-all hover:scale-105"
        >
          确定
        </Button>
      </motion.div>
    </BaseDialog>
  );
}
