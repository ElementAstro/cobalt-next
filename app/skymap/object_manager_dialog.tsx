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
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-30" />
      <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>待拍摄目标管理</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="mt-4">
          <ObjectManagement on_choice_maken={handleClose} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="destructive" onClick={handleClose}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectManagementDialog;
