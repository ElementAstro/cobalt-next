"use client";

import React, { useState } from "react";
import { X, Lock, Unlock, FileUp, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useFileEncryption } from "@/lib/store/filesystem";

interface FileEncryptionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileEncryption: React.FC<FileEncryptionProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedFile,
    password,
    isEncrypting,
    isProcessing,
    isSuccess,
    setSelectedFile,
    setPassword,
    toggleEncrypting,
    setIsProcessing,
    setIsSuccess,
  } = useFileEncryption();

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const customFile = {
        ...file,
        id: crypto.randomUUID(),
        deletedAt: null,
      };
      setSelectedFile(customFile as any);
    }
  };

  const handleEncryptDecrypt = () => {
    if (!selectedFile || !password) return;

    setIsProcessing(true);
    // 实现实际的加密/解密逻辑
    setTimeout(() => {
      console.log(
        `${isEncrypting ? "Encrypting" : "Decrypting"} file: ${
          selectedFile.name
        } with password: ${password}`
      );
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-60 z-50" />
          <DialogContent className="bg-gray-900 text-white p-6 rounded-lg max-w-md w-full mx-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4 text-xl font-semibold">
                  <span>{isEncrypting ? "加密" : "解密"}文件</span>
                  <DialogClose asChild>
                    <button
                      className="p-1 rounded-full hover:bg-gray-700 transition duration-200 focus:outline-none"
                      aria-label="关闭"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              {!isSuccess ? (
                <>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="mb-4">
                      <Label className="block mb-2 font-medium" htmlFor="file">
                        选择文件
                      </Label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-600 hover:border-gray-500">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">点击上传</span> 或拖放
                            </p>
                          </div>
                          <Input
                            type="file"
                            id="file"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>
                    </div>
                  </motion.div>

                  {selectedFile && (
                    <motion.p
                      className="mb-4 flex items-center text-sm text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <FileUp className="w-4 h-4 mr-2" />
                      选择的文件: {selectedFile.name}
                    </motion.p>
                  )}

                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Label className="block mb-2 font-medium" htmlFor="password">
                      密码
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      placeholder="输入密码"
                      aria-label="密码输入框"
                    />
                  </motion.div>

                  <motion.div
                    className="mb-4 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Checkbox
                      checked={isEncrypting}
                      onCheckedChange={toggleEncrypting}
                      className="form-checkbox h-5 w-5 text-blue-600"
                      id="encrypt-toggle"
                      aria-labelledby="encrypt-label"
                    />
                    <Label htmlFor="encrypt-toggle" className="ml-2">
                      {isEncrypting ? "加密" : "解密"}
                    </Label>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Button
                      onClick={handleEncryptDecrypt}
                      disabled={!selectedFile || !password || isProcessing}
                      className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center justify-center ${
                        !selectedFile || !password || isProcessing
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      aria-label={isEncrypting ? "加密文件" : "解密文件"}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                          处理中...
                        </>
                      ) : (
                        <>
                          {isEncrypting ? (
                            <Lock className="w-5 h-5 mr-2" />
                          ) : (
                            <Unlock className="w-5 h-5 mr-2" />
                          )}
                          {isEncrypting ? "加密文件" : "解密文件"}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <p className="text-lg">
                    文件已成功 {isEncrypting ? "加密" : "解密"}！
                  </p>
                </motion.div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};