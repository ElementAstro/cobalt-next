"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Search, Power, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  useDeviceSelectorStore,
  DeviceType,
  getDeviceTemplates,
} from "@/store/useDeviceStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface DeviceSelectorProps {
  deviceType: DeviceType;
  onDeviceChange?: (device: string) => void;
  showAdvancedOptions?: boolean;
  customClassName?: string;
  onSettingsClick?: () => void;
}

export function DeviceSelector({
  deviceType,
  onDeviceChange,
  showAdvancedOptions,
  customClassName,
  onSettingsClick,
}: DeviceSelectorProps) {
  const { toast } = useToast();
  const {
    devices,
    selectedDevice,
    isConnected,
    isScanning,
    connectionProgress,
    error,
    setDevices,
    selectDevice,
    startScanning,
    stopScanning,
    connect,
    disconnect,
    setError,
    setConnectionProgress,
  } = useDeviceSelectorStore();

  // Initialize device list
  useEffect(() => {
    const templates = getDeviceTemplates(deviceType);
    setDevices(templates);
  }, [deviceType, setDevices]);

  // Simulate connection progress
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionProgress(Math.floor(Math.random() * 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected, setConnectionProgress]);

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
      toast({
        title: "已断开连接",
        description: `设备 ${selectedDevice?.name} 已断开`,
        variant: "destructive",
      });
    } else {
      try {
        await connect();
        toast({
          title: "连接成功",
          description: `已连接到设备 ${selectedDevice?.name}`,
        });
      } catch (err) {
        toast({
          title: "连接失败",
          description: `无法连接到设备 ${selectedDevice?.name}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleScan = async () => {
    startScanning();
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const templates = getDeviceTemplates(deviceType);
      const newDevices = [...devices, ...templates];
      setDevices(newDevices);
      toast({
        title: "扫描完成",
        description: "已发现新设备",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "扫描失败");
    } finally {
      stopScanning();
    }
  };

  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      selectDevice(device);
      onDeviceChange?.(device.name);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`space-y-4 ${customClassName}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 bg-gradient-to-br  rounded-xl shadow-xl border border-white p-4"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="col-span-2">
            <Select onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-full bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 transition-colors">
                <SelectValue placeholder={`选择${deviceType}`} />
              </SelectTrigger>
              <SelectContent className="text-white">
                {devices.map((device) => (
                  <motion.div
                    key={device.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <SelectItem
                      value={device.id}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {device.name}
                    </SelectItem>
                  </motion.div>
                ))}
              </SelectContent>
            </Select>
            {isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Progress value={connectionProgress} className="h-1 mt-2" />
              </motion.div>
            )}
          </div>

          <motion.div
            className="flex justify-end items-center space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 backdrop-blur-sm border-white text-white hover:bg-gray-700/50 transition-all hover:scale-105"
              disabled={!selectedDevice}
              onClick={() => onSettingsClick?.()}
            >
              <Settings className="h-4 w-4" />
              {showAdvancedOptions && (
                <motion.span
                  className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 backdrop-blur-sm border-white text-white hover:bg-gray-700/50 transition-all hover:scale-105"
              onClick={handleScan}
              disabled={isScanning}
            >
              <Search
                className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 backdrop-blur-sm border-white text-white hover:bg-gray-700/50 transition-all hover:scale-105"
              onClick={handleConnect}
              disabled={!selectedDevice}
            >
              <Power
                className={`h-4 w-4 ${
                  isConnected ? "text-green-400" : "text-red-400"
                }`}
              />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
