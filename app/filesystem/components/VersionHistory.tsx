import React from "react";
import {
  X,
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
import { Span } from "@/components/custom/Span";

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
              className="bg-gray-800/95 text-white p-3 rounded-xl max-w-4xl w-[95%] max-h-[90vh] overflow-hidden flex flex-col"
            >
              <DialogContent className="h-full p-0">
                <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
                  <div>
                    <DialogTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      版本历史
                    </DialogTitle>
                    <Span className="text-gray-400 text-xs mt-1">
                      共 {versions.length} 个版本
                    </Span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <DialogDescription className="overflow-y-auto flex-grow p-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {versions.map((version, index) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-2 rounded-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600 hover:border-gray-500 transition-all"
                      >
                        <div className="flex items-start gap-2">
                          {version.thumbnail && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img
                                src={version.thumbnail}
                                alt="Version preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-1">
                              <Badge
                                variant="outline"
                                className="bg-blue-500/20 text-blue-300 text-xs"
                              >
                                {version.type}
                              </Badge>
                              <Span
                                className="text-xs text-gray-400 flex items-center gap-1"
                                icon={HardDrive}
                              >
                                {version.size}
                              </Span>
                            </div>

                            <Span className="text-xs text-gray-300 mb-1">
                              {version.description}
                            </Span>

                            <div className="grid grid-cols-2 gap-1 text-xs text-gray-400 mb-2">
                              <Span
                                className="flex items-center gap-1"
                                icon={Calendar}
                              >
                                {version.date}
                              </Span>
                              <Span
                                className="flex items-center gap-1"
                                icon={User}
                              >
                                {version.user}
                              </Span>
                            </div>

                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-gray-700/50 text-xs"
                                onClick={() =>
                                  handleCompare(version, versions[0])
                                }
                              >
                                <GitCompare className="w-4 h-4 mr-1" />
                                比较
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                                onClick={() => handleExport(version)}
                              >
                                <ArrowDownToLine className="w-4 h-4 mr-1" />
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
