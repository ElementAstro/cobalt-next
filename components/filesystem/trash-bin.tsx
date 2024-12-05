import React, { useState } from "react";
import { X, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TrashBinProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const TrashBin: React.FC<TrashBinProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [deletedFiles, setDeletedFiles] = useState([
    {
      id: 1,
      name: "document1.pdf",
      deletedAt: new Date(Date.now() - 86400000).toLocaleString(),
    },
    {
      id: 2,
      name: "image.jpg",
      deletedAt: new Date(Date.now() - 172800000).toLocaleString(),
    },
    {
      id: 3,
      name: "spreadsheet.xlsx",
      deletedAt: new Date(Date.now() - 259200000).toLocaleString(),
    },
  ]);

  if (!isOpen) return null;

  const handleRestore = (id: number) => {
    setDeletedFiles(deletedFiles.filter((file) => file.id !== id));
    // Implement actual file restoration logic here
  };

  const handleEmptyTrash = () => {
    setDeletedFiles([]);
    // Implement actual trash emptying logic here
  };

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
                    Trash Bin
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <DialogDescription>
                  {deletedFiles.length > 0 ? (
                    <>
                      <ul className="mb-4 space-y-2">
                        {deletedFiles.map((file) => (
                          <li
                            key={file.id}
                            className="flex justify-between items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                          >
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Deleted: {file.deletedAt}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleRestore(file.id)}
                              className="p-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={handleEmptyTrash}
                        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                      >
                        <Trash2 className="w-5 h-5 inline-block mr-2" />
                        Empty Trash
                      </Button>
                    </>
                  ) : (
                    <p className="text-center">Trash is empty</p>
                  )}
                </DialogDescription>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
