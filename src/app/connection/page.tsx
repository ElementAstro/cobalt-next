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

  return (
    <div
      className={`h-screen w-screen bg-background flex ${
        isMobile ? "flex-row" : "flex-col"
      } dark overflow-hidden max-h-screen`}
    >
      <ConnectionAlert showAlert={showAlert} alertType={alertType} />

      {!isMobile ? (
        <div className="flex-grow grid grid-cols-2 gap-8 p-8 h-full ">
          {/* 左侧连接面板 */}
          <Card className="shadow-lg h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-2xl font-semibold flex items-center gap-3 text-white">
                <Plug className="w-7 h-7 text-blue-400" />
                连接控制面板（桌面）
              </CardTitle>
              <div className="flex items-center gap-3">
                {isConnected && (
                  <Badge
                    variant={connectionStrength > 50 ? "default" : "secondary"}
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
            </CardHeader>

            <CardContent className="space-y-6">
              <NetworkStatus status={networkStatus} />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleConnect)}
                  className="space-y-6"
                >
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

                  <div className="flex items-center gap-3 py-2">
                    <Switch
                      id="remember"
                      checked={formData.rememberLogin}
                      onCheckedChange={(checked) =>
                        updateFormData({ rememberLogin: checked })
                      }
                    />
                    <Label htmlFor="remember" className="text-white text-lg">
                      记住登录数据
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                      onClick={() => setIsPortScanModalOpen(true)}
                      className="text-lg py-6"
                      variant="outline"
                    >
                      端口扫描
                    </Button>
                    <Button
                      type="submit"
                      className="text-lg py-6"
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

              {isConnected && (
                <div className="space-y-3 pt-4">
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

          {/* 右侧配置面板 */}
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3">
                <Settings className="w-7 h-7 text-blue-400" />
                配置管理
              </CardTitle>
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
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center h-full space-y-4">
          <Card className="w-full p-4 bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="text-xl font-semibold text-white">
                移动端连接
              </CardTitle>
              <div className="mt-2">
                {isConnected && (
                  <Badge
                    variant={connectionStrength > 50 ? "default" : "secondary"}
                  >
                    {connectionStrength > 50 ? (
                      <Wifi className="w-4 h-4 mr-1 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 mr-1 text-red-400" />
                    )}
                    {connectionStrength}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <NetworkStatus status={networkStatus} />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleConnect)}
                  className="space-y-3"
                >
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

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberLogin}
                      onCheckedChange={(checked) =>
                        updateFormData({ rememberLogin: checked === true })
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      记住登录数据
                    </Label>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => setIsPortScanModalOpen(true)}
                      className="w-full flex items-center justify-center text-white"
                      disabled={isConnected}
                    >
                      打开端口扫描
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 flex items-center justify-center text-white"
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
                            <Upload className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? "连接中..." : "连接"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 flex items-center justify-center text-white"
                        onClick={handleDisconnect}
                        disabled={!isConnected}
                      >
                        <Link2Off className="w-4 h-4 mr-2" />
                        断开连接
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsConfigManagerOpen(true)}
                  className="flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  配置管理
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportConfig}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
