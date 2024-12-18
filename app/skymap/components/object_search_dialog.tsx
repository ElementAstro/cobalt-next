import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ObjectSearch from "./object_search";
import { XCircle, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ObjectSearchDialogProps {
  open_dialog: number;
}

const ObjectSearchDialog: React.FC<ObjectSearchDialogProps> = (props) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.open_dialog > 0) {
      setOpen(true);
    }
  }, [props.open_dialog]);

  const handleClose = () => {
    setOpen(false);
  };

  const scrollToTop = () => {
    if (dialogRef.current) dialogRef.current.scrollTop = 0;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogContent
            className="fixed top-1/2 left-1/2 w-[95vw] max-w-5xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-gray-800 dark:bg-gray-900 text-gray-200 rounded-lg shadow-lg p-4 overflow-y-auto"
            ref={dialogRef}
          >
            <DialogHeader className="flex justify-between items-center">
              <DialogTitle>目标搜索</DialogTitle>
              <DialogClose asChild/>
            </DialogHeader>
            <ObjectSearch on_choice_maken={handleClose} />
            <DialogFooter className="mt-4 flex justify-end">
              <Button variant="destructive" onClick={handleClose}>
                <XCircle className="mr-2" size={20} />
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </motion.div>
      </Dialog>
      {open && (
        <ArrowUpCircle
          color="primary"
          size={32}
          className="fixed bottom-4 left-4 z-50 cursor-pointer"
          onClick={scrollToTop}
        />
      )}
    </>
  );
};

export default ObjectSearchDialog;
