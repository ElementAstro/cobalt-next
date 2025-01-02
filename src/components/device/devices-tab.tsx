import React, { useEffect, useState } from "react";
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
import { useApiService } from "@/services/device-connection";
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
import { useDeviceSelectorStore } from "@/store/useDeviceStore"; // 更新导入
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import cn from "classnames";
import { DeviceInfo } from "@/types/device";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

export function DevicesTab() {
  const {
    devices,
    remoteDrivers,
    setDevices,
    setRemoteDrivers,
    connect,
    disconnect,
    startScanning,
    stopScanning,
    isScanning,
    error,
    connectionHistory,
  } = useDeviceSelectorStore(); // 使用最新的store方法和状态

  const [searchTerm, setSearchTerm] = useState("");
  const [groups] = useState<string[]>(["All", "Telescope", "Camera"]);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"name" | "type" | "status">(
    "name"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 添加新的状态
  const [showConnectionHistory, setShowConnectionHistory] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    showConnected: true,
    showDisconnected: true,
    showFavorites: false,
  });

  useEffect(() => {
    startScanning(); // 使用store的方法开始扫描
    return () => {
      stopScanning(); // 清理时停止扫描
    };
  }, [startScanning, stopScanning]);

  // 添加过滤逻辑
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedGroup === "All" || device.type === selectedGroup;
    const matchesConnectionState =
      (filterOptions.showConnected && device.connected) ||
      (filterOptions.showDisconnected && !device.connected);
    const matchesFavorites = !filterOptions.showFavorites;

    return (
      matchesSearch &&
      matchesGroup &&
      matchesConnectionState &&
      matchesFavorites
    );
  });

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
              <Button
                onClick={() => {
                  // Handle group creation
                  setGroupDialogOpen(false);
                  setNewGroupName("");
                  setSelectedDevices([]);
                }}
              >
                创建
              </Button>
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

// New component for device card
function DeviceCard({
  device,
  viewMode,
  onSelect,
  isSelected,
}: {
  device: DeviceInfo;
  viewMode: "grid" | "list";
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  function disconnect() {
    const { disconnect } = useDeviceSelectorStore();
    try {
      disconnect();
    } catch (error) {
      console.error("Failed to disconnect device:", error);
    }
  }
  function connect() {
    const { connect } = useDeviceSelectorStore();
    try {
      connect();
    } catch (error) {
      console.error("Failed to connect device:", error);
    }
  }
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
                <DropdownMenuItem>配置</DropdownMenuItem>
                <DropdownMenuItem>属性</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  移除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between">
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
              onClick={
                () =>
                  device.connected
                    ? disconnect() // 使用store的断开方法
                    : connect() // 使用store的连接方法
              }
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
