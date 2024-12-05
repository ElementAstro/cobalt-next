import React from "react";
import { X } from "lucide-react";
import { CustomizationOptions } from "./types";
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

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: CustomizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  options,
  setOptions,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md mx-4 md:mx-0"
        >
          <DialogContent>
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
              <Button variant="ghost" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <DialogDescription className="space-y-4">
              <div>
                <Label className="block mb-2">Theme</Label>
                <Select
                  value={options.theme}
                  onValueChange={(value) =>
                    setOptions({ ...options, theme: value as "light" | "dark" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block mb-2">Grid Size</Label>
                <Select
                  value={options.gridSize}
                  onValueChange={(value) =>
                    setOptions({
                      ...options,
                      gridSize: value as "small" | "medium" | "large",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grid size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
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
                  Show Hidden Files
                </Label>
              </div>
            </DialogDescription>
          </DialogContent>
        </motion.div>
      </DialogOverlay>
    </Dialog>
  );
};
