"use client";

import React from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled: boolean;
  ariaLabel: string;
}

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  disabled,
  ariaLabel,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-label={`选择${ariaLabel}`}
        >
          选择颜色
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 p-4 rounded-lg">
        <DialogHeader>
          <DialogTitle>选择颜色</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost">关闭</Button>
          </DialogClose>
        </DialogHeader>
        <HexColorPicker color={color} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
};

export { ColorPickerComponent as ColorPicker };
