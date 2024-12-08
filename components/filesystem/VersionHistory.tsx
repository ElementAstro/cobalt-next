// version-history.tsx
import React from "react";
import { X, Clock, RotateCcw, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
}) => {
  const versions = [
    { id: 1, date: "2023-06-01 14:30", user: "John Doe" },
    { id: 2, date: "2023-06-02 09:15", user: "Jane Smith" },
    { id: 3, date: "2023-06-03 16:45", user: "Alice Johnson" },
  ];

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
                    {versions.map((version) => (
                      <motion.li
                        key={version.id}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        className={`flex items-center justify-between p-4 mb-2 rounded bg-gray-700`}
                      >
                        <div>
                          <p className="font-medium">{version.date}</p>
                          <p className="text-sm text-gray-400">{version.user}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className={`flex items-center space-x-1 border-gray-500 text-gray-300 hover:bg-gray-600`}
                          >
                            <Clock className="w-4 h-4" />
                            <span>查看</span>
                          </Button>
                          <Button
                            variant="outline"
                            className={`flex items-center space-x-1 border-green-500 text-green-300 hover:bg-green-600`}
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>还原</span>
                          </Button>
                        </div>
                      </motion.li>
                    ))}
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