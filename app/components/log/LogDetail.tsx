import { useState } from "react";
import { Log } from "@/types/log";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogDetailProps {
  log: Log;
}

export function LogDetail({ log }: LogDetailProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          查看详情
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>日志详情</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">ID:</span>
            <span className="col-span-3">{log.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">时间戳:</span>
            <span className="col-span-3">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">级别:</span>
            <span className="col-span-3">{log.level}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">来源:</span>
            <span className="col-span-3">{log.source}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">消息:</span>
            <span className="col-span-3">{log.message}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
