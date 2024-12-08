import React, { useState } from "react";
import { X, Archive, FileUp } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFileCompression } from "@/lib/store/filesystem";

interface FileCompressionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileCompression: React.FC<FileCompressionProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedFiles,
    compressionType,
    isCompressing,
    setSelectedFiles,
    setCompressionType,
    setIsCompressing,
  } = useFileCompression();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleCompression = () => {
    setIsCompressing(true);
    // Implement actual compression logic here
    setTimeout(() => {
      console.log(
        `Compressing ${selectedFiles.length} files to ${compressionType}`
      );
      setIsCompressing(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

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
                  <span className="text-2xl font-bold">文件压缩</span>
                  <DialogClose asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <Label className="block mb-2 font-medium">
                  选择要压缩的文件
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-600 hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">点击上传</span> 或拖放
                      </p>
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <motion.div
                  className="mb-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium mb-2">已选择的文件:</h3>
                  <ul className="list-disc pl-5">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
              <div className="mb-4">
                <Label className="block mb-2 font-medium">压缩类型</Label>
                <Select
                  value={compressionType}
                  onValueChange={(value) =>
                    setCompressionType(value as "zip" | "rar" | "7z")
                  }
                >
                  <SelectTrigger className="w-full p-2 rounded bg-gray-700">
                    <SelectValue placeholder="选择压缩类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zip">ZIP</SelectItem>
                    <SelectItem value="rar">RAR</SelectItem>
                    <SelectItem value="7z">7Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCompression}
                disabled={isCompressing}
                className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 ${
                  isCompressing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCompressing ? (
                  "压缩中..."
                ) : (
                  <>
                    <Archive className="w-5 h-5 inline-block mr-2" />
                    压缩文件
                  </>
                )}
              </Button>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
