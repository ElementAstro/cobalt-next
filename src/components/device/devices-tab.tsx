"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDeviceSelectorStore } from "@/store/useDeviceStore";
import cn from "classnames";
import { DeviceInfo, ConnectionRecord } from "@/types/device";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

// Define interfaces for state
interface FilterOptions {
  showConnected: boolean;
  showDisconnected: boolean;
  showFavorites: boolean;
}

interface FilterSettings {
  connected: boolean;
  disconnected: boolean;
  favorites: boolean;
  type: string;
}

export function DevicesTab() {
  const {
    devices,
    connect,
    disconnect,
    startScanning,
    stopScanning,
    connectionHistory,
    setConnectionHistory,
  } = useDeviceSelectorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<string[]>(["All", "Telescope", "Camera"]);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"name" | "type" | "status">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showConnectionHistory, setShowConnectionHistory] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showConnected: true,
    showDisconnected: true,
    showFavorites: false,
  });

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    connected: true,
    disconnected: true,
    favorites: false,
    type: "all",
  });

  // Connection history handling
  const handleUpdateConnectionHistory = useCallback(
    (deviceId: string, success: boolean) => {
      const newRecord: ConnectionRecord = {
        deviceId,
        timestamp: new Date().toISOString(),
        success,
      };
      setConnectionHistory((prev: ConnectionRecord[]) => [newRecord, ...prev]);
    },
    [setConnectionHistory]
  );

  // Device connection handling
  const handleDeviceConnection = useCallback(
    async (deviceId: string) => {
      try {
        const device = devices.find((d) => d.id === deviceId);
        if (!device) return;

        if (device.connected) {
          disconnect();
          handleUpdateConnectionHistory(deviceId, true);
        } else {
          connect();
          handleUpdateConnectionHistory(deviceId, true);
        }
      } catch (error) {
        handleUpdateConnectionHistory(deviceId, false);
        console.error("Connection operation failed:", error);
      }
    },
    [devices, connect, disconnect, handleUpdateConnectionHistory]
  );

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, [startScanning, stopScanning]);

  // 改进过滤设备的逻辑
  const filteredDevices = React.useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = device.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterSettings.type === "all" || device.type === filterSettings.type;
      const matchesConnection =
        (device.connected && filterSettings.connected) ||
        (!device.connected && filterSettings.disconnected);
      const matchesFavorites = !filterSettings.favorites || device.isFavorite;

      return (
        matchesSearch && matchesType && matchesConnection && matchesFavorites
      );
    });
  }, [devices, searchTerm, filterSettings]);

  // Sort devices based on current sort order
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    switch (sortOrder) {
      case "name":
        return a.name.localeCompare(b.name);
      case "type":
        return a.type.localeCompare(b.type);
      case "status":
        return Number(b.connected) - Number(a.connected);
      default:
        return 0;
    }
  });

  // 实现分组管理功能
  const handleCreateGroup = useCallback(() => {
    if (!newGroupName || selectedDevices.length === 0) return;

    // 创建新分组
    const newGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      devices: selectedDevices,
    };

    // 更新分组列表
    setGroups((prev) => [...prev, newGroup.name]);
    setGroupDialogOpen(false);
    setNewGroupName("");
    setSelectedDevices([]);
  }, [newGroupName, selectedDevices]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-gray-900 p-6 rounded-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Controls Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-800/50 p-4 rounded-lg">
          <div className="flex flex-1 gap-4 items-center">
            <div className="w-full md:w-64">
              <div className="relative">
                <Input
                  placeholder="搜索设备..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                  aria-label="搜索设备"
                />
                {searchTerm && filteredDevices.length > 0 && (
                  <Card className="absolute mt-1 w-full z-10">
                    <ScrollArea className="h-[200px]">
                      <div className="p-2 space-y-2">
                        {filteredDevices.map((device) => (
                          <Button
                            key={device.id} // 使用唯一的id
                            variant="ghost"
                            className="w-full justify-start text-left"
                            onClick={() => setSearchTerm(device.name)}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  device.connected
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              {device.name}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
                )}
                {searchTerm && filteredDevices.length === 0 && (
                  <Card className="absolute mt-1 w-full z-10">
                    <div className="p-4 text-center text-muted-foreground">
                      未找到设备。
                    </div>
                  </Card>
                )}
              </div>
            </div>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full md:w-40 bg-gray-800 text-white">
                <SelectValue placeholder="按类型筛选" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  排序方式
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOrder("name")}>
                  按名称
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("type")}>
                  按类型
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("status")}>
                  按状态
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? "列表视图" : "网格视图"}
            </Button>
          </div>
        </div>

        {/* 新增高级过滤器面板 */}
        <motion.div
          initial={false}
          animate={{ height: showAdvancedFilters ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <Card className="bg-gray-800 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Switch
                checked={filterOptions.showConnected}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    showConnected: checked,
                  }))
                }
              />
              <Switch
                checked={filterOptions.showDisconnected}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    showDisconnected: checked,
                  }))
                }
              />
              <Switch
                checked={filterOptions.showFavorites}
                onCheckedChange={(checked) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    showFavorites: checked,
                  }))
                }
              />
            </div>
          </Card>
        </motion.div>

        {/* Device List/Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-2"
            }
          >
            {sortedDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                viewMode={viewMode}
                onSelect={(id) =>
                  setSelectedDevices((prev) =>
                    prev.includes(id)
                      ? prev.filter((devId) => devId !== id)
                      : [...prev, id]
                  )
                }
                isSelected={selectedDevices.includes(device.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Group Management Dialog */}
        <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建设备组</DialogTitle>
              <DialogDescription>
                将选定的设备添加到新的设备组中
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>组名称</Label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="输入组名称"
                />
              </div>
              <div>
                <Label>已选设备</Label>
                <div className="mt-2 space-y-2">
                  {selectedDevices.map((id) => {
                    const device = devices.find((d) => d.id === id);
                    return (
                      <Badge key={id} variant="secondary">
                        {device?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setGroupDialogOpen(false)}
              >
                取消
              </Button>
              <Button onClick={handleCreateGroup}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 连接历史记录对话框 */}
        <Dialog
          open={showConnectionHistory}
          onOpenChange={setShowConnectionHistory}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>连接历史</DialogTitle>
              <DialogDescription>查看设备连接历史记录</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>设备</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectionHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.timestamp}</TableCell>
                      <TableCell>
                        {devices.find((d) => d.id === record.deviceId)?.name}
                      </TableCell>
                      <TableCell>
                        {record.success ? (
                          <Badge variant="default">成功</Badge>
                        ) : (
                          <Badge variant="destructive">失败</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}

// Device Card component with proper typing
const DeviceCard = React.memo(
  ({
    device,
    viewMode,
    onSelect,
    isSelected,
  }: {
    device: DeviceInfo;
    viewMode: "grid" | "list";
    onSelect: (id: string) => void;
    isSelected: boolean;
  }) => {
    const { devices, setDevices, connect, disconnect } = useDeviceSelectorStore();
    
    const handleConnect = useCallback(async () => {
      try {
        if (device.connected) {
          await disconnect();
          // 更新本地设备状态
          const updatedDevices = devices.map(d => 
            d.id === device.id ? { ...d, connected: false } : d
          );
          setDevices(updatedDevices);
        } else {
          await connect();
          // 更新本地设备状态
          const updatedDevices = devices.map(d => 
            d.id === device.id ? { ...d, connected: true } : d
          );
          setDevices(updatedDevices);
        }
      } catch (error) {
        console.error("设备连接操作失败:", error);
        // 可以在这里添加错误提示UI
      }
    }, [device.id, device.connected, devices, connect, disconnect, setDevices]);

    const handleToggleFavorite = useCallback(() => {
      const updatedDevices = devices.map(d => 
        d.id === device.id ? { ...d, isFavorite: !d.isFavorite } : d
      );
      setDevices(updatedDevices);
    }, [device.id, devices, setDevices]);

    return (
      <motion.div
        layout
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            "bg-gray-800 text-white transition-colors",
            isSelected && "ring-2 ring-primary"
          )}
        >
          <CardContent
            className={cn(
              "p-4",
              viewMode === "list" && "flex items-center justify-between"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={device.connected ? "default" : "secondary"}>
                  {device.type}
                </Badge>
                <h3 className="font-medium">{device.name}</h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="更多选项">
                    ⋮
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 text-white">
                  <DropdownMenuItem onClick={() => onSelect(device.id)}>
                    {isSelected ? "取消选择" : "选择"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggleFavorite}>
                    {device.isFavorite ? "取消收藏" : "收藏"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>配置</DropdownMenuItem>
                  <DropdownMenuItem>属性</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    移除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    device.connected ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">
                  {device.connected ? "已连接" : "未连接"}
                </span>
              </div>
              <Button
                variant={device.connected ? "destructive" : "default"}
                size="sm"
                onClick={handleConnect}
                aria-label={device.connected ? "断开连接" : "连接设备"}
              >
                {device.connected ? "断开" : "连接"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

DeviceCard.displayName = "DeviceCard";
