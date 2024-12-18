"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomOptionsProps {
  keyboardShortcuts: boolean;
  handleKeyboardShortcuts: (checked: boolean) => void;
  theme: string;
  setTheme: (value: "light" | "dark") => void;
}

const CustomOptions: React.FC<CustomOptionsProps> = ({
  keyboardShortcuts,
  handleKeyboardShortcuts,
  theme,
  setTheme,
}) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm">键盘快捷键</span>
        <Switch
          checked={keyboardShortcuts}
          onCheckedChange={handleKeyboardShortcuts}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-sm">主题</span>
        <Select
          onValueChange={(value) => setTheme(value as "light" | "dark")}
          value={theme}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择主题" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">亮色</SelectItem>
            <SelectItem value="dark">暗色</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomOptions;
