"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Search, Power, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  useDeviceSelectorStore,
  getDeviceTemplates,
} from "@/store/useDeviceStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { DeviceType } from "@/types/device";
import debounce from "lodash/debounce";

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

  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanningLocal, setIsScanningLocal] = useState(false);

  // 防抖处理设备变更
  const debouncedDeviceChange = useCallback(
    debounce((deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        selectDevice(device);
        onDeviceChange?.(device.name);
      }
    }, 300),
    [devices, selectDevice, onDeviceChange]
  );

  // 防抖处理扫描
  const debouncedScan = useCallback(
    debounce(async () => {
      if (isScanningLocal) return;

      setIsScanningLocal(true);
      startScanning();
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const templates = getDeviceTemplates(deviceType);
        const newDevices = [...devices, ...templates];
        setDevices(newDevices);
        toast({
          title: "扫描完成",
          description: `发现${templates.length}个新设备`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "扫描失败";
        setError(errorMessage);
        toast({
          title: "扫描失败",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        stopScanning();
        setIsScanningLocal(false);
      }
    }, 500),
    [
      isScanningLocal,
      deviceType,
      devices,
      setDevices,
      toast,
      setError,
      startScanning,
      stopScanning,
    ]
  );

  // 防抖处理连接
  const debouncedConnect = useCallback(
    debounce(async () => {
      if (isConnecting) return;

      setIsConnecting(true);
      try {
        if (isConnected) {
          await disconnect();
          toast({
            title: "已断开连接",
            description: `设备 ${selectedDevice?.name} 已断开`,
            variant: "destructive",
          });
        } else {
          await connect();
          toast({
            title: "连接成功",
            description: `已连接到设备 ${selectedDevice?.name}`,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "连接失败";
        setError(errorMessage);
        toast({
          title: "连接失败",
          description: `无法连接到设备 ${selectedDevice?.name}: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsConnecting(false);
      }
    }, 300),
    [
      isConnecting,
      isConnected,
      selectedDevice,
      connect,
      disconnect,
      toast,
      setError,
    ]
  );

  useEffect(() => {
    const templates = getDeviceTemplates(deviceType);
    setDevices(templates);
  }, [deviceType, setDevices]);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionProgress(Math.floor(Math.random() * 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected, setConnectionProgress]);

  return (
    <AnimatePresence>
      <motion.div
        className={`${customClassName}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-2"
          >
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          className="relative flex flex-row items-center gap-2 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-lg border border-white/10 p-2 shadow-lg backdrop-blur-sm"
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="flex-1 min-w-0">
            <Select onValueChange={debouncedDeviceChange}>
              <SelectTrigger className="h-9 w-full bg-gray-800/50 border-0 text-white hover:bg-gray-700/50 transition-colors">
                <SelectValue placeholder={`选择${deviceType}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[280px] overflow-y-auto bg-gray-800/95 border-gray-700">
                {devices.map((device) => (
                  <SelectItem
                    key={device.id}
                    value={device.id}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
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
                className="absolute left-0 right-0 -bottom-1"
              >
                <Progress
                  value={connectionProgress}
                  className="h-0.5 bg-gray-700"
                />
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-white"
              disabled={!selectedDevice}
              onClick={() => onSettingsClick?.()}
            >
              <Settings className="h-4 w-4" />
              {showAdvancedOptions && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-white"
              onClick={() => debouncedScan()}
              disabled={isScanning}
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-white"
              onClick={() => debouncedConnect()}
              disabled={!selectedDevice || isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Power
                  className={`h-4 w-4 transition-colors ${
                    isConnected ? "text-green-400" : "text-red-400"
                  }`}
                />
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
