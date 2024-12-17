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
        <DialogContent className="sm:max-w-3xl" ref={dialogRef}>
          <DialogHeader>
            <DialogTitle>目标搜索</DialogTitle>
          </DialogHeader>
          <ObjectSearch on_choice_maken={handleClose} />
          <DialogFooter>
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
          size={40}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            zIndex: 1400,
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
