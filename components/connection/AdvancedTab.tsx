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
import { useIsMobile } from "@/hooks/use-mobile";
import { VerticalTabs } from "@/components/custom/VerticalTabs";
import { Settings } from "lucide-react";

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

export function AdvancedTab() {
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
  const isMobile = useIsMobile(768);

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
      className="mx-auto"
    >
      {isMobile ? (
        <VerticalTabs
          tabWidth="1/4"
          contentWidth="3/4"
          tabStyle="outline"
          tabs={[
            {
              value: "general",
              label: "常规",
              icon: Settings,
              content: (
                <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="updateInterval">更新间隔(ms)</Label>
                      <Input
                        id="updateInterval"
                        type="number"
                        value={settings.updateInterval}
                        onChange={(e) =>
                          handleChange(
                            "updateInterval",
                            parseInt(e.target.value)
                          )
                        }
                        className="bg-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeout">超时(s)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={settings.connectionTimeout}
                        onChange={(e) =>
                          handleChange(
                            "connectionTimeout",
                            parseInt(e.target.value)
                          )
                        }
                        className="bg-gray-700"
                      />
                    </div>
                  </CardContent>
                </Card>
              ),
            },
            {
              value: "switches",
              label: "开关",
              content: (
                <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                  <CardContent className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="notifications">通知</Label>
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
                        onCheckedChange={(checked) =>
                          handleChange("autoSave", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ),
            },
            {
              value: "language",
              label: "语言",
              content: (
                <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label>语言</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) =>
                          handleChange("language", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-700 w-48">
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
                      <Label htmlFor="theme">主题</Label>
                      <Badge variant="outline">{settings.theme}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ),
            },
            {
              value: "performance",
              label: "性能",
              content: (
                <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxConnections">最大连接</Label>
                      <Input
                        id="maxConnections"
                        type="number"
                        value={settings.maxConnections}
                        onChange={(e) =>
                          handleChange(
                            "maxConnections",
                            parseInt(e.target.value)
                          )
                        }
                        className="bg-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bufferSize">缓冲(KB)</Label>
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
              ),
            },
            {
              value: "backup",
              label: "备份",
              content: (
                <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                  <CardContent className="space-y-4">
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
                      <Label htmlFor="backupInterval">间隔(时)</Label>
                      <Input
                        id="backupInterval"
                        type="number"
                        value={settings.backupInterval}
                        onChange={(e) =>
                          handleChange(
                            "backupInterval",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-24 bg-gray-700"
                      />
                    </div>
                  </CardContent>
                </Card>
              ),
            },
            {
              value: "logs",
              label: "日志",
              content: (
                <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="logLevel">日志等级</Label>
                      <Select
                        value={settings.logLevel}
                        onValueChange={(value) =>
                          handleChange("logLevel", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-700 w-48">
                          <SelectValue placeholder="选择日志等级" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { label: "错误", value: "error" },
                            { label: "警告", value: "warn" },
                            { label: "信息", value: "info" },
                            { label: "调试", value: "debug" },
                          ].map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="logPath">日志路径</Label>
                        <Input
                          id="logPath"
                          value={settings.logPath}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 基本路径格式验证
                            if (
                              !/^(([A-Za-z]:\\)|(\.\/))([^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/.test(
                                value
                              )
                            ) {
                              setError("logPath", "请输入有效的路径");
                              return;
                            }
                            // 路径长度验证
                            if (value.length > 260) {
                              setError(
                                "logPath",
                                "路径长度不能超过 260 个字符"
                              );
                              return;
                            }
                            handleChange("logPath", value);
                          }}
                          placeholder="C:\logs 或 ./logs"
                          className="bg-gray-700 w-60"
                        />
                      </div>
                      {errors.logPath && (
                        <span className="text-red-400 text-sm">
                          {errors.logPath}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="logCompression">日志压缩</Label>
                      <Switch
                        id="logCompression"
                        checked={settings.logCompression}
                        onCheckedChange={(checked) =>
                          handleChange("logCompression", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ),
            },
          ]}
        />
      ) : (
        // 其他界面（默认界面）
        <>
          {/* 常规设置 */}
          <motion.div
            variants={item}
            className="transition-all duration-200 hover:shadow-xl"
          >
            <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle>常规设置</CardTitle>
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
                      handleChange(
                        "connectionTimeout",
                        parseInt(e.target.value)
                      )
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
            <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
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
                    onCheckedChange={(checked) =>
                      handleChange("autoSave", checked)
                    }
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
            <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
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
            <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
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
            <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
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
            <Card className=" bg-gray-800/90 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle>日志设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logLevel">日志等级</Label>
                  <Select
                    value={settings.logLevel}
                    onValueChange={(value) => handleChange("logLevel", value)}
                  >
                    <SelectTrigger className="bg-gray-700 w-48">
                      <SelectValue placeholder="选择日志等级" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { label: "错误", value: "error" },
                        { label: "警告", value: "warn" },
                        { label: "信息", value: "info" },
                        { label: "调试", value: "debug" },
                      ].map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="logPath">日志路径</Label>
                    <Input
                      id="logPath"
                      value={settings.logPath}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 基本路径格式验证
                        if (
                          !/^(([A-Za-z]:\\)|(\.\/))([^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/.test(
                            value
                          )
                        ) {
                          setError("logPath", "请输入有效的路径");
                          return;
                        }
                        // 路径长度验证
                        if (value.length > 260) {
                          setError("logPath", "路径长度不能超过 260 个字符");
                          return;
                        }
                        handleChange("logPath", value);
                      }}
                      placeholder="C:\logs 或 ./logs"
                      className="bg-gray-700 w-60"
                    />
                  </div>
                  {errors.logPath && (
                    <span className="text-red-400 text-sm">
                      {errors.logPath}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="logCompression">日志压缩</Label>
                  <Switch
                    id="logCompression"
                    checked={settings.logCompression}
                    onCheckedChange={(checked) =>
                      handleChange("logCompression", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="logRotation">日志滚动</Label>
                  <Switch
                    id="logRotation"
                    checked={settings.logRotation}
                    onCheckedChange={(checked) =>
                      handleChange("logRotation", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
