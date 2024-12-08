// Hotspot.tsx
"use client";

import { useEffect } from "react";
import { useNetworkStore } from "@/lib/store/settings";
import { mockNetworkData } from "@/utils/mock-hotspot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Edit2, Save, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Hotspot() {
  const {
    settings,
    isEditing,
    error,
    successMessage,
    setSettings,
    toggleHotspot,
    togglePowerSaving,
    setEditing,
    resetSettings,
    setError,
    setSuccessMessage,
    validateSettings,
  } = useNetworkStore();

  const { toast } = useToast();

  useEffect(() => {
    if (settings.isMockMode) {
      const loadMockData = async () => {
        const mockData = await mockNetworkData();
        setSettings(mockData);
      };
      loadMockData();
    }
  }, [settings.isMockMode, setSettings]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, setSuccessMessage]);

  const handleSave = () => {
    if (validateSettings()) {
      setEditing(false);
      setSuccessMessage("设置已保存");
      toast({
        title: "成功",
        description: "存储设置已更新。",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 space-y-4 dark:bg-gray-900 min-h-screen">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {successMessage && (
        <Alert
          variant="default"
          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
        >
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>成功</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="mobile-hotspot" className="w-full">
        <TabsList className="flex flex-wrap md:grid md:grid-cols-4">
          <TabsTrigger value="mobile-hotspot">移动热点</TabsTrigger>
          <TabsTrigger value="network-properties">网络属性</TabsTrigger>
          <TabsTrigger value="power-saving">节能</TabsTrigger>
          <TabsTrigger value="internet-sharing">互联网共享</TabsTrigger>
        </TabsList>

        <TabsContent value="mobile-hotspot">
          <Card className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                启用移动热点
              </span>
              <Switch
                checked={settings.hotspotEnabled}
                onCheckedChange={toggleHotspot}
              />
            </motion.div>
          </Card>
        </TabsContent>

        <TabsContent value="network-properties">
          <Card className="p-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  网络属性
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(!isEditing)}
                >
                  {isEditing ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>

              {isEditing ? (
                <motion.form
                  variants={itemVariants}
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="ssid" className="text-gray-600 dark:text-gray-400">
                      网络名称
                    </Label>
                    <Input
                      id="ssid"
                      value={settings.ssid}
                      onChange={(e) => setSettings({ ssid: e.target.value })}
                      className="dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-600 dark:text-gray-400">
                      网络密码
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={settings.password}
                      onChange={(e) =>
                        setSettings({ password: e.target.value })
                      }
                      className="dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="text-gray-600 dark:text-gray-400">
                      频段
                    </Label>
                    <Select
                      value={settings.frequency}
                      onValueChange={(value) =>
                        setSettings({ frequency: value as "2.4 GHz" | "5 GHz" })
                      }
                    >
                      <SelectTrigger className="dark:bg-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2.4 GHz">2.4 GHz</SelectItem>
                        <SelectItem value="5 GHz">5 GHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="channel" className="text-gray-600 dark:text-gray-400">
                      信道
                    </Label>
                    <Select
                      value={settings.channel.toString()}
                      onValueChange={(value) =>
                        setSettings({ channel: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="dark:bg-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((channel) => (
                          <SelectItem key={channel} value={channel.toString()}>
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security" className="text-gray-600 dark:text-gray-400">
                      安全性
                    </Label>
                    <Select
                      value={settings.security}
                      onValueChange={(value) =>
                        setSettings({
                          security: value as "WPA2" | "WPA3" | "Open",
                        })
                      }
                    >
                      <SelectTrigger className="dark:bg-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WPA2">WPA2</SelectItem>
                        <SelectItem value="WPA3">WPA3</SelectItem>
                        <SelectItem value="Open">开放</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxClients" className="text-gray-600 dark:text-gray-400">
                      最大客户端数
                    </Label>
                    <Slider
                      id="maxClients"
                      min={1}
                      max={10}
                      step={1}
                      value={[settings.maxClients]}
                      onValueChange={(value) =>
                        setSettings({ maxClients: value[0] })
                      }
                      className="dark:bg-gray-700"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
                      {settings.maxClients}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autoShutdownTime" className="text-gray-600 dark:text-gray-400">
                      自动关闭时间（分钟）
                    </Label>
                    <Slider
                      id="autoShutdownTime"
                      min={0}
                      max={60}
                      step={5}
                      value={[settings.autoShutdownTime]}
                      onValueChange={(value) =>
                        setSettings({ autoShutdownTime: value[0] })
                      }
                      className="dark:bg-gray-700"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
                      {settings.autoShutdownTime === 0
                        ? "从不"
                        : `${settings.autoShutdownTime} 分钟`}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetSettings();
                        setEditing(false);
                      }}
                      className="dark:border-gray-600"
                    >
                      取消
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600 dark:text-gray-400">名称:</span>
                    <span className="text-gray-700 dark:text-gray-300">{settings.ssid}</span>
                    <span className="text-gray-600 dark:text-gray-400">密码:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {"•".repeat(settings.password.length)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">频段:</span>
                    <span className="text-gray-700 dark:text-gray-300">{settings.frequency}</span>
                    <span className="text-gray-600 dark:text-gray-400">信道:</span>
                    <span className="text-gray-700 dark:text-gray-300">{settings.channel}</span>
                    <span className="text-gray-600 dark:text-gray-400">安全性:</span>
                    <span className="text-gray-700 dark:text-gray-300">{settings.security}</span>
                    <span className="text-gray-600 dark:text-gray-400">最大客户端数:</span>
                    <span className="text-gray-700 dark:text-gray-300">{settings.maxClients}</span>
                    <span className="text-gray-600 dark:text-gray-400">自动关闭时间:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {settings.autoShutdownTime === 0
                        ? "从不"
                        : `${settings.autoShutdownTime} 分钟`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        已连接的设备:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {settings.connectedDevices} 台(共 {settings.maxDevices} 台)
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </Card>
        </TabsContent>

        <TabsContent value="power-saving">
          <Card className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  未连接任何设备时，移动热点将自动关闭。
                </p>
              </div>
              <Switch
                checked={settings.powerSaving}
                onCheckedChange={togglePowerSaving}
              />
            </motion.div>
          </Card>
        </TabsContent>

        <TabsContent value="internet-sharing">
          <Card className="p-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="internetSharing" className="text-gray-600 dark:text-gray-400">
                  共享我的以下 Internet 连接
                </Label>
                <Select
                  value={settings.internetSharing}
                  onValueChange={(value) =>
                    setSettings({ internetSharing: value as "Wi-Fi" | "以太网" | "移动数据" })
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="以太网">以太网</SelectItem>
                    <SelectItem value="Wi-Fi">Wi-Fi</SelectItem>
                    <SelectItem value="移动数据">移动数据</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="shareTo" className="text-gray-600 dark:text-gray-400">
                  分享到
                </Label>
                <Select
                  value={settings.shareTo}
                  onValueChange={(value) => setSettings({ shareTo: value as "WLAN" | "蓝牙" })}
                >
                  <SelectTrigger className="dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WLAN">WLAN</SelectItem>
                    <SelectItem value="蓝牙">蓝牙</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
            模拟模式
          </h2>
          <Switch
            checked={settings.isMockMode}
            onCheckedChange={(checked) => setSettings({ isMockMode: checked })}
          />
        </motion.div>
      </Card>
    </div>
  );
}