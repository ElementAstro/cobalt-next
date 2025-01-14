import React, { useState } from "react";
import {
  X,
  Trash2,
  RefreshCw,
  Sun,
  Moon,
  Filter,
  CheckSquare,
  List,
  Grid,
  Search,
  FileText,
  Image,
  Video,
  File as FileIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { File } from "@/types/filesystem";
import { toNumber } from "lodash";

export const TrashBin: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const { deletedFiles, theme, restoreFile, emptyTrash } = useFilesystemStore();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = deletedFiles.filter((file) => {
    const matchesType = filterType === "all" || file.type === filterType;
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleBatchRestore = () => {
    selectedFiles.forEach((id) => restoreFile(toNumber(id)));
    setSelectedFiles([]);
  };

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
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
                <DialogContent className="p-6 md:p-8">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 max-w-sm">
                        <Input
                          type="text"
                          placeholder="搜索文件..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setViewMode(viewMode === "list" ? "grid" : "list")
                          }
                          className="p-2"
                          aria-label={`切换到${
                            viewMode === "list" ? "网格" : "列表"
                          }视图`}
                        >
                          {viewMode === "list" ? (
                            <Grid className="w-4 h-4" />
                          ) : (
                            <List className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
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
                          {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {filteredFiles.map((file) => (
                                <motion.div
                                  key={file.id}
                                  className="relative group p-4 rounded-lg bg-gray-700 hover:bg-gray-600"
                                >
                                  <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                                      {file.type === "document" ? (
                                        <FileText className="w-8 h-8 text-gray-400" />
                                      ) : file.type === "image" ? (
                                        <Image className="w-8 h-8 text-gray-400" />
                                      ) : file.type === "video" ? (
                                        <Video className="w-8 h-8 text-gray-400" />
                                      ) : (
                                        <FileIcon className="w-8 h-8 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm font-medium truncate w-full">
                                        {file.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      onClick={() => restoreFile(file.id)}
                                    >
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      恢复
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <ul className="mb-4 space-y-2">
                              {filteredFiles.map((file) => (
                                <motion.li
                                  key={file.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.2 }}
                                  className={`flex justify-between items-center p-2 rounded-lg ${
                                    theme === "dark"
                                      ? "bg-gray-700"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  <div>
                                    <p className="font-medium">{file.name}</p>
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
                          )}
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
                  </div>
                </DialogContent>
              </motion.div>
            </DialogOverlay>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
