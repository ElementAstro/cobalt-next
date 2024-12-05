import React from "react";
import { X } from "lucide-react";
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
import { File } from "./types";

interface FilePreviewProps {
  file: File;
  onClose: () => void;
  theme: "light" | "dark";
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onClose,
  theme,
}) => {
  React.useEffect(() => {
    Prism.highlightAll();
  }, [file]);

  const getLanguageFromFileType = (fileType: string): string => {
    switch (fileType) {
      case "javascript":
      case "js":
        return "javascript";
      case "typescript":
      case "ts":
        return "typescript";
      case "jsx":
        return "jsx";
      case "tsx":
        return "tsx";
      case "css":
        return "css";
      case "python":
      case "py":
        return "python";
      default:
        return "none";
    }
  };

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <DialogContent
          className={`${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          } p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto mx-4`}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
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
            {file.type === "image" ? (
              <img
                src={`/placeholder.svg?height=400&width=600`}
                alt={file.name}
                className="max-w-full h-auto"
              />
            ) : file.type === "video" ? (
              <video controls className="max-w-full h-auto">
                <source src={`/placeholder.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : file.type === "code" ? (
              <pre className="p-4 rounded bg-gray-900 overflow-x-auto">
                <code
                  className={`language-${getLanguageFromFileType(
                    file.language || ""
                  )}`}
                >
                  {file.content}
                </code>
              </pre>
            ) : (
              <pre className="whitespace-pre-wrap">
                {file.content || "No preview available"}
              </pre>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};
