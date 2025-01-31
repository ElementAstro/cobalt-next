"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  HostapdConfig,
  hostapdConfigSchema,
  CHANNEL_OPTIONS,
} from "@/types/extra/hostapd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Save,
  AlertCircle,
  WifiOff,
  Settings,
  Info,
  Shield,
  Radio,
  Signal,
  Lock,
  EyeOff,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDnsmasqStore } from "@/store/useExtraStore";
import { useHostapdStore } from "@/store/useExtraStore";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 增强的 Zod 验证
const enhancedHostapdSchema = hostapdConfigSchema.extend({
  ssid: z
    .string()
    .min(1, "SSID 不能为空")
    .max(32, "SSID 不能超过32个字符")
    .regex(/^[a-zA-Z0-9_\- ]+$/, "SSID 只能包含字母、数字、下划线和连字符"),
  wpa_passphrase: z
    .string()
    .min(8, "密码至少需要8个字符")
    .max(63, "密码不能超过63个字符")
    .regex(/[A-Z]/, "密码必须包含至少一个大写字母")
    .regex(/[a-z]/, "密码必须包含至少一个小写字母")
    .regex(/[0-9]/, "密码必须包含至少一个数字"),
  country_code: z
    .string()
    .length(2, "国家代码必须是2个字符")
    .regex(/^[A-Z]{2}$/, "国家代码必须是2个大写字母"),
});

