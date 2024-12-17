import { BaseDialog } from "./BaseDialog";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
  loadingProgress?: number;
  variant?: "spinner" | "dots" | "progress";
  loadingText?: string[];
}

export function LoadingDialog({
  isOpen,
  message = "加载中...",
  loadingProgress,
  variant = "spinner",
  loadingText = [],
}: LoadingDialogProps) {
  const [textIndex, setTextIndex] = React.useState(0);

  React.useEffect(() => {
    if (loadingText.length > 0) {
      const interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % loadingText.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loadingText]);

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return (
          <motion.div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ y: ["0%", "-50%", "0%"] }}
                transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </motion.div>
        );
      case "progress":
        return loadingProgress !== undefined && (
          <motion.div className="w-full space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm text-center text-gray-500">
              {loadingProgress}%
            </p>
          </motion.div>
        );
      default:
        return <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />;
    }
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={() => {}}
      showCloseButton={false}
      closeOnClickOutside={false}
      className="bg-opacity-50 backdrop-blur-md"
      animationPreset="scale"
    >
      <motion.div
        className="flex flex-col items-center justify-center p-6 space-y-4"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {renderLoader()}
        <motion.p
          key={textIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg dark:text-gray-300"
        >
          {loadingText.length > 0 ? loadingText[textIndex] : message}
        </motion.p>
      </motion.div>
    </BaseDialog>
  );
}
