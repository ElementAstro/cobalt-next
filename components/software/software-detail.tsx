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
import { motion } from "framer-motion";

interface SoftwareDetailProps {
  software: Software | null;
  onClose: () => void;
}

export function SoftwareDetail({ software, onClose }: SoftwareDetailProps) {
  if (!software) return null;

  return (
    <Dialog open={!!software} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{software.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            软件详细信息
          </DialogDescription>
        </DialogHeader>
        <motion.div
          className="grid gap-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <img
              src={software.icon}
              alt={software.name}
              className="h-16 w-16 rounded-lg"
            />
            <div>
              <p className="font-semibold text-white">{software.version}</p>
              <p className="text-sm text-gray-400">{software.author}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-white">
            <p>安装日期：</p>
            <p>{software.date}</p>
            <p>大小：</p>
            <p>{software.size}</p>
          </div>
          <p className="text-sm text-gray-400">
            这里可以添加更多软件的详细信息，如描述、系统要求、许可证等。
          </p>
        </motion.div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="dark:bg-gray-700 dark:text-white"
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
