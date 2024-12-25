// ConnectionForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCookies } from "react-cookie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ChevronDown,
  ChevronUp,
  Link2Off,
  Plug,
  Trash2,
  Upload,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  History,
  Settings,
  Download,
} from "lucide-react";

import { ConnectionAlert } from "./ConnectionAlert";
import { ConnectionDetails } from "./ConnectionDetails";
import { LoginForm } from "./LoginForm";
import { AdvancedSettings } from "./AdvancedSettings";
import { ConnectionHistory } from "./ConnectionHistory";
import { NetworkStatus } from "./NetworkStatus";
import { ConfigurationManager } from "./ConfigurationManager";
import useNetworkStatus from "@/hooks/useNetworkStatus";

import { useConnectionStore } from "@/lib/store/server";
import ServerPortScanModal from "./ServerPortScan";
import { useIsMobile } from "@/hooks/use-mobile";

// 定义表单模式
const formSchema = z.object({
  ip: z.string().min(1, "IP/Hostname is required").max(255),
  port: z
    .number()
    .int()
    .refine((n) => n >= 1 && n <= 65535, "Port must be between 1 and 65535"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function ConnectionForm({
  onConnect,
}: {
  onConnect: () => void;
}) {
  const [cookies, setCookie, removeCookie] = useCookies(["connection_data"]);
  const {
    formData,
    isConnected,
    isLoading,
    connectionStrength,
    connectionHistory,
    isDarkMode,
    isRegistered,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("connection");
  const [showHistory, setShowHistory] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    loadFromCookies();
    loadRegistration();
  }, [loadFromCookies, loadRegistration]);

  useEffect(() => {
    // 从cookie加载数据
    if (cookies.connection_data) {
      const savedData = cookies.connection_data;
      form.reset(savedData);
      updateFormData(savedData);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionStrength(Math.floor(Math.random() * 100) + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected, setConnectionStrength]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const isDesktop = useIsMobile(768);

  const handleConnect = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (values.ip && values.username && values.password) {
      // 保存到cookie
      if (formData.rememberLogin) {
        setCookie(
          "connection_data",
          {
            ip: values.ip,
            port: values.port,
            username: values.username,
            password: values.password,
            isSSL: formData.isSSL,
            rememberLogin: formData.rememberLogin,
          },
          {
            path: "/",
            maxAge: 30 * 24 * 60 * 60, // 30天过期
            secure: true,
            sameSite: "strict",
          }
        );
      } else {
        removeCookie("connection_data");
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

  const handleReset = () => {
    form.reset();
    updateFormData({
      ip: "",
      port: 5950,
      username: "",
      password: "",
      isSSL: false,
      rememberLogin: false,
    });
    removeCookie("connection_data");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveConfig = () => {
    console.log("Saving configuration:", form.getValues());
  };

  const handleLoadConfig = () => {
    console.log("Loading configuration");
  };

  const toggleHistoryVisibility = () => {
    setShowHistory(!showHistory);
  };

  const [isPortScanModalOpen, setIsPortScanModalOpen] = useState(false);

  const togglePortScanModal = () => {
    setIsPortScanModalOpen(!isPortScanModalOpen);
  };

  const networkStatus = useNetworkStatus();
  const [showConfigManager, setShowConfigManager] = useState(false);

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

  return (
    <div
      className={`h-screen w-screen bg-background p-2 flex ${
        isDesktop ? "flex-row" : "flex-col"
      } ${isDarkMode ? "dark" : ""} overflow-hidden`}
    >
      <ConnectionAlert showAlert={showAlert} alertType={alertType} />

      {isDesktop ? (
        // 桌面端布局
        <div className="flex-grow grid grid-cols-2 gap-8 p-8 h-full">
          {/* 左侧连接面板 */}
          <Card className="bg-gray-800 shadow-lg h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-2xl font-semibold flex items-center gap-3 text-white">
                <Plug className="w-7 h-7 text-blue-400" />
                连接控制面板
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
                        onClick={toggleHistoryVisibility}
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

              <ScrollArea className="h-[calc(100vh-400px)] pr-4">
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
                      togglePasswordVisibility={togglePasswordVisibility}
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
                        onClick={togglePortScanModal}
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
              </ScrollArea>

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
          <Card className="bg-gray-800 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3">
                <Settings className="w-7 h-7 text-blue-400" />
                配置管理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AdvancedSettings
                handleSaveConfig={handleSaveConfig}
                handleLoadConfig={handleLoadConfig}
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

              <ConfigurationManager
                isOpen={showConfigManager}
                onClose={() => setShowConfigManager(false)}
                onImport={(config) => {
                  form.reset(config);
                  updateFormData(config);
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        // 移动端布局
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
                    togglePasswordVisibility={togglePasswordVisibility}
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
                      onClick={togglePortScanModal}
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
                  onClick={() => setShowConfigManager(true)}
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

              <ConfigurationManager
                isOpen={showConfigManager}
                onClose={() => setShowConfigManager(false)}
                onImport={(config) => {
                  form.reset(config);
                  updateFormData(config);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

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
