"use client";

import React from "react";
import {
  CheckCircle,
  LockIcon,
  UnlockIcon,
  FileIcon,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import type { File as CustomFile } from "@/types/filesystem";
import { mockFilesystemApi } from "@/services/mock/filesystem";
import { filesystemApi } from "@/services/api/filesystem";
import { encryptFile, decryptFile } from "@/utils/crypto";

interface FileEncryptionProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles: CustomFile[];
}

export const FileEncryption: React.FC<FileEncryptionProps> = ({
  isOpen,
  onClose,
  selectedFiles,
}) => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentFile, setCurrentFile] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState<"encrypt" | "decrypt">("encrypt");

  const api =
    process.env.NEXT_PUBLIC_USE_MOCK === "true"
      ? mockFilesystemApi
      : filesystemApi;

  // 动画变体定义
  const containerAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        duration: 0.5,
      },
    },
  };

  // Reset states
  React.useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setConfirmPassword("");
      setProgress(0);
      setError(null);
      setSuccess([]);
    }
  }, [isOpen]);

  // Validate password
  const validatePassword = () => {
    if (password.length < 8) {
      setError("密码长度至少为8位");
      return false;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return false;
    }
    return true;
  };

  // Process single file encryption/decryption
  const processFile = async (file: CustomFile) => {
    setCurrentFile(file.name);
    try {
      // Get file data
      const response = await api.getFileData(file.id.toString());
      if (response.status !== "success") {
        throw new Error(`获取文件 ${file.name} 失败`);
      }

      // Get file content as ArrayBuffer
      // Fixed: response.data should be a Blob, use .arrayBuffer() method on it
      const fileData = await response.data;

      // Process data based on mode
      const processedData =
        mode === "encrypt"
          ? await encryptFile(fileData, password)
          : await decryptFile(fileData, password);

      // Save processed data back
      // Fixed: Use updateFileData instead of saveFileData
      await api.updateFileData(file.id.toString(), new Blob([processedData]));

      setSuccess((prev) => [...prev, file.name]);
      return true;
    } catch (err) {
      setError(
        `处理文件 ${file.name} 时发生错误: ${
          err instanceof Error ? err.message : "未知错误"
        }`
      );
      return false;
    }
  };

  // Handle batch processing
  const handleProcessFiles = async () => {
    if (!validatePassword()) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess([]);

    try {
      let processed = 0;
      for (const file of selectedFiles) {
        const success = await processFile(file);
        processed++;
        setProgress((processed / selectedFiles.length) * 100);
        if (!success) break;
      }

      // If all files processed successfully
      if (success.length === selectedFiles.length) {
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理文件时发生错误");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white overflow-hidden">
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-4"
            >
              <DialogHeader>
                <motion.div className="flex items-center gap-2" layout>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {mode === "encrypt" ? (
                      <LockIcon className="w-5 h-5" />
                    ) : (
                      <UnlockIcon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <motion.span layout>
                    {mode === "encrypt" ? "文件加密" : "文件解密"}
                  </motion.span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setMode(mode === "encrypt" ? "decrypt" : "encrypt")
                      }
                      className="ml-2"
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: mode === "encrypt" ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        {mode === "encrypt" ? (
                          <UnlockIcon className="w-4 h-4" />
                        ) : (
                          <LockIcon className="w-4 h-4" />
                        )}
                      </motion.div>
                      <motion.span layout className="ml-2">
                        切换到{mode === "encrypt" ? "解密" : "加密"}
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* 文件列表 */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">选中的文件</CardTitle>
                    <CardDescription>
                      共 {selectedFiles.length} 个文件需要处理
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div className="max-h-[200px] overflow-y-auto space-y-2">
                      <AnimatePresence mode="popLayout">
                        {selectedFiles.map((file, index) => (
                          <motion.div
                            key={file.id}
                            variants={itemAnimation}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            custom={index}
                            className={`flex items-center justify-between p-2 rounded ${
                              success.includes(file.name)
                                ? "bg-green-900/20"
                                : "bg-gray-700/20"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <FileIcon className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                            <AnimatePresence>
                              {success.includes(file.name) && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </CardContent>
                </Card>

                {/* 密码输入 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">密码</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="输入加密密码"
                          className="bg-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">确认密码</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="再次输入密码"
                          className="bg-gray-700"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 进度显示 */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <motion.span layout>{currentFile}</motion.span>
                              <motion.span layout>
                                {Math.round(progress)}%
                              </motion.span>
                            </div>
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Progress value={progress} />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 错误显示 */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring" }}
                    >
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 操作按钮 */}
                <motion.div
                  className="flex justify-end gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={onClose}
                      disabled={isProcessing}
                    >
                      取消
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleProcessFiles}
                      disabled={isProcessing || !password || !confirmPassword}
                      className="relative"
                    >
                      {isProcessing ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center"
                        >
                          <span className="animate-pulse">处理中...</span>
                          <span className="absolute right-2">
                            {Math.round(progress)}%
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center"
                        >
                          {mode === "encrypt" ? (
                            <LockIcon className="w-4 h-4 mr-2" />
                          ) : (
                            <UnlockIcon className="w-4 h-4 mr-2" />
                          )}
                          开始{mode === "encrypt" ? "加密" : "解密"}
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
