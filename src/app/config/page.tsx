"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  Undo2,
  Redo2,
  Download,
  Upload,
  Sun,
  Moon,
  Power,
  RefreshCw,
  Activity,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useSettingsStore } from "@/store/useConfigStore";
import { getSettingByPath } from "@/utils/config-utils";
import { SettingGroup } from "@/components/config/setting-group";
import { motion } from "framer-motion";
import { Setting } from "@/types/config";
import { toast } from "@/hooks/use-toast";
import WebSocketConfig from "@/components/config/websocket-config"; // 导入 WebSocketConfig 组件
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsInterface: React.FC = () => {
  const {
    settings,
    resetSettings,
    exportSettings,
    isLoading,
    error,
    fetchSettings,
  } = useSettingsStore();
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const filteredSettings = settings.filter(
    (group) =>
      group.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.settings.some((setting: Setting) =>
        setting.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSave = useCallback(async () => {
    try {
      await exportSettings();
      toast({ title: "成功", description: "设置已成功导出为JSON文件" });
    } catch (error) {
      toast({
        title: "错误",
        description: "导出设置时出错",
        variant: "destructive",
      });
    }
  }, [exportSettings]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      // Apply previous state logic here
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      // Apply next state logic here
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    try {
      fetchSettings();
    } catch (error: unknown) {
      toast({
        title: "错误",
        description: "获取设置时出错",
        variant: "destructive",
      });
    }
  }, [fetchSettings]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colorSetting = getSettingByPath(settings, [
      "appearance",
      "primaryColor",
    ]);
    if (colorSetting && typeof colorSetting.value === "string") {
      root.style.setProperty("--primary", colorSetting.value);
      setPrimaryColor(colorSetting.value);
    }
  }, [settings]);

  if (isLoading && settings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <WebSocketConfig />; // 显示 WebSocket 配置界面
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`mx-auto p-6 ${isMobile ? "w-full" : "max-w-3xl"}`}
    >
      <div className="flex flex-col space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-primary">设置</h1>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索设置..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-accent"
              aria-label="切换暗黑模式"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
        )}

        {/* Settings Content */}
        <motion.div layout className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {filteredSettings.map((group) => (
              <SettingGroup key={group.id} group={group} path={[]} />
            ))}
          </Accordion>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-2 justify-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              aria-label="撤销"
            >
              <Undo2 className="mr-2 h-4 w-4" />
              撤销
            </Button>
            <Button
              variant="outline"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              aria-label="重做"
            >
              <Redo2 className="mr-2 h-4 w-4" />
              重做
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={exportSettings}
              disabled={isLoading}
              aria-label="导出设置"
            >
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Implement import functionality
                toast({
                  title: "功能未实现",
                  description: "导入功能正在开发中。",
                  variant: "destructive",
                });
              }}
              disabled={isLoading}
              aria-label="导入设置"
            >
              <Upload className="mr-2 h-4 w-4" />
              导入
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={resetSettings}
              disabled={isLoading}
              variant="destructive"
              aria-label="恢复默认设置"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  重置中...
                </>
              ) : (
                "恢复默认设置"
              )}
            </Button>
            <Button onClick={handleSave} disabled={isLoading} aria-label="保存更改">
              保存更改
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsInterface;