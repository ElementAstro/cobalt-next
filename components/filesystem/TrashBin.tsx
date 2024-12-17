// trash-bin.tsx
import React, { useState } from "react";
import { X, Trash2, RefreshCw, Sun, Moon, Filter, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTrashBinStore } from "@/lib/store/filesystem";

export const TrashBin: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const { deletedFiles, theme, restoreFile, emptyTrash, toggleTheme } =
    useTrashBinStore();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredFiles = deletedFiles.filter(file => {
    if (filterType === "all") return true;
    return file.type === filterType;
  });

  const handleBatchRestore = () => {
    selectedFiles.forEach(id => restoreFile(id));
    setSelectedFiles([]);
  };

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <div className="flex items-center space-x-4">
        <Button onClick={handleOpen} className="flex items-center space-x-2">
          <Trash2 className="w-5 h-5" />
          <span>垃圾箱</span>
        </Button>
        <Button onClick={toggleTheme} className="ml-auto">
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
                } p-6 rounded-lg max-w-md w-full mx-4 md:mx-0`}
              >
                <DialogContent>
                  <div className="flex justify-between items-center mb-4">
                    <DialogTitle className="text-2xl font-bold">
                      垃圾箱
                    </DialogTitle>
                    <Button variant="ghost" onClick={handleClose}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="mb-4 flex justify-between items-center">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[200px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <span>筛选类型</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="document">文档</SelectItem>
                        <SelectItem value="image">图片</SelectItem>
                        <SelectItem value="video">视频</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedFiles.length > 0 && (
                      <Button onClick={handleBatchRestore}>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        恢复选中项({selectedFiles.length})
                      </Button>
                    )}
                  </div>
                  <DialogDescription>
                    {filteredFiles.length > 0 ? (
                      <>
                        <ul className="mb-4 space-y-2">
                          {filteredFiles.map((file) => (
                            <motion.li
                              key={file.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className={`flex justify-between items-center p-2 rounded-lg ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  删除时间: {file.deletedAt}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => restoreFile(file.id)}
                                className="p-2"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </motion.li>
                          ))}
                        </ul>
                        <Button
                          onClick={emptyTrash}
                          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          清空垃圾箱
                        </Button>
                      </>
                    ) : (
                      <p className="text-center">垃圾箱为空</p>
                    )}
                  </DialogDescription>
                </DialogContent>
              </motion.div>
            </DialogOverlay>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
