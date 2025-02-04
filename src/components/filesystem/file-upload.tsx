"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { uploadFile, validateFile } from "@/services/file-upload";
import {
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  File,
  Image,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

export function FileUpload() {
  const methods = useForm();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: "success" | "error" | null;
  }>({});
  const [totalProgress, setTotalProgress] = useState(0);
  const [expandedFiles, setExpandedFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    variant: "default" | "destructive";
  } | null>(null);
  const abortControllerRef = useRef<{ [key: string]: AbortController }>({});

  const validateAndAddFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const { valid, errors } = validateFile(file, {
        maxSize: MAX_FILE_SIZE,
        allowedTypes: ALLOWED_FILE_TYPES,
      });

      if (!valid) {
        setToast({
          title: "文件验证失败",
          description: errors.join("\n"),
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    validFiles.forEach((file) => {
      setExpandedFiles((prev) => ({ ...prev, [file.name]: false }));
    });

    if (validFiles.length < newFiles.length) {
      setToast({
        title: "部分文件未添加",
        description: "某些文件未能通过验证，请检查文件大小和类型。",
        variant: "destructive",
      });
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      validateAndAddFiles(acceptedFiles);
    },
    [validateAndAddFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[file.name];
      return newProgress;
    });
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[file.name];
      return newStatus;
    });
    setExpandedFiles((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[file.name];
      return newExpanded;
    });
    if (abortControllerRef.current[file.name]) {
      abortControllerRef.current[file.name].abort();
      delete abortControllerRef.current[file.name];
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          if (uploadStatus[file.name] === "success") return;
          await uploadSingleFile(file);
        })
      );
    } finally {
      setUploading(false);
    }
  };

  const uploadSingleFile = async (file: File) => {
    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
    setUploadStatus((prev) => ({ ...prev, [file.name]: null }));

    const abortController = new AbortController();
    abortControllerRef.current[file.name] = abortController;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile(
        formData,
        abortController.signal,
        (progress: number) => {
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        }
      );

      if (response.success) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
        setToast({
          title: "上传成功",
          description: `文件 ${file.name} 已成功上传`,
          variant: "default",
        });
      } else {
        throw new Error(response.error || "上传失败");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setToast({
          title: "上传取消",
          description: `文件 ${file.name} 已取消上传`,
          variant: "default",
        });
      } else {
        setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
        setToast({
          title: "上传失败",
          description: `文件 ${file.name} 上传失败: ${error.message}`,
          variant: "destructive",
        });
      }
    } finally {
      delete abortControllerRef.current[file.name];
    }
  };

  const cancelUpload = (file: File) => {
    if (abortControllerRef.current[file.name]) {
      abortControllerRef.current[file.name].abort();
      delete abortControllerRef.current[file.name];
    }
  };

  const retryUpload = (file: File) => {
    uploadSingleFile(file);
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  const getFileIcon = (file: File) => {
    if (isImage(file)) return <Image className="w-6 h-6" />;
    if (file.type === "application/pdf")
      return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const toggleFileExpansion = (fileName: string) => {
    setExpandedFiles((prev) => ({ ...prev, [fileName]: !prev[fileName] }));
  };

  useEffect(() => {
    const totalFiles = files.length;
    const completedFiles = Object.values(uploadStatus).filter(
      (status) => status === "success"
    ).length;
    setTotalProgress(totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0);
  }, [files, uploadStatus]);

  return (
    <ToastProvider>
      <div className="w-full max-w-full sm:max-w-md mx-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
        <CardHeader className="p-2 sm:p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-semibold">文件上传</h2>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                最大 5MB
              </Badge>
            </div>
            <Button size="sm" variant="ghost">
              <X className="w-4 h-4 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-4 p-2 sm:p-4">
          <FormProvider {...methods}>
            <form className="space-y-2 sm:space-y-4">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg 
                  p-4 sm:p-8 text-center cursor-pointer
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-600"
                  }
                  transition-colors duration-200 hover:border-primary
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
                  <p className="text-sm sm:text-base">
                    {isDragActive
                      ? "将文件拖放到这里..."
                      : "拖放文件到这里，或点击选择文件"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    支持的格式: JPEG, PNG, PDF • 最大文件大小:{" "}
                    {MAX_FILE_SIZE / 1024 / 1024}MB
                  </p>
                </div>
              </div>
            </form>
          </FormProvider>

          <AnimatePresence>
            {files.length > 0 && (
              <ScrollArea className="h-[200px] sm:h-[300px] w-full rounded-md border">
                <div className="p-2 sm:p-4 space-y-2">
                  {files.map((file) => (
                    <Collapsible
                      key={file.name}
                      open={expandedFiles[file.name]}
                      onOpenChange={() => toggleFileExpansion(file.name)}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="bg-muted p-2 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
                              {expandedFiles[file.name] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <div className="flex-shrink-0">
                            {isImage(file) ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              getFileIcon(file)
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          {uploadStatus[file.name] === "success" && (
                            <CheckCircle className="text-success w-5 h-5" />
                          )}
                          {uploadStatus[file.name] === "error" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => retryUpload(file)}
                              className="text-destructive hover:text-destructive"
                            >
                              <AlertCircle className="w-5 h-5" />
                            </Button>
                          )}
                          {!uploadStatus[file.name] && uploading && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => cancelUpload(file)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          )}
                          {!uploadStatus[file.name] && !uploading && (
                            <motion.div
                              className="w-5 h-5"
                              animate={uploading ? { rotate: 360 } : {}}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "linear",
                              }}
                            >
                              <Upload className="text-primary" />
                            </motion.div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(file)}
                            disabled={uploading}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <CollapsibleContent>
                          <div className="mt-2 space-y-2">
                            {uploadStatus[file.name] && (
                              <Progress
                                value={uploadProgress[file.name]}
                                className="h-1"
                              />
                            )}
                            <p className="text-xs text-muted-foreground">
                              类型: {file.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              最后修改:{" "}
                              {new Date(file.lastModified).toLocaleString()}
                            </p>
                          </div>
                        </CollapsibleContent>
                      </motion.div>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            )}
          </AnimatePresence>

          {files.length > 0 && (
            <div className="space-y-2">
              <Button
                onClick={handleUpload}
                disabled={
                  uploading ||
                  files.every((file) => uploadStatus[file.name] === "success")
                }
                className="w-full"
              >
                {uploading ? "上传中..." : "上传所有文件"}
              </Button>
              <Progress value={totalProgress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">
                总进度: {Math.round(totalProgress)}%
              </p>
            </div>
          )}
        </CardContent>
      </div>
      {toast && (
        <Toast variant={toast.variant}>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
