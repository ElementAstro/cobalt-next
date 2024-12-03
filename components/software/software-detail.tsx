import { X } from "lucide-react";
import { Software } from "@/types/software";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SoftwareDetailProps {
  software: Software | null;
  onClose: () => void;
}

export function SoftwareDetail({ software, onClose }: SoftwareDetailProps) {
  if (!software) return null;

  return (
    <Dialog open={!!software} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{software.name}</DialogTitle>
          <DialogDescription>软件详细信息</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img
              src={software.icon}
              alt={software.name}
              className="h-16 w-16 rounded-lg"
            />
            <div>
              <p className="font-semibold">{software.version}</p>
              <p className="text-sm text-muted-foreground">{software.author}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>安装日期：</p>
            <p>{software.date}</p>
            <p>大小：</p>
            <p>{software.size}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            这里可以添加更多软件的详细信息，如描述、系统要求、许可证等。
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
