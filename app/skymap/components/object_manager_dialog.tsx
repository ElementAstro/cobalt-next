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
import { motion } from "framer-motion";

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
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <DialogContent className="fixed top-[2.5vh] left-[2.5vw] w-[95vw] h-[95vh] max-w-7xl -translate-x-0 -translate-y-0 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-200 rounded-lg shadow-lg p-2 overflow-hidden">
          <div className="flex flex-col h-full">
            <DialogHeader className="flex-shrink-0">
              <div className="flex justify-between items-center">
                <DialogTitle>目标管理</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
              <ObjectManagement on_choice_maken={handleClose} />
            </div>
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default ObjectManagementDialog;
