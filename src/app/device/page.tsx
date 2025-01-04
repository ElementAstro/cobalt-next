"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProfileTab } from "@/components/device/profile-tab";
import { DevicesTab } from "@/components/device/devices-tab";
import { AdvancedTab } from "@/components/device/advanced-tab";
import { useDeviceSelectorStore as useDeviceStore } from "@/store/useDeviceStore";

export default function DeviceConnection() {
  const { toast } = useToast();
  const {
    isConnected,
    connect,
    disconnect,
    startScanning,
    stopScanning,
    devices,
  } = useDeviceStore();

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, [startScanning, stopScanning]);

  const handleConnect = async () => {
    toast({
      title: "正在连接设备...",
      description: "请稍候，我们正在建立连接。",
    });
    try {
      await connect();
      toast({
        title: "连接成功！",
        description: "所有设备现在已在线并准备就绪。",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "连接失败",
        description: "连接设备时发生错误。",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "已断开连接",
        description: "所有设备已断开连接。",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "断开连接失败",
        description: "断开设备时发生错误。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden dark">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full bg-gray-900">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">配置文件</TabsTrigger>
          <TabsTrigger value="devices">设备</TabsTrigger>
          <TabsTrigger value="advanced">
            高级
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileTab toast={toast} />
        </TabsContent>
        <TabsContent value="devices" className="mt-6">
          <DevicesTab />
        </TabsContent>
        <TabsContent value="advanced" className="mt-6">
          <AdvancedTab />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t p-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isConnected ? "已连接" : "未连接"}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                title: "设置已保存",
                description: "您的设备连接设置已更新。",
              })
            }
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("profile")}
          >
            <X className="w-4 h-4 mr-2" />
            关闭
          </Button>
          {isConnected ? (
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              断开连接
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleConnect}>
              <RefreshCw className="w-4 h-4 mr-2" />
              连接
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
