import React, { useState } from "react";
import { X, Lock, Unlock, FileUp } from "lucide-react";
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
    setSelectedFile,
    setPassword,
    toggleEncrypting,
    setIsProcessing,
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
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <DialogContent className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full mx-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">
                    {isEncrypting ? "加密" : "解密"}文件
                  </span>
                  <DialogClose asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>
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
                  <Label className="block mb-2 font-medium">选择文件</Label>
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
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
              {selectedFile && (
                <motion.p
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
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
                  className="w-full p-2 rounded bg-gray-700"
                  placeholder="输入密码"
                />
              </motion.div>
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label className="inline-flex items-center">
                  <Checkbox
                    checked={isEncrypting}
                    onCheckedChange={toggleEncrypting}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">{isEncrypting ? "加密" : "解密"}</span>
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
                  className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 ${
                    !selectedFile || !password || isProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isProcessing ? (
                    "处理中..."
                  ) : (
                    <>
                      {isEncrypting ? (
                        <Lock className="w-5 h-5 inline-block mr-2" />
                      ) : (
                        <Unlock className="w-5 h-5 inline-block mr-2" />
                      )}
                      {isEncrypting ? "加密文件" : "解密文件"}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
