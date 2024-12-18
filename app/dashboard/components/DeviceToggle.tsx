import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Telescope,
  Focus,
  Compass,
  Filter,
  Image,
  Cloud,
  Star,
  Crosshair,
  Target,
  List,
  Layers,
  Wifi,
  Plug
} from "lucide-react";

interface DeviceToggleProps {
  device: { id: string; name: string; icon: string; active: boolean };
  onToggle: () => void;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    telescope: Telescope,
    focus: Focus,
    compass: Compass,
    filter: Filter,
    image: Image,
    cloud: Cloud,
    star: Star,
    crosshair: Crosshair,
    target: Target,
    list: List,
    layers: Layers,
    wifi: Wifi,
    plug: Plug
  };

export default function DeviceToggle({ device, onToggle }: DeviceToggleProps) {
  const Icon = iconMap[device.icon];

  if (!Icon) {
    console.error(`Icon not found for device: ${device.name}`);
    return null;
  }

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
