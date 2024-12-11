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
import { motion } from "framer-motion";

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
    <motion.div
      className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Select onValueChange={onDeviceChange}>
        <SelectTrigger className="w-full md:w-[200px] bg-gray-700 text-white">
          <SelectValue placeholder={`Select ${deviceType}`} />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white">
          {devices.map((device) => (
            <SelectItem key={device} value={device}>
              {device}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-700 text-white"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-700 text-white"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-700 text-white"
          onClick={handleConnect}
        >
          <Power
            className={`h-4 w-4 ${
              connected ? "text-green-500" : "text-red-500"
            }`}
          />
        </Button>
      </motion.div>
    </motion.div>
  );
}
