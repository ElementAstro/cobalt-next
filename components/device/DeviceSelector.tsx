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
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <Select onValueChange={handleDeviceChange}>
          <SelectTrigger className="w-full bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-colors">
            <SelectValue placeholder={`选择${deviceType}`} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {devices.map((device) => (
              <SelectItem 
                key={device} 
                value={device}
                className="hover:bg-gray-700 focus:bg-gray-700"
              >
                {device}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        className="flex justify-center space-x-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-all hover:scale-105"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-all hover:scale-105"
          onClick={handleScan}
        >
          <Search className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-all hover:scale-105"
          onClick={handleConnect}
        >
          <Power className={`h-4 w-4 ${connected ? "text-green-400" : "text-red-400"}`} />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-end text-sm text-gray-400 md:text-right"
      >
        {selectedDevice ? (
          <span className="inline-flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            {selectedDevice}
          </span>
        ) : (
          <span className="text-gray-500">未选择设备</span>
        )}
      </motion.div>
    </motion.div>
  );
}