export function HostapdConfigForm() {
  const dnsmasqStore = useDnsmasqStore();
  const hostapdStore = useHostapdStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive" | "error">(
    "inactive"
  );
  const [availableChannels, setAvailableChannels] = useState<number[]>(
    CHANNEL_OPTIONS["2.4GHz"]
  );
  const [connectionStats, setConnectionStats] = useState({
    connectedDevices: 0,
    networkLoad: 0,
    signalStrength: 0,
  });

  const form = useForm<HostapdConfig>({
    resolver: zodResolver(enhancedHostapdSchema),
    defaultValues: {
      ssid: "",
      wpa_passphrase: "",
      interface: "wlan0",
      driver: "nl80211",
      hw_mode: "g",
      channel: 6,
      wpa: 2,
      wpa_key_mgmt: "WPA-PSK",
      wpa_pairwise: "TKIP",
      rsn_pairwise: "CCMP",
      auth_algs: 1,
      country_code: "US",
      ieee80211n: 1,
      ieee80211ac: 1,
      wmm_enabled: 1,
      macaddr_acl: 0,
      ignore_broadcast_ssid: 0,
    },
  });

  const watchHwMode = form.watch("hw_mode");

  // 性能优化：使用 debounce 处理频道更新
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchHwMode === "a") {
        setAvailableChannels(CHANNEL_OPTIONS["5GHz"]);
        form.setValue("channel", 36);
      } else {
        setAvailableChannels(CHANNEL_OPTIONS["2.4GHz"]);
        form.setValue("channel", 6);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [watchHwMode, form]);

  // 实时状态监控
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // 模拟获取连接状态
        const stats = await fetchConnectionStats();
        setConnectionStats(stats);
      } catch (error) {
        console.error("Failed to fetch connection stats:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAP = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === "active" ? "inactive" : "active";
      setStatus(newStatus);

      toast({
        title: `WiFi 接入点 ${newStatus === "active" ? "已启动" : "已停止"}`,
        description: `接入点已成功${newStatus === "active" ? "激活" : "停用"}`,
      });

      hostapdStore.setConfig(form.getValues());
    } catch (error) {
      setStatus("error");
      toast({
        title: "错误",
        description: "切换接入点状态失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithDnsmasq = () => {
    if (status === "active" && dnsmasqStore.config) {
      dnsmasqStore.updateConfig({
        ...dnsmasqStore.config,
        listenAddress: form.getValues("interface"),
      });
    }
  };

  async function onSubmit(values: HostapdConfig) {
    setIsLoading(true);
    try {
      await hostapdStore.setConfig(values);

      toast({
        title: "配置已保存",
        description: "Hostapd 配置已成功更新",
      });

      syncWithDnsmasq();
    } catch (error) {
      toast({
        title: "错误",
        description: "保存 Hostapd 配置失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 模拟获取连接状态
  const fetchConnectionStats = async () => {
    return new Promise<{
      connectedDevices: number;
      networkLoad: number;
      signalStrength: number;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          connectedDevices: Math.floor(Math.random() * 10),
          networkLoad: Math.floor(Math.random() * 100),
          signalStrength: Math.floor(Math.random() * 100),
        });
      }, 500);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-2 max-w-[100vw] h-[calc(100vh-4rem)]">
      <motion.div 
        className="lg:col-span-8 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-6 h-6" />
              Hostapd 配置
            </CardTitle>
            <CardDescription>配置您的 WiFi 接入点设置</CardDescription>
            <div className="flex items-center justify-between">
              <Button
                variant={status === "active" ? "destructive" : "default"}
                onClick={handleToggleAP}
                disabled={isLoading}
              >
                {status === "active" ? (
                  <WifiOff className="mr-2" />
                ) : (
                  <Wifi className="mr-2" />
                )}
                {status === "active" ? "停止接入点" : "启动接入点"}
              </Button>
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={isAdvancedMode}
                  onCheckedChange={setIsAdvancedMode}
                />
                <Label htmlFor="advanced-mode">高级模式</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <Tabs defaultValue="basic" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">
                  <Settings className="w-4 h-4 mr-2" />
                  基本设置
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="w-4 h-4 mr-2" />
                  安全设置
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="ssid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Radio className="w-4 h-4" />
                              网络名称 (SSID)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="MyWiFi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              国家代码
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="US" maxLength={2} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {isAdvancedMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <FormField
                            control={form.control}
                            name="hw_mode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Signal className="w-4 h-4" />
                                  频段
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="选择频段" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="a">
                                      5 GHz (802.11a/n/ac)
                                    </SelectItem>
                                    <SelectItem value="g">
                                      2.4 GHz (802.11b/g/n)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="channel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Radio className="w-4 h-4" />
                                  信道
                                </FormLabel>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="选择信道" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableChannels.map((channel) => (
                                      <SelectItem
                                        key={channel}
                                        value={channel.toString()}
                                      >
                                        信道 {channel}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.form>
                </Form>
              </TabsContent>

              <TabsContent value="security">
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <motion.div
                      className="grid grid-cols-1 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <FormField
                        control={form.control}
                        name="wpa_passphrase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              安全密码
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isAdvancedMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <FormField
                              control={form.control}
                              name="ignore_broadcast_ssid"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base flex items-center gap-2">
                                      <EyeOff className="w-4 h-4" />
                                      隐藏网络
                                    </FormLabel>
                                    <FormDescription>不广播 SSID</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value === 1}
                                      onCheckedChange={(checked) =>
                                        field.onChange(checked ? 1 : 0)
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="wmm_enabled"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base flex items-center gap-2">
                                      <Signal className="w-4 h-4" />
                                      WMM (QoS)
                                    </FormLabel>
                                    <FormDescription>
                                      启用 WiFi 多媒体
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value === 1}
                                      onCheckedChange={(checked) =>
                                        field.onChange(checked ? 1 : 0)
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.form>
                </Form>
              </TabsContent>
            </Tabs>

            {status === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>接入点配置出现问题</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        className="lg:col-span-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>网络统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                className="grid grid-cols-2 gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div>
                  <p className="text-sm font-medium">已连接设备</p>
                  <p className="text-2xl font-bold">
                    {connectionStats.connectedDevices}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">网络负载</p>
                  <p className="text-2xl font-bold">
                    {connectionStats.networkLoad}%
                  </p>
                </div>
              </motion.div>
              <Progress value={connectionStats.networkLoad} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
