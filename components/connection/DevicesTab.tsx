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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto p-4"
    >
      <div className="space-y-6 bg-gray-800/90 backdrop-blur p-6 rounded-xl shadow-lg">
        {/* 搜索栏 */}
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

        {/* 设备列表 */}
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
              <Select
                value={device.type}
                onValueChange={(value: DeviceType) => {
                  // 更新设备类型
                  // 这里可以添加相应的逻辑
                }}
              >
                <SelectTrigger className="w-full dark:bg-gray-600 dark:text-gray-200">
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
              {device.connected && (
                <Badge variant="outline" className="mt-2">
                  在线
                </Badge>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* 远程驱动器输入 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="remote">远程驱动器</Label>
          <Input
            id="remote"
            value={remoteDrivers}
            onChange={(e) => setRemoteDrivers(e.target.value)}
            className="font-mono text-sm mt-1 dark:bg-gray-700 dark:text-gray-200"
          />
        </motion.div>

        {/* 更新间隔输入 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label htmlFor="update-interval">更新间隔 (ms)</Label>
          <Input
            id="update-interval"
            type="number"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="font-mono text-sm mt-1 dark:bg-gray-700 dark:text-gray-200"
          />
          <div className="flex items-center mt-2">
            <Label htmlFor="auto-refresh">自动刷新</Label>
            <Switch
              id="auto-refresh"
              checked={isAutoRefresh}
              onCheckedChange={() =>
                isAutoRefresh ? stopAutoRefresh() : startAutoRefresh()
              }
              className="ml-2"
            />
          </div>
        </motion.div>

        {/* 设备统计信息 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Label>设备统计</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-gray-700/50 backdrop-blur rounded-lg shadow-md">
              <p className="text-sm text-gray-400">总设备数</p>
              <p className="text-lg font-semibold text-gray-200">
                {deviceStats.total}
              </p>
            </div>
            <div className="p-4 bg-gray-700/50 backdrop-blur rounded-lg shadow-md">
              <p className="text-sm text-gray-400">已连接</p>
              <p className="text-lg font-semibold text-gray-200">
                {deviceStats.connected}
              </p>
            </div>
            <div className="p-4 bg-gray-700/50 backdrop-blur rounded-lg shadow-md">
              <p className="text-sm text-gray-400">错误</p>
              <p className="text-lg font-semibold text-gray-200">
                {deviceStats.error}
              </p>
            </div>
          </div>
        </motion.div>
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
