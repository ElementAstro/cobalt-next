"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  Link2Off,
  Plug,
  Wifi,
  WifiOff,
  Settings,
  Download,
  History,
  Activity,
  BarChart2,
  Bell,
  Clipboard,
  Cloud,
  Cpu,
  Database,
  HardDrive,
  Info,
  Layers,
  Monitor,
  Power,
  Server,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";

import { ConnectionAlert } from "@/components/connection/connection-alert";
import { ConnectionDetails } from "@/components/connection/connection-details";
import { LoginForm } from "@/components/connection/login-form";
import { AdvancedSettings } from "@/components/connection/advanced-settings";
import { NetworkStatus } from "@/components/connection/network-status";
import { useNetworkStatus } from "@/hooks/use-network-connection";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConfigurationManager } from "@/components/connection/configuration-manager";
import ServerPortScanModal from "@/components/connection/server-port-scan";
import ConnectionHistory from "@/components/connection/connection-history";

import { useConnectionStore } from "@/store/useConnectionStore";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import Cookies from "js-cookie";

export default function ConnectionPage({
  onConnect,
}: {
  onConnect: () => void;
}) {
  const {
    formData,
    isConnected,
    isLoading,
    connectionStrength,
    loadFromCookies,
    loadRegistration,
    saveToCookies,
    updateFormData,
    setConnected,
    setLoading,
    setConnectionStrength,
    addConnectionHistory,
    toggleDarkMode,
  } = useConnectionStore();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);
  const [isPortScanModalOpen, setIsPortScanModalOpen] = useState(false);
  const [isConfigManagerOpen, setIsConfigManagerOpen] = useState(false);
  const [showConfigManager, setShowConfigManager] = React.useState(false);

  const togglePortScanModal = () => {
    setIsPortScanModalOpen(!isPortScanModalOpen);
  };

  const toggleHistoryVisibility = () => {
    setShowHistory(!showHistory);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    loadFromCookies();
    loadRegistration();
  }, [loadFromCookies, loadRegistration]);

  useEffect(() => {
    const savedData = Cookies.get("connection_data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        updateFormData(parsedData);
      } catch (e) {
        console.error("Failed to parse connection data from cookie:", e);
        Cookies.remove("connection_data");
      }
    }
  }, [form, updateFormData]);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionStrength(Math.floor(Math.random() * 100) + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected, setConnectionStrength]);

  const isMobile = useIsMobile(768);
  const networkStatus = useNetworkStatus();

  const handleConnect = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (values.ip && values.username && values.password) {
      if (formData.rememberLogin) {
        Cookies.set(
          "connection_data",
          JSON.stringify({
            ip: values.ip,
            port: values.port,
            username: values.username,
            password: values.password,
            isSSL: formData.isSSL,
            rememberLogin: formData.rememberLogin,
          }),
          {
            expires: 30, // 30 days
            secure: true,
            sameSite: "strict",
            path: "/",
          }
        );
      } else {
        Cookies.remove("connection_data", { path: "/" });
      }

      setConnected(true);
      onConnect();
      setAlertType("success");
      setShowAlert(true);
      setConnectionStrength(Math.floor(Math.random() * 100) + 1);
      addConnectionHistory(`${values.ip}:${values.port}`);
      updateFormData({
        ip: values.ip,
        port: values.port,
        username: values.username,
        password: "",
        isSSL: formData.isSSL,
        rememberLogin: formData.rememberLogin,
      });
      saveToCookies();
    } else {
      setAlertType("error");
      setShowAlert(true);
    }
    setLoading(false);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setShowAlert(false);
    setConnectionStrength(0);
  };

  const handleExportConfig = () => {
    const config = {
      ...form.getValues(),
      isSSL: formData.isSSL,
      rememberLogin: formData.rememberLogin,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "connection-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  return (
    <div className="h-screen w-screen bg-background dark overflow-hidden">
      <ConnectionAlert showAlert={showAlert} alertType={alertType} />

      <div className="container mx-auto h-full p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
          {/* Background Effects */}
          <motion.div
            className="fixed inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          </motion.div>

          {/* Connection Panel */}
          <Card className="h-full flex flex-col">
            <CardHeader className="space-y-0 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plug className="w-5 h-5 text-blue-400" />
                  连接控制面板
                </CardTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowSystemInfo(true)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <Info className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>系统信息</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowNotifications(true)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <Bell className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>通知</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isConnected && (
                    <Badge
                      variant={
                        connectionStrength > 50 ? "default" : "secondary"
                      }
                      className="px-3 py-1"
                    >
                      {connectionStrength > 50 ? (
                        <Wifi className="w-5 h-5 mr-2 text-green-400" />
                      ) : (
                        <WifiOff className="w-5 h-5 mr-2 text-red-400" />
                      )}
                      {connectionStrength}%
                    </Badge>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowHistory(!showHistory)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <History className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>连接历史</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <NetworkStatus status={networkStatus} />
            </CardHeader>

            <CardContent className="flex-1 overflow-auto">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleConnect)}
                  className="space-y-4"
                >
                  {/* Form content with tighter spacing */}
                  <div className="grid gap-4">
                    <ConnectionDetails
                      form={form}
                      isSSL={formData.isSSL}
                      setIsSSL={(val) => updateFormData({ isSSL: val })}
                    />
                    <LoginForm
                      form={form}
                      showPassword={showPassword}
                      togglePasswordVisibility={() =>
                        setShowPassword(!showPassword)
                      }
                    />
                  </div>

                  {/* Actions with more compact layout */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="remember"
                          checked={formData.rememberLogin}
                          onCheckedChange={(checked) =>
                            updateFormData({ rememberLogin: checked })
                          }
                        />
                        <Label htmlFor="remember">记住登录</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePortScanModal}
                      >
                        端口扫描
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isConnected || isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Upload className="w-5 h-5 mr-2" />
                        </motion.div>
                      ) : (
                        <Upload className="w-5 h-5 mr-2" />
                      )}
                      {isLoading ? "连接中..." : "连接"}
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Connection status with optimized spacing */}
              {isConnected && (
                <div className="mt-4 space-y-2">
                  <Label className="text-white text-lg">连接强度</Label>
                  <Progress value={connectionStrength} className="h-3" />
                  <Button
                    variant="destructive"
                    className="w-full py-6 text-lg"
                    onClick={handleDisconnect}
                  >
                    <Link2Off className="w-5 h-5 mr-2" />
                    断开连接
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Panel */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3">
                <Settings className="w-7 h-7 text-blue-400" />
                配置管理
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Server className="w-4 h-4" />
                  服务器状态
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Database className="w-4 h-4" />
                  数据库连接
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <AdvancedSettings
                handleSaveConfig={() => console.log("保存配置")}
                handleLoadConfig={() => console.log("加载配置")}
              />

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfigManager(true)}
                  className="text-lg py-6"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  配置管理器
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportConfig}
                  className="text-lg py-6"
                >
                  <Download className="w-5 h-5 mr-2" />
                  导出配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfigurationManager
        isOpen={showConfigManager}
        onClose={() => setShowConfigManager(false)}
        onImport={(config) => {
          // Handle import in page component
        }}
      />
      <ServerPortScanModal
        isOpen={isPortScanModalOpen}
        onClose={togglePortScanModal}
      />
      <ConnectionHistory
        isVisible={showHistory}
        onClose={toggleHistoryVisibility}
      />
      {/* 系统信息模态框 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: showSystemInfo ? 1 : 0,
          y: showSystemInfo ? 0 : 50,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center ${
          showSystemInfo ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-6 h-6" />
              系统信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                <span>CPU 使用率: 45%</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                <span>存储空间: 120GB/500GB</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                <span>内存使用: 8GB/16GB</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                <span>网络带宽: 100Mbps</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowSystemInfo(false)}>
              关闭
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* 通知模态框 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: showNotifications ? 1 : 0,
          y: showNotifications ? 0 : 50,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center ${
          showNotifications ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-6 h-6" />
              通知
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>系统安全状态：正常</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>新版本可用：v2.3.1</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                <span>后台任务运行中：3个</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => setShowNotifications(false)}
            >
              关闭
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// 表单模式定义
const formSchema = z.object({
  ip: z.string().min(1, "IP/Hostname is required").max(255),
  port: z
    .number()
    .int()
    .refine((n) => n >= 1 && n <= 65535, "Port must be between 1 and 65535"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
