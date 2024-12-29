"use client";

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
import ObjectSearch from "./object-search";
import { XCircle, ArrowUpCircle, Filter } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ObjectSearchDialogProps {
  open_dialog: number;
}

const ObjectSearchDialog: React.FC<ObjectSearchDialogProps> = (props) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("全部");

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

  const handleFilterSelect = (value: string) => {
    setFilter(value);
    // 这里可以添加根据过滤选项重新搜索的逻辑
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
            className="fixed top-1/2 left-1/2 w-[95vw] max-w-5xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-gray-800 dark:bg-gray-900 text-gray-200 rounded-lg shadow-lg p-3 overflow-y-auto"
            ref={dialogRef}
          >
            <DialogHeader className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <DialogTitle className="text-lg">目标搜索</DialogTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Filter size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleFilterSelect("全部")}
                    >
                      全部
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleFilterSelect("星系")}
                    >
                      星系
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleFilterSelect("星云")}
                    >
                      星云
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  <XCircle className="w-4 h-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <ObjectSearch on_choice_maken={handleClose} />
            <DialogFooter className="mt-2 flex justify-end space-x-2">
              <Button variant="destructive" size="sm" onClick={handleClose}>
                <XCircle className="w-4 h-4 mr-1" />
                关闭
              </Button>
              <Button variant="default" size="sm" onClick={scrollToTop}>
                <ArrowUpCircle className="w-4 h-4 mr-1" />
                回到顶部
              </Button>
            </DialogFooter>
          </DialogContent>
        </motion.div>
      </Dialog>
      {open && (
        <ArrowUpCircle
          color="primary"
          size={24}
          className="fixed bottom-4 left-4 z-50 cursor-pointer"
          onClick={scrollToTop}
        />
      )}
    </>
  );
};

export default ObjectSearchDialog;
