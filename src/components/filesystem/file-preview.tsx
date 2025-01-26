"use client";

import React from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Edit, Download } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// 扩展 File 类型
interface ExtendedFile extends File {
  url?: string;
  content?: string;
  language?: string;
}

interface FilePreviewProps {
  file: ExtendedFile;
  onClose: () => void;
}

// 下载工具函数
const downloadFile = async (file: ExtendedFile) => {
  if (!file.url) {
    throw new Error("File URL not found");
  }
  const response = await fetch(file.url);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [zoom, setZoom] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    Prism.highlightAll();
  }, [file]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = async () => {
    try {
      await downloadFile(file);
      toast({
        title: "下载成功",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "下载失败",
        variant: "destructive",
      });
    }
  };

  const handleVideoRateChange = (value: number) => {
    setPlaybackRate(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="relative">
            {file.url && (
              <img
                src={file.url}
                alt={file.name}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
                className="max-w-full h-auto rounded"
              />
            )}
            {isEditing && (
              <div className="absolute top-0 left-0 w-full h-full">
                {/* 图片编辑工具 */}
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="space-y-2">
            {file.url && (
              <>
                <video
                  ref={videoRef}
                  controls
                  className="max-w-full h-auto rounded"
                >
                  <source src={file.url} type="video/mp4" />
                </video>
                <div className="flex items-center gap-2">
                  <span className="text-sm">播放速度:</span>
                  <Slider
                    value={[playbackRate]}
                    onValueChange={([value]) => handleVideoRateChange(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-32"
                  />
                  <span className="text-sm">{playbackRate}x</span>
                </div>
              </>
            )}
          </div>
        );

      case "code":
        return (
          <div className="relative">
            <pre className="p-4 rounded bg-gray-900 overflow-x-auto">
              <code className={`language-${file.language || "text"}`}>
                {file.content}
              </code>
            </pre>
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(file.content || "");
                  toast({
                    title: "代码已复制",
                    variant: "default",
                  });
                }}
              >
                复制代码
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center p-8">
            <p>暂不支持预览该类型文件</p>
            <Button variant="outline" onClick={handleDownload}>
              下载文件
            </Button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <DialogContent
          className={`
            bg-gray-800 text-white
            p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto mx-4
          `}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">{file.name}</span>
                <DialogClose asChild>
                  <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                    <X className="w-6 h-6" />
                  </button>
                </DialogClose>
              </DialogTitle>
            </DialogHeader>
            <motion.div
              variants={childVariants}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{file.name}</h2>
                <div className="flex items-center gap-2">
                  {file.type === "image" && (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleRotate}>
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {renderPreview()}
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
