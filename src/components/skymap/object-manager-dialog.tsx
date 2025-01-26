"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
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
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const toolbarVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
  };

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

  const handleDeleteSelected = useCallback(() => {
    const targets = useGlobalStore.getState().targets;
    const selectedTargets = targets.filter((t) => t.checked);

    if (selectedTargets.length === 0) {
      toast({
        title: "错误",
        description: "请先选择要删除的目标",
        variant: "destructive",
      });
      return;
    }

    // 显示确认对话框
    const confirmed = window.confirm(
      `确定要删除选中的 ${selectedTargets.length} 个目标吗？此操作无法撤销。`
    );

    if (confirmed) {
      try {
        selectedTargets.forEach((target) => {
          useGlobalStore.getState().removeTarget(target.name);
        });

        useGlobalStore.getState().saveAllTargets();
        useGlobalStore.getState().clearAllChecked();

        toast({
          title: "成功",
          description: `已删除 ${selectedTargets.length} 个目标`,
        });

        handleClose();
      } catch (error) {
        toast({
          title: "错误",
          description: "删除目标时发生错误",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleBatchOperation = useCallback(
    (operation: "delete" | "export" | "print" | "tag" | "flag") => {
      const targets = useGlobalStore.getState().targets;
      const selectedTargets = targets.filter((t) => t.checked);

      if (selectedTargets.length === 0) {
        toast({
          title: "错误",
          description: "请先选择要操作的目标",
          variant: "destructive",
        });
        return;
      }

      switch (operation) {
        case "delete":
          handleDeleteSelected();
          break;
        case "export":
          try {
            const data = selectedTargets.map((target) => ({
              name: target.name,
              ra: target.ra,
              dec: target.dec,
              type: target.target_type,
              tag: target.tag,
              flag: target.flag,
            }));
            const csvContent = `data:text/csv;charset=utf-8,${[
              "Name",
              "RA",
              "Dec",
              "Type",
              "Tag",
              "Flag",
            ].join(",")}\n${data
              .map((t) =>
                [t.name, t.ra, t.dec, t.type, t.tag, t.flag].join(",")
              )
              .join("\n")}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "targets.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({
              title: "成功",
              description: "已导出所选目标",
            });
          } catch (error) {
            toast({
              title: "错误",
              description: "导出目标时发生错误",
              variant: "destructive",
            });
          }
          break;
        case "print":
          window.print();
          break;
        case "tag":
        case "flag":
          // Show dialog for batch tag/flag update
          break;
      }

      useGlobalStore.getState().clearAllChecked();
      handleClose();
    },
    [handleDeleteSelected]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogContent className="fixed inset-0 sm:top-[2.5vh] sm:left-[2.5vw] sm:w-[95vw] sm:h-[95vh] max-w-[1920px] bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-200 rounded-none sm:rounded-lg shadow-lg p-2 overflow-hidden">
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
          <motion.div
            variants={toolbarVariants}
            initial="hidden"
            animate="visible"
            className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700"
          >
            {/* ...toolbar content... */}
          </motion.div>
        </motion.div>
      </Dialog>
      <Toaster />
    </>
  );
};

export default memo(ObjectManagementDialog);
