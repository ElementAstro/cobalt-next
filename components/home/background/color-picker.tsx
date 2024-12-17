import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="color-picker">背景颜色:</Label>
      <Input
        id="color-picker"
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 p-1 rounded-md"
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-24"
      />
    </div>
  );
}
