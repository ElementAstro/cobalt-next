import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ObjectSearch from "./object_search";
import { XCircle, ArrowUpCircle } from "lucide-react";

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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-5xl max-h-[95vh] overflow-y-auto p-1 sm:p-2" ref={dialogRef}>
          <DialogHeader>
            <DialogTitle>目标搜索</DialogTitle>
          </DialogHeader>
          <ObjectSearch on_choice_maken={handleClose} />
          <DialogFooter className="mt-1 sm:mt-2">
            <Button variant="destructive" onClick={handleClose}>
              <XCircle className="mr-2" size={20} />
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {open && (
        <ArrowUpCircle
          color="primary"
          size={32}
          style={{
            position: "fixed",
            bottom: "16px",
            left: "16px",
            zIndex: 1400,
            cursor: "pointer"
          }}
          onClick={() => {
            if (dialogRef.current) dialogRef.current.scrollTop = 0;
          }}
        />
      )}
    </>
  );
};

export default ObjectSearchDialog;
