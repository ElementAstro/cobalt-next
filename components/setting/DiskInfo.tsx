"use client";

import { useState, useEffect } from "react";
import {
  HardDrive,
  Settings,
  RefreshCw,
  Download,
  Trash2,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useDiskStore } from "@/lib/store/settings";
import { useAutoRefresh } from "@/hooks/use-disk-auto-refresh";
import { DiskChart } from "./DiskChart";
import { DiskHealth } from "./DiskHealth";
import { mockDiskService } from "@/utils/mock-settings";

export default function DiskInfo() {
  const { disks, isLoading, error, fetchDisks, setMockMode } = useDiskStore();
  const [showDetails, setShowDetails] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [isMockMode, setIsMockMode] = useState(true);
  const [selectedDisk, setSelectedDisk] = useState<string | null>(null);
  const [cleanupSuggestions, setCleanupSuggestions] = useState<string[]>([]);
  const [showCleanup, setShowCleanup] = useState(false);

  const { isActive, toggleActive } = useAutoRefresh(
    fetchDisks,
    refreshInterval
  );

  useEffect(() => {
    fetchDisks();
  }, [fetchDisks]);

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} MB`;
    return `${(size / 1024).toFixed(1)} GB`;
  };

  const handleDiskSelect = async (diskId: string) => {
    setSelectedDisk(diskId);
    const suggestions = await mockDiskService.getDiskCleanupSuggestions(diskId);
    setCleanupSuggestions(suggestions);
    setShowCleanup(true);
  };

  const handleExportReport = async () => {
    const report = await mockDiskService.exportDiskReport(disks);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disk_report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCleanup = () => {
    if (selectedDisk) {
      // mockDiskService.cleanupDisk(selectedDisk);
      fetchDisks();
      setShowCleanup(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto mt-8"
    >
      <Card className="bg-gray-800 shadow-lg rounded-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-blue-400" />
            磁盘信息
          </CardTitle>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>设置</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-300">刷新间隔 (秒)</span>
                    <Slider
                      min={1}
                      max={60}
                      step={1}
                      value={[refreshInterval / 1000]}
                      onValueChange={([value]) =>
                        setRefreshInterval(value * 1000)
                      }
                      className="w-48"
                    />
                    <span className="text-xs text-gray-400">
                      {refreshInterval / 1000}s
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Mock 模式</span>
                    <Switch
                      checked={isMockMode}
                      onCheckedChange={(checked) => {
                        setIsMockMode(checked);
                        setMockMode(checked);
                      }}
                      aria-label="切换 Mock 模式"
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">自动刷新</span>
                    <Switch
                      checked={showDetails}
                      onCheckedChange={setShowDetails}
                      aria-label="显示详细信息"
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchDisks}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading ? "animate-spin text-gray-400" : "text-gray-400"
                }`}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportReport}>
              <Download className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence>
            {disks.map((disk) => (
              <motion.div
                key={disk.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-4 bg-gray-700 rounded-lg">
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-white">
                        {disk.name} ({disk.letter}:) - {formatSize(disk.total)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DiskHealth health={disk.health} />
                      {disk.isSystem && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          系统盘
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={(disk.used / disk.total) * 100}
                      className="h-2 mb-2 bg-gray-600 rounded-full"
                      style={{
                        backgroundColor:
                          (disk.used / disk.total) * 100 > 80
                            ? "#e53e3e"
                            : (disk.used / disk.total) * 100 > 50
                            ? "#dd6b20"
                            : "#38a169",
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>已使用 {formatSize(disk.used)}</span>
                      <span>{formatSize(disk.total - disk.used)} 可用</span>
                    </div>
                    {showDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-2"
                      >
                        <p className="text-sm text-gray-300">
                          使用率: {Math.round((disk.used / disk.total) * 100)}%
                        </p>
                        <p className="text-sm text-gray-300">
                          剩余空间: {formatSize(disk.total - disk.used)}
                        </p>
                        <p className="text-sm text-gray-300">
                          健康状况: {disk.health}
                        </p>
                        <p className="text-sm text-gray-300">
                          最后检查时间:{" "}
                          {new Date(disk.lastChecked).toLocaleString()}
                        </p>
                        <div className="mt-4">
                          <DiskChart disk={disk} />
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDiskSelect(disk.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            清理磁盘
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert("查看更多信息")}
                          >
                            <Info className="h-4 w-4 mr-2" />
                            更多信息
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {showCleanup && selectedDisk && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <Card className="w-11/12 md:w-1/2 lg:w-1/3 bg-gray-700 text-white rounded-lg">
                <CardHeader className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">清理建议</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCleanup(false)}
                  >
                    &times;
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {cleanupSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCleanup(false)}
                    >
                      取消
                    </Button>
                    <Button variant="destructive" onClick={handleCleanup}>
                      确认清理
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
