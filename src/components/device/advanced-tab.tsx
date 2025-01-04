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

export function AdvancedTab() {
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
    fetchAdvancedSettings().then((data) => {
      setSettings({
        updateInterval: data.updateInterval ?? 1000,
        connectionTimeout: data.connectionTimeout ?? 30,
        debugMode: data.debugMode ?? false,
        logLevel: data.logLevel ?? "info",
        maxRetries: data.maxRetries ?? 3,
        connectionBuffer: data.connectionBuffer ?? 1024,
        keepAliveInterval: data.keepAliveInterval ?? 30,
      });
    });
  }, [fetchAdvancedSettings]);

  const handleChange = (field: string, value: number | boolean | string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    updateAdvancedSettings({ [field]: value }).catch((error) => {
      console.error("Failed to update advanced settings:", error);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-gray-900 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>连接设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4\">
              <Label htmlFor="updateInterval" className="text-gray-300">
                更新间隔 (毫秒)
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
            <div className="mt-4">
              <Label htmlFor="timeout" className="text-gray-300">
                连接超时 (秒)
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
            <div className="mt-4">
              <Label htmlFor="logLevel" className="text-gray-300">
                日志级别
              </Label>
              <Input
                id="logLevel"
                type="text"
                value={settings.logLevel}
                onChange={(e) => handleChange("logLevel", e.target.value)}
                className="mt-1 bg-gray-700 text-white"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="maxRetries" className="text-gray-300">
                最大重试次数
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
            <div className="mt-4">
              <Label htmlFor="connectionBuffer" className="text-gray-300">
                连接缓冲区 (字节)
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
            <div className="mt-4">
              <Label htmlFor="keepAliveInterval" className="text-gray-300">
                保持活动间隔 (秒)
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
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>调试设置</CardTitle>
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
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle>日志</CardTitle>
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
