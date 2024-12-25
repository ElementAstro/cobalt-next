"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RefreshCw,
  Search,
  Power,
  Moon,
  Sun,
  Download,
  Upload,
  Bell,
  Info,
} from "lucide-react";
import {
  INDIPanelProps,
  INDIDevice,
  INDIGroup,
  DeviceState,
  FilterOptions,
} from "@/types/indi";
import { PropertyControl } from "./PropertyControl";
import { toast } from "@/hooks/use-toast";
import { AdvancedFilter } from "./AdvancedFilter";
import { DeviceDashboard } from "./DeviceDashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function INDIPanel({
  devices,
  onPropertyChange,
  onRefresh,
  onConnect,
  onDisconnect,
  onExportConfig,
  onImportConfig,
}: INDIPanelProps) {
  const [logs, setLogs] = React.useState<string[]>([]);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    searchTerm: "",
    propertyTypes: [],
    propertyStates: [],
    groups: [],
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const [selectedProperties, setSelectedProperties] = React.useState<
    Set<string>
  >(new Set());
  const [autoRefreshInterval, setAutoRefreshInterval] =
    React.useState<number>(0);
  const [showDashboard, setShowDashboard] = React.useState(true);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  React.useEffect(() => {
    if (autoRefreshInterval > 0) {
      const timer = setInterval(() => {
        selectedProperties.forEach((prop) => {
          const [deviceName, propertyName] = prop.split(".");
          handleRefresh(deviceName, propertyName);
        });
      }, autoRefreshInterval * 1000);
      return () => clearInterval(timer);
    }
  }, [autoRefreshInterval, selectedProperties]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const handlePropertyChange = async (
    deviceName: string,
    propertyName: string,
    value: string | number | boolean
  ) => {
    try {
      await onPropertyChange(deviceName, propertyName, value);
      addLog(`已将 ${deviceName}.${propertyName} 修改为 ${value}`);
    } catch (error) {
      addLog(`修改 ${deviceName}.${propertyName} 失败`);
      toast({
        title: "错误",
        description: `修改 ${propertyName} 失败，请重试。`,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async (deviceName: string, propertyName?: string) => {
    try {
      await onRefresh(deviceName, propertyName);
      addLog(`已刷新 ${deviceName}${propertyName ? `.${propertyName}` : ""}`);
    } catch (error) {
      addLog(
        `刷新 ${deviceName}${propertyName ? `.${propertyName}` : ""} 失败`
      );
      toast({
        title: "错误",
        description: `刷新 ${deviceName}${
          propertyName ? `.${propertyName}` : ""
        } 失败，请重试。`,
        variant: "destructive",
      });
    }
  };

  const handleConnect = async (deviceName: string) => {
    try {
      await onConnect(deviceName);
      addLog(`已连接到 ${deviceName}`);
    } catch (error) {
      addLog(`连接 ${deviceName} 失败`);
      toast({
        title: "错误",
        description: `连接 ${deviceName} 失败，请重试。`,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (deviceName: string) => {
    try {
      await onDisconnect(deviceName);
      addLog(`已断开 ${deviceName}`);
    } catch (error) {
      addLog(`断开 ${deviceName} 失败`);
      toast({
        title: "错误",
        description: `断开 ${deviceName} 失败，请重试。`,
        variant: "destructive",
      });
    }
  };

  const handleExportConfig = async (deviceName: string) => {
    try {
      await onExportConfig(deviceName);
      addLog(`已导出 ${deviceName} 的配置`);
      toast({
        title: "成功",
        description: `${deviceName} 的配置已导出。`,
      });
    } catch (error) {
      addLog(`导出 ${deviceName} 的配置失败`);
      toast({
        title: "错误",
        description: `导出 ${deviceName} 的配置失败，请重试。`,
        variant: "destructive",
      });
    }
  };

  const handleImportConfig = async (deviceName: string, config: string) => {
    try {
      await onImportConfig(deviceName, config);
      addLog(`已导入 ${deviceName} 的配置`);
      toast({
        title: "成功",
        description: `${deviceName} 的配置已导入。`,
      });
    } catch (error) {
      addLog(`导入 ${deviceName} 的配置失败`);
      toast({
        title: "错误",
        description: `导入 ${deviceName} 的配置失败，请重试。`,
        variant: "destructive",
      });
    }
  };

  const handlePropertyDoubleClick = (
    deviceName: string,
    propertyName: string
  ) => {
    const key = `${deviceName}.${propertyName}`;
    const newSelected = new Set(selectedProperties);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedProperties(newSelected);
  };

  const renderQuickControls = () => (
    <motion.div
      className="flex gap-2 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Select
        value={autoRefreshInterval.toString()}
        onValueChange={(value) => setAutoRefreshInterval(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="自动刷新间隔" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">关闭自动刷新</SelectItem>
          <SelectItem value="5">每5秒</SelectItem>
          <SelectItem value="10">每10秒</SelectItem>
          <SelectItem value="30">每30秒</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={() => setShowDashboard(!showDashboard)}
      >
        {showDashboard ? "隐藏仪表盘" : "显示仪表盘"}
      </Button>
    </motion.div>
  );

  const renderDeviceStateButton = (device: INDIDevice) => {
    switch (device.state) {
      case "Disconnected":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleConnect(device.name)}
                >
                  <Power className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>连接设备</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "Connected":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDisconnect(device.name)}
                >
                  <Power className="w-5 h-5 text-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>断开设备</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "Connecting":
        return (
          <Button variant="outline" size="icon" disabled>
            <RefreshCw className="w-5 h-5 animate-spin" />
          </Button>
        );
      case "Error":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleConnect(device.name)}
                >
                  <Power className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>重试连接</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const renderDevice = (device: INDIDevice) => (
    <TabsContent key={device.name} value={device.name} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{device.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold dark:text-gray-300">
            {device.name}
          </h2>
        </div>
        <div className="flex gap-2">
          {renderDeviceStateButton(device)}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRefresh(device.name)}
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>刷新所有</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleExportConfig(device.name)}
                >
                  <Download className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>导出配置</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleImportConfig(device.name, "")}
                >
                  <Upload className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>导入配置</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
      <Accordion type="multiple" className="w-full">
        {device.groups.map((group) => renderGroup(device.name, group))}
      </Accordion>
    </TabsContent>
  );

  const renderGroup = (deviceName: string, group: INDIGroup) => {
    const filteredProperties = group.properties.filter(
      (prop) =>
        (filterOptions.searchTerm === "" ||
          prop.name
            .toLowerCase()
            .includes(filterOptions.searchTerm.toLowerCase()) ||
          prop.label
            .toLowerCase()
            .includes(filterOptions.searchTerm.toLowerCase())) &&
        (filterOptions.propertyTypes.length === 0 ||
          filterOptions.propertyTypes.includes(prop.type)) &&
        (filterOptions.propertyStates.length === 0 ||
          filterOptions.propertyStates.includes(prop.state)) &&
        (filterOptions.groups.length === 0 ||
          filterOptions.groups.includes(group.name))
    );

    if (filteredProperties.length === 0) return null;

    return (
      <AccordionItem key={group.name} value={group.name}>
        <AccordionTrigger>{group.name}</AccordionTrigger>
        <AccordionContent>
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <motion.div
                key={property.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <PropertyControl
                  deviceName={deviceName}
                  property={property}
                  onChange={handlePropertyChange}
                  onRefresh={handleRefresh}
                  onDoubleClick={() =>
                    handlePropertyDoubleClick(deviceName, property.name)
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const allGroups = React.useMemo(() => {
    const groups = new Set<string>();
    devices.forEach((device) => {
      device.groups.forEach((group) => {
        groups.add(group.name);
      });
    });
    return Array.from(groups);
  }, [devices]);

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white max-h-screen overflow-hidden">
      <Card className="h-full m-0 rounded-none">
        <CardContent className="p-1 sm:p-2">
          <div className="grid grid-rows-[auto_1fr_auto] h-[100vh] gap-1">
            {/* 顶部控制栏，使用更紧凑的布局 */}
            <div className="flex gap-1 items-center">
              {renderQuickControls()}
              <div className="flex-1">
                <Input
                  placeholder="搜索属性..."
                  value={filterOptions.searchTerm}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      searchTerm: e.target.value,
                    })
                  }
                  className="h-8"
                />
              </div>
            </div>

            {/* 主要内容区域，使用flex布局实现左右分栏 */}
            <div className="flex gap-1 overflow-hidden">
              {/* 左侧设备列表 */}
              <div className="w-32 flex-shrink-0">
                <TabsList className="flex flex-col h-full w-full gap-1">
                  {devices.map((device) => (
                    <TabsTrigger
                      key={device.name}
                      value={device.name}
                      className="w-full text-left px-2 py-1"
                    >
                      <div className="truncate">{device.name}</div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* 右侧属性面板 */}
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue={devices[0]?.name} className="h-full">
                  {devices.map((device) => (
                    <TabsContent
                      key={device.name}
                      value={device.name}
                      className="h-full overflow-auto m-0 p-1"
                    >
                      <div className="flex flex-col gap-1">
                        {/* 设备控制栏 */}
                        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-1 rounded">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{device.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-sm font-semibold dark:text-gray-300">
                              {device.name}
                            </h2>
                          </div>
                          <div className="flex gap-1">
                            {renderDeviceStateButton(device)}
                            {/* ...其他按钮... */}
                          </div>
                        </div>

                        {/* 属性组列表 */}
                        <Accordion type="multiple" className="w-full space-y-1">
                          {device.groups.map((group) => renderGroup(device.name, group))}
                        </Accordion>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>

            {/* 底部日志区域，高度固定 */}
            <div className="h-24">
              <div className="flex items-center justify-between p-1 bg-gray-800">
                <h2 className="text-sm font-semibold text-white">日志</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogs([])}
                  className="h-6 text-xs"
                >
                  清除
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-24px)] bg-gray-900 text-white text-xs">
                {logs.map((log, index) => (
                  <div key={index} className="px-1 py-0.5 font-mono">
                    {log}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
