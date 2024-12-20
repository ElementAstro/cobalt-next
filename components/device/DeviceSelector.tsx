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
} from "@/lib/store/device/selector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface DeviceSelectorProps {
  deviceType: DeviceType;
  onDeviceChange?: (device: string) => void;
}

export function DeviceSelector({
  deviceType,
  onDeviceChange,
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

  // 初始化设备列表
  useEffect(() => {
    const templates = getDeviceTemplates(deviceType);
    setDevices(templates);
  }, [deviceType, setDevices]);

  // 模拟连接进度
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
      });
    } else {
      connect();
      toast({
        title: "连接成功",
        description: `已连接到设备 ${selectedDevice?.name}`,
      });
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
        className="space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700">
          <div className="relative">
            <Select onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-full bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-colors">
                <SelectValue placeholder={`选择${deviceType}`} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {devices.map((device) => (
                  <SelectItem
                    key={device.id}
                    value={device.id}
                    className="hover:bg-gray-700 focus:bg-gray-700"
                  >
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <Progress value={connectionProgress} className="h-1" />
              </motion.div>
            )}
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
              disabled={!selectedDevice}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-all hover:scale-105"
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
              className="bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700/50 transition-all hover:scale-105"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-end text-sm text-gray-400 md:text-right"
          >
            {selectedDevice ? (
              <div className="space-y-1">
                <span className="inline-flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  {selectedDevice.name}
                </span>
                <div className="text-xs text-gray-500">
                  {selectedDevice.manufacturer} {selectedDevice.model}
                </div>
                <div className="text-xs text-gray-500">
                  固件: {selectedDevice.firmware} | SN: {selectedDevice.serial}
                </div>
                {selectedDevice.capabilities && (
                  <div className="text-xs text-gray-500">
                    功能: {selectedDevice.capabilities.join(", ")}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">未选择设备</span>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
