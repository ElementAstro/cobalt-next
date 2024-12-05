import React from "react";
import { X, Clock, RotateCcw } from "lucide-react";
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
  theme: "light" | "dark";
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  theme,
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
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
                    Version History
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <DialogDescription className="space-y-4">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`flex items-center justify-between p-3 rounded ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{version.date}</p>
                        <p className="text-sm text-gray-400">{version.user}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className={`${
                            theme === "dark"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className={`${
                            theme === "dark"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </DialogDescription>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
