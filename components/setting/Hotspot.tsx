"use client";

import { useEffect } from "react";
import { useNetworkStore } from "@/lib/store/hotspot";
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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Edit2, Save, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NetworkSettings() {
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
    }
  };

  return (
    <div className="p-4 space-y-4">
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mobile-hotspot">移动热点</TabsTrigger>
          <TabsTrigger value="network-properties">网络属性</TabsTrigger>
          <TabsTrigger value="power-saving">节能</TabsTrigger>
          <TabsTrigger value="internet-sharing">互联网共享</TabsTrigger>
        </TabsList>

        <TabsContent value="mobile-hotspot">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span>启用移动热点</span>
              <Switch
                checked={settings.hotspotEnabled}
                onCheckedChange={toggleHotspot}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="network-properties">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">网络属性</h3>
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
              </div>

              {isEditing ? (
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="ssid">网络名称</Label>
                    <Input
                      id="ssid"
                      value={settings.ssid}
                      onChange={(e) => setSettings({ ssid: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">网络密码</Label>
                    <Input
                      id="password"
                      type="password"
                      value={settings.password}
                      onChange={(e) =>
                        setSettings({ password: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">频段</Label>
                    <Select
                      value={settings.frequency}
                      onValueChange={(value) =>
                        setSettings({ frequency: value as "2.4 GHz" | "5 GHz" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2.4 GHz">2.4 GHz</SelectItem>
                        <SelectItem value="5 GHz">5 GHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="channel">信道</Label>
                    <Select
                      value={settings.channel.toString()}
                      onValueChange={(value) =>
                        setSettings({ channel: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="security">安全性</Label>
                    <Select
                      value={settings.security}
                      onValueChange={(value) =>
                        setSettings({
                          security: value as "WPA2" | "WPA3" | "Open",
                        })
                      }
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="maxClients">最大客户端数</Label>
                    <Slider
                      id="maxClients"
                      min={1}
                      max={10}
                      step={1}
                      value={[settings.maxClients]}
                      onValueChange={(value) =>
                        setSettings({ maxClients: value[0] })
                      }
                    />
                    <div className="text-sm text-muted-foreground text-right">
                      {settings.maxClients}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autoShutdownTime">
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
                    />
                    <div className="text-sm text-muted-foreground text-right">
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
                    >
                      取消
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">名称:</span>
                    <span>{settings.ssid}</span>
                    <span className="text-muted-foreground">密码:</span>
                    <span>{"•".repeat(settings.password.length)}</span>
                    <span className="text-muted-foreground">频段:</span>
                    <span>{settings.frequency}</span>
                    <span className="text-muted-foreground">信道:</span>
                    <span>{settings.channel}</span>
                    <span className="text-muted-foreground">安全性:</span>
                    <span>{settings.security}</span>
                    <span className="text-muted-foreground">最大客户端数:</span>
                    <span>{settings.maxClients}</span>
                    <span className="text-muted-foreground">自动关闭时间:</span>
                    <span>
                      {settings.autoShutdownTime === 0
                        ? "从不"
                        : `${settings.autoShutdownTime} 分钟`}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        已连接的设备:
                      </span>
                      <span>
                        {settings.connectedDevices} 台(共 {settings.maxDevices}{" "}
                        台)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="power-saving">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    未连接任何设备时，移动热点将自动关闭。
                  </p>
                </div>
                <Switch
                  checked={settings.powerSaving}
                  onCheckedChange={togglePowerSaving}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="internet-sharing">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="internetSharing">
                  共享我的以下 Internet 连接
                </Label>
                <Select
                  value={settings.internetSharing}
                  onValueChange={(value) =>
                    setSettings({ internetSharing: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="以太网">以太网</SelectItem>
                    <SelectItem value="Wi-Fi">Wi-Fi</SelectItem>
                    <SelectItem value="移动数据">移动数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shareTo">分享到</Label>
                <Select
                  value={settings.shareTo}
                  onValueChange={(value) => setSettings({ shareTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WLAN">WLAN</SelectItem>
                    <SelectItem value="蓝牙">蓝牙</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">模拟模式</h2>
          <Switch
            checked={settings.isMockMode}
            onCheckedChange={(checked) => setSettings({ isMockMode: checked })}
          />
        </div>
      </Card>
    </div>
  );
}
