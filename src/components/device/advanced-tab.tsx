"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useApiService } from "@/services/device-connection";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  AlertCircle,
  Clock,
  RefreshCw,
  HardDrive,
  Activity,
} from "lucide-react";

// Zod schema for advanced settings validation
const AdvancedSettingsSchema = z.object({
  updateInterval: z.number().min(100).max(10000),
  connectionTimeout: z.number().min(1).max(300),
  debugMode: z.boolean(),
  logLevel: z.enum(["error", "warn", "info", "debug"]),
  maxRetries: z.number().min(0).max(10),
  connectionBuffer: z.number().min(128).max(8192),
  keepAliveInterval: z.number().min(5).max(300),
});

export function AdvancedTab() {
  const { toast } = useToast();
  const { fetchAdvancedSettings, updateAdvancedSettings } = useApiService();
  const [settings, setSettings] = useState({
    updateInterval: 1000,
    connectionTimeout: 30,
    debugMode: false,
    logLevel: "info",
    maxRetries: 3,
    connectionBuffer: 1024,
    keepAliveInterval: 30,
  });

  const [logs, setLogs] = useState<
    Array<{
      timestamp: string;
      level: string;
      message: string;
    }>
  >([]);

  useEffect(() => {
    fetchAdvancedSettings()
      .then((data) => {
        const parsed = AdvancedSettingsSchema.safeParse(data);
        if (parsed.success) {
          setSettings(parsed.data);
        } else {
          toast({
            title: "配置错误",
            description: "从服务器获取的配置数据格式不正确",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "获取配置失败",
          description: (error as Error).message,
          variant: "destructive",
        });
      });
  }, [fetchAdvancedSettings, toast]);

  const handleChange = async (
    field: string,
    value: number | boolean | string
  ) => {
    const newSettings = { ...settings, [field]: value };
    const validation = AdvancedSettingsSchema.safeParse(newSettings);

    if (!validation.success) {
      toast({
        title: "验证失败",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAdvancedSettings({ [field]: value });
      setSettings(newSettings);
      toast({
        title: "更新成功",
        description: `${field} 已更新`,
      });
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-gray-900 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Connection Settings Card */}
        <Card className="bg-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <CardTitle>连接设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="updateInterval"
                className="text-gray-300 flex items-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>更新间隔 (毫秒)</span>
              </Label>
              <Input
                id="updateInterval"
                type="number"
                value={settings.updateInterval}
                onChange={(e) =>
                  handleChange("updateInterval", parseInt(e.target.value))
                }
                className="mt-1 bg-gray-700 text-white"
              />
            </div>

            <div>
              <Label
                htmlFor="timeout"
                className="text-gray-300 flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span>连接超时 (秒)</span>
              </Label>
              <Input
                id="timeout"
                type="number"
                value={settings.connectionTimeout}
                onChange={(e) =>
                  handleChange("connectionTimeout", parseInt(e.target.value))
                }
                className="mt-1 bg-gray-700 text-white"
              />
            </div>

            <div>
              <Label
                htmlFor="maxRetries"
                className="text-gray-300 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>最大重试次数</span>
              </Label>
              <Input
                id="maxRetries"
                type="number"
                value={settings.maxRetries}
                onChange={(e) =>
                  handleChange("maxRetries", parseInt(e.target.value))
                }
                className="mt-1 bg-gray-700 text-white"
              />
            </div>

            <div>
              <Label
                htmlFor="connectionBuffer"
                className="text-gray-300 flex items-center space-x-2"
              >
                <HardDrive className="w-4 h-4" />
                <span>连接缓冲区 (字节)</span>
              </Label>
              <Input
                id="connectionBuffer"
                type="number"
                value={settings.connectionBuffer}
                onChange={(e) =>
                  handleChange("connectionBuffer", parseInt(e.target.value))
                }
                className="mt-1 bg-gray-700 text-white"
              />
            </div>

            <div>
              <Label
                htmlFor="keepAliveInterval"
                className="text-gray-300 flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>保持活动间隔 (秒)</span>
              </Label>
              <Input
                id="keepAliveInterval"
                type="number"
                value={settings.keepAliveInterval}
                onChange={(e) =>
                  handleChange("keepAliveInterval", parseInt(e.target.value))
                }
                className="mt-1 bg-gray-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Debug Settings Card */}
        <Card className="bg-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <CardTitle>调试设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-4">
              <Switch
                id="debugMode"
                checked={settings.debugMode}
                onCheckedChange={(checked) =>
                  handleChange("debugMode", checked)
                }
                className="bg-gray-600"
              />
              <Label htmlFor="debugMode" className="ml-2 text-gray-300">
                启用调试模式
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Card */}
      <Card className="bg-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <CardTitle>日志</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 mt-4 bg-gray-700 rounded-md p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-400">时间戳</TableHead>
                  <TableHead className="text-gray-400">级别</TableHead>
                  <TableHead className="text-gray-400">消息</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-600">
                    <TableCell className="text-gray-200">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="text-gray-200">{log.level}</TableCell>
                    <TableCell className="text-gray-200">
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
