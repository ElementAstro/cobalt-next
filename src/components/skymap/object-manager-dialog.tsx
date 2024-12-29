"use client"

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Trash2, Edit } from "lucide-react";
import ObjectManagement from "./object-manager";
import { useGlobalStore } from "@/store/useSkymapStore";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

interface ObjectManagementDialogProps {
  open_dialog: number;
}

const ObjectManagementDialog: React.FC<ObjectManagementDialogProps> = (
  props
) => {
  const [open, setOpen] = useState(false);
  const clearAllChecked = useGlobalStore((state) => state.clearAllChecked);
  const selectAll = useGlobalStore((state) => state.selectAll);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (props.open_dialog > 0) {
      setOpen(true);
    }
  }, [props.open_dialog]);

  const handleClose = () => {
    clearAllChecked();
    setOpen(false);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearAllChecked();
    } else {
      selectAll();
    }
    setIsAllSelected(!isAllSelected);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteSelected = () => {
    // 添加批量删除逻辑
    // 示例: useGlobalStore.getState().deleteSelected();
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <DialogContent className="fixed top-[2.5vh] left-[2.5vw] w-[95vw] h-[95vh] max-w-[1920px] -translate-x-0 -translate-y-0 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-200 rounded-lg shadow-lg p-2 overflow-hidden">
          <div className="flex flex-col h-full">
            <DialogHeader className="flex-shrink-0 sticky top-0 z-10 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <DialogTitle className="text-lg">目标管理</DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center"
                >
                  <Printer className="w-4 h-4 mr-1" />
                  打印
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto px-3 py-2">
              <ObjectManagement on_choice_maken={handleClose} />
            </div>
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default ObjectManagementDialog;
