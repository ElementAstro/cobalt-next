import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface GradientPickerProps {
  gradient: {
    color1: string;
    color2: string;
    type: string;
    angle: number;
  };
  onChange: (gradient: GradientPickerProps["gradient"]) => void;
}

export function GradientPicker({ gradient, onChange }: GradientPickerProps) {
  const handleChange = (key: string, value: string | number) => {
    onChange({ ...gradient, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color1">颜色 1</Label>
          <Input
            id="color1"
            type="color"
            value={gradient.color1}
            onChange={(e) => handleChange("color1", e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div>
          <Label htmlFor="color2">颜色 2</Label>
          <Input
            id="color2"
            type="color"
            value={gradient.color2}
            onChange={(e) => handleChange("color2", e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="gradient-type">渐变类型</Label>
        <Select
          value={gradient.type}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger id="gradient-type">
            <SelectValue placeholder="选择渐变类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">线性渐变</SelectItem>
            <SelectItem value="radial">径向渐变</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {gradient.type === "linear" && (
        <div>
          <Label htmlFor="gradient-angle">渐变角度: {gradient.angle}°</Label>
          <Slider
            id="gradient-angle"
            min={0}
            max={360}
            step={1}
            value={[gradient.angle]}
            onValueChange={(value) => handleChange("angle", value[0])}
          />
        </div>
      )}
    </div>
  );
}
