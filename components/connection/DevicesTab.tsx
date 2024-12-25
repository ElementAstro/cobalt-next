"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useDevicesStore } from "@/lib/store/connection/devices";
import { DeviceData, DeviceType } from "@/types/connection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export function DevicesTab() {
  const {
    devices,
    loading,
    error,
    remoteDrivers,
    filter,
    selectedDevice,
    fetchDevices,
    connectDevice,
    disconnectDevice,
    setRemoteDrivers,
    setFilter,
    setSelectedDevice,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefresh,
    updateInterval,
    setUpdateInterval,
    deviceStats,
    updateDeviceStats,
    selectedDeviceType,
    setSelectedDeviceType,
    getDevicesByType,
  } = useDevicesStore();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deviceToDisconnect, setDeviceToDisconnect] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchDevices();
    startAutoRefresh();
    return () => stopAutoRefresh();
  }, [fetchDevices, startAutoRefresh, stopAutoRefresh]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) =>
      device.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [devices, search]);

  const handleConnect = async (deviceName: string) => {
    try {
      await connectDevice(deviceName);
      updateDeviceStats();
    } catch (error) {
      console.error("连接设备失败:", error);
    }
  };

  const handleDisconnect = async (deviceName: string) => {
    setDeviceToDisconnect(deviceName);
    setIsDialogOpen(true);
  };

  const confirmDisconnect = async () => {
    if (deviceToDisconnect) {
      try {
        await disconnectDevice(deviceToDisconnect);
        updateDeviceStats();
      } catch (error) {
        console.error("断开设备失败:", error);
      } finally {
        setIsDialogOpen(false);
        setDeviceToDisconnect(null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-5rem)] flex flex-col space-y-4"
    >
      {/* 顶部控制栏 - 固定高度 */}
      <div className="flex items-center space-x-4 bg-gray-800/90 backdrop-blur rounded-lg">
        <Input
          placeholder="搜索设备..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 dark:bg-gray-700/50"
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-refresh" className="sr-only">
            自动刷新
          </Label>
          <Switch
            id="auto-refresh"
            checked={isAutoRefresh}
            onCheckedChange={() =>
              isAutoRefresh ? stopAutoRefresh() : startAutoRefresh()
            }
          />
          <span className="text-sm text-gray-400">自动刷新</span>
        </div>
      </div>

      {/* 统计卡片 - 固定高度 */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="p-4 bg-gray-800/90 backdrop-blur rounded-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <p className="text-sm text-gray-400">总设备数</p>
          <p className="text-2xl font-bold">{deviceStats.total}</p>
        </motion.div>
        <motion.div
          className="p-4 bg-gray-800/90 backdrop-blur rounded-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-gray-400">已连接</p>
          <p className="text-2xl font-bold text-green-500">
            {deviceStats.connected}
          </p>
        </motion.div>
        <motion.div
          className="p-4 bg-gray-800/90 backdrop-blur rounded-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-400">错误</p>
          <p className="text-2xl font-bold text-red-500">{deviceStats.error}</p>
        </motion.div>
      </div>

      {/* 设备列表 - 可滚动区域 */}
      <ScrollArea className="flex-1 rounded-lg bg-gray-800/90 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <motion.div
              key={device.name}
              className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <div className="flex justify-between items-start mb-3">
                <Label className="text-lg font-semibold">{device.name}</Label>
                {device.connected && (
                  <Badge variant="default" className="ml-2">
                    在线
                  </Badge>
                )}
              </div>

              <Select
                value={device.type}
                onValueChange={(value: DeviceType) => {
                  // Update device type
                }}
              >
                <SelectTrigger className="mb-3 w-full bg-gray-600/50">
                  <SelectValue placeholder="选择设备类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Camera">相机</SelectItem>
                  <SelectItem value="Telescope">望远镜</SelectItem>
                  <SelectItem value="Mount">赤道仪</SelectItem>
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
                {device.connected ? "断开连接" : "连接"}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* 底部控制栏 - 固定高度 */}
      <div className="grid grid-cols-2 gap-4 bg-gray-800/90 backdrop-blur rounded-lg">
        <div>
          <Label htmlFor="remote" className="text-sm text-gray-400">
            远程驱动器
          </Label>
          <Input
            id="remote"
            value={remoteDrivers}
            onChange={(e) => setRemoteDrivers(e.target.value)}
            className="mt-1 bg-gray-700/50"
          />
        </div>
        <div>
          <Label htmlFor="update-interval" className="text-sm text-gray-400">
            更新间隔 (ms)
          </Label>
          <Input
            id="update-interval"
            type="number"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="mt-1 bg-gray-700/50"
          />
        </div>
      </div>

      {/* 断开连接确认对话框 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认断开连接?</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要断开与设备的连接吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect}>
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
