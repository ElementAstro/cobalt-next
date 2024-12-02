import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Search, Power } from "lucide-react";

interface DeviceSelectorProps {
  deviceType: string;
  devices: string[];
  onDeviceChange: (device: string) => void;
}

export function DeviceSelector({
  deviceType,
  devices,
  onDeviceChange,
}: DeviceSelectorProps) {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(!connected);
    // In a real implementation, this would trigger a connection/disconnection to the device
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Select onValueChange={onDeviceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={`Select ${deviceType}`} />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device) => (
            <SelectItem key={device} value={device}>
              {device}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleConnect}>
        <Power
          className={`h-4 w-4 ${connected ? "text-green-500" : "text-red-500"}`}
        />
      </Button>
    </div>
  );
}
