import React from "react";
import {
  X,
  Clock,
  RotateCcw,
  ArrowDownToLine,
  GitCompare,
  User,
  Calendar,
  HardDrive,
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
import { Badge } from "@/components/ui/badge";

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
}) => {
  const versions = [
    {
      id: 1,
      date: "2023-06-01 14:30",
      user: "John Doe",
      changes: 15,
      type: "修改",
      size: "1.2MB",
      description: "更新了图像处理算法",
      thumbnail: "/images/version1-thumb.jpg",
    },
    { id: 2, date: "2023-06-02 09:15", user: "Jane Smith" },
    { id: 3, date: "2023-06-03 16:45", user: "Alice Johnson" },
  ];

  const handleCompare = (
    v1: (typeof versions)[0],
    v2: (typeof versions)[0]
  ) => {
    // 实现版本比较逻辑
  };

  const handleExport = (version: (typeof versions)[0]) => {
    // 实现版本导出逻辑
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="bg-gray-800/95 text-white p-6 rounded-xl max-w-4xl w-[95%] max-h-[90vh] overflow-hidden flex flex-col"
            >
              <DialogContent className="h-full">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                  <div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      版本历史
                    </DialogTitle>
                    <p className="text-gray-400 text-sm mt-1">
                      共 {versions.length} 个版本
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <DialogDescription className="overflow-y-auto flex-grow">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {versions.map((version, index) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600 hover:border-gray-500 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {version.thumbnail && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden">
                              <img
                                src={version.thumbnail}
                                alt="Version preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-500/20 text-blue-300"
                              >
                                {version.type}
                              </Badge>
                              <span className="text-sm text-gray-400 flex items-center gap-1">
                                <HardDrive className="w-4 h-4" />
                                {version.size}
                              </span>
                            </div>

                            <p className="text-sm text-gray-300 mb-2">
                              {version.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {version.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {version.user}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-gray-700/50"
                                onClick={() =>
                                  handleCompare(version, versions[0])
                                }
                              >
                                <GitCompare className="w-4 h-4 mr-2" />
                                比较
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleExport(version)}
                              >
                                <ArrowDownToLine className="w-4 h-4 mr-2" />
                                导出
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </DialogDescription>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
