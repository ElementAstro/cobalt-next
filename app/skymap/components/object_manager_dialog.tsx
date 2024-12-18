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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle>目标管理</DialogTitle>
        <DialogClose asChild />
        <DialogContent className="fixed top-1/2 left-1/2 w-[98%] h-[95vh] sm:h-[90vh] max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-gray-800 dark:bg-gray-900 text-gray-200 rounded-lg shadow-lg p-2 overflow-y-auto">
          <div className="overflow-y-hidden">
            <ObjectManagement on_choice_maken={handleClose} />
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default ObjectManagementDialog;
