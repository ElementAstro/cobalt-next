import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CameraPanel({ collapsed, onToggle }: PanelProps) {
  return (
    <div>
      <Label htmlFor="my-input">My Input</Label>
      <Input id="my-input" type="text" placeholder="Enter text here" />
      <Switch id="my-switch" />
    </div>
  );
}
