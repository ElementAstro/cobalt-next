import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiService } from "@/services/connection";
import { motion } from "framer-motion";

interface DeviceData {
  name: string;
  type: string;
  connected: boolean;
}

export function DevicesTab() {
  const { fetchDevices, connectDevice, disconnectDevice } = useApiService();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [remoteDrivers, setRemoteDrivers] = useState(
    "driver@host:port,driver@host,@host:port,@host,driver"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDevices().then(setDevices);
  }, [fetchDevices]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) =>
      device.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [devices, search]);

  const handleConnect = async (deviceName: string) => {
    try {
      const updatedDevice = await connectDevice(deviceName);
      setDevices(
        devices.map((d) => (d.name === deviceName ? updatedDevice : d))
      );
    } catch (error) {
      console.error("Failed to connect device:", error);
    }
  };

  const handleDisconnect = async (deviceName: string) => {
    try {
      const updatedDevice = await disconnectDevice(deviceName);
      setDevices(
        devices.map((d) => (d.name === deviceName ? updatedDevice : d))
      );
    } catch (error) {
      console.error("Failed to disconnect device:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto p-4"
    >
      <div className="space-y-6 bg-gray-800/90 backdrop-blur p-6 rounded-xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder="搜索设备..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 dark:bg-gray-700/50 dark:text-gray-200 border-0"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredDevices.map((device) => (
            <motion.div
              key={device.name}
              className="space-y-3 p-4 bg-gray-700/50 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor={device.name.toLowerCase().replace(" ", "-")}>
                {device.name}
              </Label>
              <Select value={device.type}>
                <SelectTrigger className="w-full dark:bg-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={device.type}>{device.type}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={device.connected ? "destructive" : "default"}
                size="sm"
                onClick={() =>
                  device.connected
                    ? handleDisconnect(device.name)
                    : handleConnect(device.name)
                }
                className="w-full"
              >
                {device.connected ? "Disconnect" : "Connect"}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="remote">Remote Drivers</Label>
          <Input
            id="remote"
            value={remoteDrivers}
            onChange={(e) => setRemoteDrivers(e.target.value)}
            className="font-mono text-sm mt-1 dark:bg-gray-700 dark:text-gray-200"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
