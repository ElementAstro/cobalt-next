import { BaseDialog } from "./BaseDialog";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
  loadingProgress?: number;
}

export function LoadingDialog({
  isOpen,
  message = "加载中...",
  loadingProgress,
}: LoadingDialogProps) {
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
        className="flex flex-col items-center justify-center p-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg dark:text-gray-300">{message}</p>
        {loadingProgress !== undefined && (
          <div className="w-full mt-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-blue-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </BaseDialog>
  );
}
