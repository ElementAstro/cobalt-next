import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFileUploadStore } from "@/lib/store/filesystem";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose }) => {
  const { files, setFiles, theme, toggleTheme } = useFileUploadStore();
  const [dragActive, setDragActive] = useState(false);
  const methods = useForm();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (data: any) => {
    // 处理文件上传逻辑
    console.log("Uploading files:", files);
    onClose();
  };

  const variants = {
    backdrop: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
    modal: {
      hidden: { y: 50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 24,
          staggerChildren: 0.1,
        },
      },
      exit: { y: 50, opacity: 0 },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants.backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            variants={variants.modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full mx-4 sm:mx-0`}
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <Label className="text-2xl font-bold">上传文件</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="p-1 rounded-full hover:bg-gray-700 transition duration-200"
                  >
                    {theme === "dark" ? "亮色模式" : "暗色模式"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-700 transition duration-200"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <motion.div
                      variants={variants.item}
                      initial="hidden"
                      animate="visible"
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive
                          ? "border-blue-500"
                          : theme === "dark"
                          ? "border-gray-600"
                          : "border-gray-300"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Input
                        type="file"
                        multiple
                        onChange={handleChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-semibold">
                          拖放文件到这里，或点击选择文件
                        </p>
                      </label>
                    </motion.div>
                    {files.length > 0 && (
                      <motion.div
                        variants={variants.item}
                        className="space-y-2"
                      >
                        <FormLabel>已选择的文件:</FormLabel>
                        <ul className="list-disc pl-5">
                          {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    <motion.div variants={variants.item}>
                      <Button
                        type="submit"
                        variant="default"
                        className="w-full"
                      >
                        上传
                      </Button>
                    </motion.div>
                  </form>
                </FormProvider>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="default" onClick={onClose}>
                  关闭
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
