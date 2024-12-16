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
import { toast } from "@/hooks/use-toast";

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
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");

  const handleConnect = () => {
    setConnected(!connected);
    // In a real implementation, this would trigger a connection/disconnection to the device
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      // 模拟扫描设备
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "扫描完成",
        description: "已发现可用设备",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceChange = (device: string) => {
    setSelectedDevice(device);
    onDeviceChange(device);
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Select onValueChange={handleDeviceChange}>
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
          onClick={handleScan}
          disabled={isScanning}
        >
          <Search className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
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
      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-400"
        >
          当前设备: {selectedDevice}
        </motion.div>
      )}
    </motion.div>
  );
}
