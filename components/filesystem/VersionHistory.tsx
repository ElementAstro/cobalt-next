// version-history.tsx
import React from "react";
import { X, Clock, RotateCcw, Sun, Moon, ArrowDownToLine, GitCompare } from "lucide-react";
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
      size: "1.2MB"
    },
    { id: 2, date: "2023-06-02 09:15", user: "Jane Smith" },
    { id: 3, date: "2023-06-03 16:45", user: "Alice Johnson" },
  ];

  const handleCompare = (v1: typeof versions[0], v2: typeof versions[0]) => {
    // 实现版本比较逻辑
  };

  const handleExport = (version: typeof versions[0]) => {
    // 实现版本导出逻辑
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-gray-800 text-white p-6 rounded-lg max-w-lg w-full mx-4 sm:mx-0`}
            >
              <DialogContent>
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle className="text-2xl font-bold">
                    版本历史
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <DialogDescription>
                  <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {versions.map((version) => (
                        <motion.div
                          key={version.id}
                          className="p-4 border rounded-lg bg-gray-700"
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{version.type}</span>
                            <Badge variant="outline">{version.size}</Badge>
                          </div>
                          <div className="space-y-2">
                            <p>修改数量: {version.changes}</p>
                            <div className="flex space-x-2">
                              <Button onClick={() => handleCompare(version, versions[0])}>
                                <GitCompare className="w-4 h-4 mr-2" />
                                比较
                              </Button>
                              <Button onClick={() => handleExport(version)}>
                                <ArrowDownToLine className="w-4 h-4 mr-2" />
                                导出
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.ul>
                </DialogDescription>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};