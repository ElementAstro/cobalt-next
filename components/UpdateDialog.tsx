"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle, XCircle } from "lucide-react";
import useUpdateStore from "@/lib/store/update-dialog";
import { useTheme } from "next-themes";

// Constants
const MAX_RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface UpdateDialogProps {
  version: string;
  description: string;
  changelog: string[];
  updateSize: string;
  onUpdate: () => Promise<void>;
  onCancel: () => void;
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
  };
}

type UpdateFrequency = "always" | "daily" | "weekly" | "monthly";

export function UpdateDialog({
  version,
  description,
  changelog,
  updateSize,
  onUpdate,
  onCancel,
  customStyles = {},
}: UpdateDialogProps) {
  const {
    isOpen,
    setIsOpen,
    theme,
    toggleTheme,
    autoUpdate,
    setAutoUpdate,
    updateFrequency,
    setUpdateFrequency,
  } = useUpdateStore();
  const { theme: currentTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "downloading" | "installing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryDelay, setRetryDelay] = useState(INITIAL_RETRY_DELAY);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isUpdating) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [isUpdating]);

  const handleUpdate = useCallback(async () => {
    try {
      setIsUpdating(true);
      setUpdateStatus("downloading");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate download
      setUpdateStatus("installing");
      await onUpdate();
      setUpdateStatus("success");
      setIsOpen(false);
      setShowConfirmation(true);
    } catch (error) {
      setUpdateStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("发生未知错误");
      }
    } finally {
      setIsUpdating(false);
    }
  }, [onUpdate, setIsOpen]);

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  const handleRetry = useCallback(async () => {
    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount((prev) => prev + 1);
      setErrorMessage(null);
      setUpdateStatus("idle");

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      setRetryDelay((prev) => prev * 2);

      await handleUpdate();
    } else {
      setErrorMessage(`已达到最大重试次数 (${MAX_RETRY_COUNT})。请稍后再试。`);
    }
  }, [retryCount, retryDelay, handleUpdate]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
              className="sm:max-w-md w-full p-6 rounded-lg"
              style={{
                backgroundColor: customStyles.backgroundColor || "",
                color: customStyles.textColor || "",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    更新可用
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    新版本 {version} 已准备就绪。更新大小: {updateSize}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                  <ScrollArea className="h-48 mt-4 p-4 rounded-md border dark:border-gray-700">
                    <h4 className="mb-4 text-sm font-medium">更新日志</h4>
                    {changelog.map((log, index) => (
                      <motion.p
                        key={index}
                        className="text-sm mb-2 dark:text-gray-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        • {log}
                      </motion.p>
                    ))}
                  </ScrollArea>
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="auto-update"
                      checked={autoUpdate}
                      onCheckedChange={setAutoUpdate}
                    />
                    <Label htmlFor="auto-update">自动更新</Label>
                  </div>
                  {autoUpdate && (
                    <RadioGroup
                      value={updateFrequency}
                      onValueChange={setUpdateFrequency}
                      className="mt-2 grid grid-cols-2 gap-2"
                    >
                      {["always", "daily", "weekly", "monthly"].map((freq) => (
                        <div key={freq} className="flex items-center space-x-2">
                          <RadioGroupItem value={freq} id={freq} />
                          <Label htmlFor={freq}>
                            {freq === "always"
                              ? "总是"
                              : freq === "daily"
                              ? "每天"
                              : freq === "weekly"
                              ? "每周"
                              : "每月"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
                {isUpdating && (
                  <div className="my-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-center mt-2 dark:text-gray-200">
                      {updateStatus === "downloading" && "正在下载更新..."}
                      {updateStatus === "installing" && "正在安装更新..."}
                      {updateStatus === "success" && "更新成功!"}
                      {updateStatus === "error" && "更新失败，请重试"}
                    </p>
                  </div>
                )}
                <DialogFooter className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="w-full sm:w-auto"
                  >
                    {isUpdating ? "更新中..." : "以后再说"}
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
                  >
                    {isUpdating ? (
                      <span className="flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4 animate-bounce" />
                        更新中...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4" />
                        立即更新
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="w-full sm:w-auto"
                  >
                    {currentTheme === "dark"
                      ? "切换到浅色模式"
                      : "切换到暗色模式"}
                  </Button>
                </DialogFooter>
                {updateStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50"
                  >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                      <XCircle className="mx-auto mb-4 h-8 w-8 text-red-500" />
                      <p className="text-lg font-semibold dark:text-gray-200">
                        更新失败
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {errorMessage}
                      </p>
                      {retryCount < MAX_RETRY_COUNT && (
                        <Button onClick={handleRetry} className="mt-4">
                          重试 ({retryCount + 1}/{MAX_RETRY_COUNT})
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
      <UpdateConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        version={version}
      />
    </>
  );
}

interface UpdateConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  version: string;
}

function UpdateConfirmationDialog({
  isOpen,
  onClose,
  version,
}: UpdateConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full p-6 rounded-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              更新完成
            </DialogTitle>
            <DialogDescription className="mt-2">
              您的应用已成功更新到版本 {version}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <p className="text-center mt-4 text-lg dark:text-gray-200">
              所有更新已成功安装。享受新版本带来的新功能和改进吧！
            </p>
          </div>
          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              确定
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
