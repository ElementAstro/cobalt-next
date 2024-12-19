import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { File } from "@/types/filesystem";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/lib/store/theme";

interface FilePropertiesProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
}

export const FileProperties: React.FC<FilePropertiesProps> = ({
  file,
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useThemeStore();

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

  if (!isOpen) return null;

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
            } w-full max-w-lg mx-4 sm:mx-0 p-6 rounded-lg shadow-lg`}
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center mb-4">
                <Label className="text-2xl font-bold">文件属性</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="p-1 rounded-full hover:bg-gray-700 transition duration-200"
                  >
                    {theme === "dark" ? "亮色" : "暗色"}模式
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
              <CardContent className="space-y-2">
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>名称:</strong> {file.name}
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>类型:</strong> {file.type}
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>大小:</strong> {(file.size / 1024).toFixed(2)} KB
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>创建时间:</strong>{" "}
                    {format(file.createdAt, "yyyy-MM-dd HH:mm:ss")}
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>修改时间:</strong>{" "}
                    {format(file.lastModified, "yyyy-MM-dd HH:mm:ss")}
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>所有者:</strong> {file.owner}
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>权限:</strong> {file.permissions}
                  </Label>
                </motion.div>
                <motion.div variants={variants.item}>
                  <Label>
                    <strong>路径:</strong> {file.path}
                  </Label>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-end mt-4">
                <Button
                  variant="default"
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
                >
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
