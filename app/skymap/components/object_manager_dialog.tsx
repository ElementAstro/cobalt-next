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
import { X } from "lucide-react";
import ObjectManagement from "./object_manager";
import { useGlobalStore } from "@/lib/store/skymap/target";

interface ObjectManagementDialogProps {
  open_dialog: number;
}

const ObjectManagementDialog: React.FC<ObjectManagementDialogProps> = (
  props
) => {
  const [open, setOpen] = useState(false);
  const clearAllChecked = useGlobalStore((state) => state.clearAllChecked);

  useEffect(() => {
    if (props.open_dialog > 0) {
      setOpen(true);
    }
  }, [props.open_dialog]);

  const handleClose = () => {
    clearAllChecked();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogContent className="fixed top-1/2 left-1/2 w-[98%] h-[95vh] sm:h-[90vh] max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-gray-800 dark:bg-gray-900 text-gray-200 rounded-lg shadow-lg p-1 sm:p-2 overflow-y-auto">
        <DialogHeader className="flex justify-between items-center sticky top-0 bg-gray-800 dark:bg-gray-900 z-10 py-1 sm:py-2">
          <DialogTitle className="text-gray-200">待拍摄目标管理</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="mt-1 sm:mt-2 overflow-y-auto">
          <ObjectManagement on_choice_maken={handleClose} />
        </div>
        <div className="mt-2 sm:mt-4 flex justify-end sticky bottom-0 bg-gray-800 dark:bg-gray-900 py-1">
          <Button variant="destructive" onClick={handleClose}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectManagementDialog;
