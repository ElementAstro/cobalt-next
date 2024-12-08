import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/store/filesystem";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: {
    theme: "light" | "dark";
    gridSize: "small" | "medium" | "large";
    showHiddenFiles: boolean;
    listView: "comfortable",
  };
  setOptions: (options: SettingsPanelProps["options"]) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  options,
  setOptions,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md mx-4 md:mx-0"
        >
          <DialogContent>
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-xl font-bold">设置</DialogTitle>
              <Button variant="ghost" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <DialogDescription className="space-y-4">
              <div>
                <Label className="block mb-2">网格大小</Label>
                <Select
                  value={options.gridSize}
                  onValueChange={(value) =>
                    setOptions({
                      ...options,
                      gridSize: value as "small" | "medium" | "large",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择网格大小" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">小</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="large">大</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={options.showHiddenFiles}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        showHiddenFiles: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  显示隐藏文件
                </Label>
              </div>
            </DialogDescription>
          </DialogContent>
        </motion.div>
      </DialogOverlay>
    </Dialog>
  );
};
