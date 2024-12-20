import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/lib/store/connection/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// 自定义动画
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

// 模拟的语言列表
const languages = [
  { label: "中文", value: "zh-CN" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "日本語", value: "ja" },
];

export default function AdvancedTab() {
  const {
    settings,
    errors,
    isLoading,
    setSettings,
    setError,
    clearErrors,
    setLoading,
    validateField,
  } = useSettingsStore();
  const [mockData, setMockData] = useState("一些模拟的日志信息...");
  const [autoRefresh, setAutoRefresh] = useState<null | NodeJS.Timeout>(null);

  // 处理通用输入变更
  const handleChange = (field: string, value: any) => {
    // 验证字段
    if (validateField(field, value)) {
      setSettings({ [field]: value });
    }
  };

  // 模拟实时刷新（例如：自动更新某些状态或日志）
  useEffect(() => {
    clearErrors();
    setLoading(false);
    if (!autoRefresh) {
      const timer = setInterval(() => {
        setMockData((prev) => {
          // 简单模拟追加日志
          const d = new Date().toLocaleTimeString();
          return prev + `\n[${d}] 虚拟刷新数据...`;
        });
      }, 3000);
      setAutoRefresh(timer);
    }
    return () => {
      if (autoRefresh) {
        clearInterval(autoRefresh);
      }
    };
  }, [autoRefresh, clearErrors, setLoading]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container max-w-4xl mx-auto p-4 space-y-6"
    >
      <motion.div variants={item} className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-white">高级设置</h1>
        <p className="text-sm text-gray-400">
          以下设置可以帮助您在天文摄影软件中定制系统行为。
        </p>
      </motion.div>

      {/* 常规设置 */}
      <motion.div
        variants={item}
        className="transition-all duration-200 hover:shadow-xl"
      >
        <Card className="p-4 bg-gray-800/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>常规设置</CardTitle>
            <CardDescription>配置更新间隔、超时时间等</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="updateInterval">更新间隔 (ms)</Label>
              <Input
                id="updateInterval"
                type="number"
                value={settings.updateInterval}
                onChange={(e) =>
                  handleChange("updateInterval", parseInt(e.target.value))
                }
                className="bg-gray-700"
              />
              {errors.updateInterval && (
                <span className="text-red-400 text-sm">
                  {errors.updateInterval}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">连接超时 (s)</Label>
              <Input
                id="timeout"
                type="number"
                value={settings.connectionTimeout}
                onChange={(e) =>
                  handleChange("connectionTimeout", parseInt(e.target.value))
                }
                className="bg-gray-700"
              />
              {errors.connectionTimeout && (
                <span className="text-red-400 text-sm">
                  {errors.connectionTimeout}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 开关选项 */}
      <motion.div
        variants={item}
        className="transition-all duration-200 hover:shadow-xl"
      >
        <Card className="p-4 bg-gray-800/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>开关选项</CardTitle>
            <CardDescription>控制调试模式、通知等功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="debugMode">调试模式</Label>
              <Switch
                id="debugMode"
                checked={settings.debugMode}
                onCheckedChange={(checked) =>
                  handleChange("debugMode", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">通知提醒</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  handleChange("notifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoSave">自动保存</Label>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleChange("autoSave", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 语言和主题 */}
      <motion.div
        variants={item}
        className="transition-all duration-200 hover:shadow-xl"
      >
        <Card className="p-4 bg-gray-800/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>语言与主题</CardTitle>
            <CardDescription>国际化、外观模式等</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <Label className="mb-1 md:mb-0">语言</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleChange("language", value)}
              >
                <SelectTrigger className="bg-gray-700 w-full md:w-48">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">主题 (暗色 / 亮色尚未集成)</Label>
              <Badge variant="outline" className="ml-2">
                {settings.theme}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 性能设置 */}
      <motion.div
        variants={item}
        className="transition-all duration-200 hover:shadow-xl"
      >
        <Card className="p-4 bg-gray-800/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>性能配置</CardTitle>
            <CardDescription>最大连接数、缓冲区大小等</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="maxConnections">最大连接数</Label>
              <Input
                id="maxConnections"
                type="number"
                value={settings.maxConnections}
                onChange={(e) =>
                  handleChange("maxConnections", parseInt(e.target.value))
                }
                className="bg-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bufferSize">缓冲区大小 (KB)</Label>
              <Input
                id="bufferSize"
                type="number"
                value={settings.bufferSize}
                onChange={(e) =>
                  handleChange("bufferSize", parseInt(e.target.value))
                }
                className="bg-gray-700"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 备份设置 */}
      <motion.div
        variants={item}
        className="transition-all duration-200 hover:shadow-xl"
      >
        <Card className="p-4 bg-gray-800/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>备份设置</CardTitle>
            <CardDescription>自动备份及间隔</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup">自动备份</Label>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  handleChange("autoBackup", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="backupInterval">备份间隔 (小时)</Label>
              <Input
                id="backupInterval"
                type="number"
                value={settings.backupInterval}
                onChange={(e) =>
                  handleChange("backupInterval", parseInt(e.target.value))
                }
                className="w-32 bg-gray-700"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 模拟数据 & 日志 */}
      <motion.div
        variants={item}
        className="transition-all duration-200 hover:shadow-xl"
      >
        <Card className="p-4 bg-gray-800/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>实时日志</CardTitle>
            <CardDescription>模拟数据刷新演示</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="logs">
                <AccordionTrigger>查看实时日志</AccordionTrigger>
                <AccordionContent>
                  <pre className="text-xs whitespace-pre-wrap text-gray-200">
                    {mockData}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="text-right">
              <Button
                variant="outline"
                onClick={() => setMockData("已重置日志。")}
              >
                重置日志
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
