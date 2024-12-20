import * as Icons from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SideBarToggleProps {
  device: { id: string; name: string; icon: string; active: boolean };
  onToggle: () => void;
}

const getIconComponent = (iconName: string) => {
  // 转换图标名称为pascal case (例如: arrow-left -> ArrowLeft)
  const pascalCase = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (Icons[pascalCase as keyof typeof Icons] ||
    Icons.HelpCircle) as React.FC<{ className?: string }>;
};

export default function SideBarToggle({
  device,
  onToggle,
}: SideBarToggleProps) {
  const Icon = getIconComponent(device.icon.toLowerCase());

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={device.active ? "default" : "secondary"}
            size="icon"
            onClick={onToggle}
            className={`w-12 h-12 ${
              device.active ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="sr-only">{device.name}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{device.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
