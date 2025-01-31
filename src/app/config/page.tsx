"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  Undo2,
  Redo2,
  Download,
  Sun,
  Moon,
  Activity,
} from "lucide-react";
import { useSettingsStore } from "@/store/useConfigStore";
import { getSettingByPath } from "@/utils/config-utils";
import { SettingGroup } from "@/components/config/setting-group";
import { motion } from "framer-motion";
import { Setting, SettingValue, HistoryItem } from "@/types/config";
import { toast } from "@/hooks/use-toast";
import WebSocketConfig from "@/components/config/websocket-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const MOCK_SETTINGS = {
  settings: [
    {
      id: "camera",
      label: "相机设置",
      icon: "Camera",
      settings: [
        {
          id: "exposure",
          label: "曝光时间",
          type: "range",
          value: 1000,
          min: 100,
          max: 5000,
          step: 100,
        },
        {
          id: "iso",
          label: "感光度",
          type: "select",
          value: "800",
          options: ["100", "200", "400", "800", "1600", "3200"],
        },
      ],
    },
    {
      id: "system",
      label: "系统设置",
      icon: "Settings",
      settings: [
        {
          id: "darkMode",
          label: "暗色模式",
          type: "checkbox",
          value: true,
        },
        {
          id: "autoSave",
          label: "自动保存",
          type: "checkbox",
          value: true,
        },
      ],
    },
  ],
};

interface WebSocketStatusProps {
  latency?: number;
  isConnected?: boolean;
}

const SettingsInterface: React.FC = () => {
  const {
    settings,
    resetSettings,
    exportSettings,
    isLoading,
    error,
    fetchSettings,
    updateSetting,
  } = useSettingsStore();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [selectedCategory] = useState<string | null>(null);
  const [viewMode] = useState<"basic" | "advanced">("basic");

  // Optimized: Cache filtered settings
  const filteredSettings = useMemo(() => {
    return settings.filter((group) => {
      if (selectedCategory && group.id !== selectedCategory) return false;
      if (viewMode === "basic" && group.isAdvanced) return false;

      return (
        group.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.settings.some((setting: Setting) =>
          setting.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }, [settings, searchQuery, selectedCategory, viewMode]);

  // Optimized: Cache event handlers
  const handleSettingChange = useCallback(
    async (path: string[], value: SettingValue) => {
      try {
        await updateSetting(path, value);
        toast({
          title: "设置已更新",
          description: "更改已成功保存",
        });
      } catch (err) {
        const error = err as Error;
        toast({
          title: "更新失败",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [updateSetting]
  );

  const handleSave = useCallback(async () => {
    try {
      await exportSettings();
      toast({ title: "成功", description: "设置已成功导出为JSON文件" });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "错误",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [exportSettings]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const historyItem = history[historyIndex - 1];
      if (historyItem.revertible) {
        updateSetting(historyItem.path, historyItem.oldValue as SettingValue)
          .then(() => {
            setHistoryIndex((prev) => prev - 1);
            toast({
              title: "撤销成功",
              description: "已恢复到之前的设置",
            });
          })
          .catch((error) => {
            toast({
              title: "撤销失败",
              description: error.message,
              variant: "destructive",
            });
          });
      }
    }
  }, [historyIndex, history, updateSetting]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const historyItem = history[historyIndex + 1];
      if (historyItem.revertible) {
        updateSetting(historyItem.path, historyItem.newValue)
          .then(() => {
            setHistoryIndex((prev) => prev + 1);
            toast({
              title: "重做成功",
              description: "已应用更改",
            });
          })
          .catch((error) => {
            toast({
              title: "重做失败",
              description: error.message,
              variant: "destructive",
            });
          });
      }
    }
  }, [historyIndex, history, updateSetting]);

  // 添加历史记录
  const addHistoryItem = useCallback((item: Omit<HistoryItem, "id">) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      revertible: true,
      status: "success",
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, newItem]);
    setHistoryIndex((prev) => prev + 1);
  }, []);

  // 监听设置更改以添加历史记录
  useEffect(() => {
    const unsubscribe = useSettingsStore.subscribe((state, prevState) => {
      if (state.settings !== prevState.settings) {
        // Find changed settings
        const changes = findChangedSettings(prevState.settings, state.settings);
        changes.forEach((change) => {
          addHistoryItem({
            path: change.path,
            oldValue: change.oldValue,
            newValue: change.newValue,
            changeType: "update",
            device: navigator.userAgent,
            timestamp: Date.now(),
            status: "success",
            revertible: true,
          });
        });
      }
    });

    return () => unsubscribe();
  }, [addHistoryItem]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
      setTimeout(() => {
        useSettingsStore.setState({ settings: MOCK_SETTINGS.settings });
      }, 1000);
    } else {
      fetchSettings();
    }
  }, [fetchSettings]);

  if (isLoading && settings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <WebSocketConfig />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索设置..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={toggleDarkMode}
                    className="justify-start"
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    {darkMode ? "亮色模式" : "暗色模式"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="justify-start"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    保存更改
                  </Button>
                </div>
              </CardContent>
            </Card>

            <WebSocketStatus isConnected={true} latency={45} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>设置</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div layout className="space-y-2">
                  <Accordion
                    type="multiple"
                    className="w-full"
                    defaultValue={["camera"]}
                  >
                    {filteredSettings.map((group) => (
                      <SettingGroup key={group.id} group={group} path={[]} />
                    ))}
                  </Accordion>
                </motion.div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={exportSettings}
                disabled={isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
              <Button variant="destructive" onClick={resetSettings}>
                恢复默认
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// WebSocket status component
const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  latency = 45,
  isConnected = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>连接状态</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            />
            <span className="text-sm">{isConnected ? "已连接" : "未连接"}</span>
          </div>
          <div className="text-xs text-muted-foreground">延迟: {latency}ms</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to find changed settings
const findChangedSettings = (prevSettings: any[], newSettings: any[]) => {
  const changes: Array<{ path: string[]; oldValue: any; newValue: any }> = [];

  const traverse = (prev: any, curr: any, path: string[] = []) => {
    if (!prev || !curr) return;

    if (Array.isArray(prev)) {
      prev.forEach((item, index) => {
        traverse(item, curr[index], [...path, index.toString()]);
      });
    } else if (typeof prev === "object") {
      Object.keys(prev).forEach((key) => {
        traverse(prev[key], curr[key], [...path, key]);
      });
    } else if (prev !== curr) {
      changes.push({
        path,
        oldValue: prev,
        newValue: curr,
      });
    }
  };

  traverse(prevSettings, newSettings);
  return changes;
};

export default SettingsInterface;
