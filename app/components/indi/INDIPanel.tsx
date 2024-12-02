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
import { LineChart } from "./LineChart";
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

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
          <h2 className="text-xl font-semibold">{device.name}</h2>
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
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
      <Card className="max-w-[1200px] mx-auto">
        <CardContent className="p-2">
          {showAdvancedFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <AdvancedFilter
                options={filterOptions}
                onChange={setFilterOptions}
                groups={allGroups}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <Input
              placeholder="搜索属性..."
              value={filterOptions.searchTerm}
              onChange={(e) =>
                setFilterOptions({
                  ...filterOptions,
                  searchTerm: e.target.value,
                })
              }
            />
          </motion.div>

          <Tabs defaultValue={devices[0]?.name} className="space-y-4">
            <ScrollArea className="w-full overscroll-x-auto">
              <TabsList className="w-full justify-start">
                {devices.map((device) => (
                  <TabsTrigger key={device.name} value={device.name}>
                    {device.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {devices.map(renderDevice)}
          </Tabs>

          {/* 日志部分 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 border rounded-lg"
          >
            <div className="flex items-center justify-between p-2 bg-gray-800">
              <h2 className="text-lg font-semibold text-white">日志</h2>
              <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                清除日志
              </Button>
            </div>
            <ScrollArea className="h-48 p-4 bg-gray-900 text-white">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
