import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BackgroundPatternPickerProps {
  pattern: string;
  onChange: (pattern: string) => void;
}

export function BackgroundPatternPicker({
  pattern,
  onChange,
}: BackgroundPatternPickerProps) {
  const patterns = [
    "no-repeat",
    "repeat",
    "repeat-x",
    "repeat-y",
    "space",
    "round",
  ];

  return (
    <div>
      <Label htmlFor="background-pattern">背景重复</Label>
      <Select value={pattern} onValueChange={onChange}>
        <SelectTrigger id="background-pattern">
          <SelectValue placeholder="选择背景重复模式" />
        </SelectTrigger>
        <SelectContent>
          {patterns.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
