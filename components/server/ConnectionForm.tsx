// ConnectionForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

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
} from "lucide-react";

import { ConnectionAlert } from "./ConnectionAlert";
import { ConnectionDetails } from "./ConnectionDetails";
import { LoginForm } from "./LoginForm";
import { AdvancedSettings } from "./AdvancedSettings";
import { ConnectionHistory } from "./ConnectionHistory";

import { useConnectionStore } from "@/lib/store/server";
import ServerPortScanModal from "./ServerPortScan";

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

  const isDesktop = useMediaQuery({ minWidth: 768 });

  const handleConnect = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (values.ip && values.username && values.password) {
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
    saveToCookies();
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

  return (
    <div
      className={`h-screen w-screen bg-background p-2 flex ${
        isDesktop ? "flex-row" : "flex-col"
      } ${isDarkMode ? "dark" : ""} overflow-hidden`}
    >
      <ConnectionAlert showAlert={showAlert} alertType={alertType} />

      {isDesktop ? (
        // 桌面端布局
        <div className="flex-grow flex flex-row items-center justify-center h-full space-x-4">
          <Card className="w-full max-w-lg bg-gray-800 shadow-lg h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-white">
                <Plug className="w-6 h-6 text-blue-400" />
                连接 (桌面)
              </CardTitle>
              <div className="flex items-center gap-2">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleHistoryVisibility}
                        className="text-purple-400"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>连接历史</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapse}
                  className="text-gray-400"
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ScrollArea className="h-full pr-4 overflow-hidden">
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
                            <Switch
                              id="remember"
                              checked={formData.rememberLogin}
                              onCheckedChange={(checked) =>
                                updateFormData({ rememberLogin: checked })
                              }
                            />
                            <Label htmlFor="remember" className="text-white">
                              记住登录数据
                            </Label>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <Button
                              onClick={togglePortScanModal}
                              className="w-full flex items-center justify-center"
                              disabled={isConnected}
                            >
                              打开端口扫描
                            </Button>
                            <Button
                              type="submit"
                              className="w-full flex items-center justify-center"
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
                              className="w-full flex items-center justify-center"
                              onClick={handleDisconnect}
                              disabled={!isConnected}
                            >
                              <Link2Off className="w-4 h-4 mr-2" />
                              断开连接
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>

              <AdvancedSettings
                handleSaveConfig={handleSaveConfig}
                handleLoadConfig={handleLoadConfig}
              />

              {isConnected && (
                <div className="mt-1 space-y-1">
                  <Label className="text-white">连接强度</Label>
                  <Progress value={connectionStrength} className="w-full" />
                </div>
              )}
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
                    <Switch
                      id="remember"
                      checked={formData.rememberLogin}
                      onCheckedChange={(checked) =>
                        updateFormData({ rememberLogin: checked })
                      }
                    />
                    <Label htmlFor="remember" className="text-white">
                      记住登录数据
                    </Label>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={togglePortScanModal}
                      className="w-full flex items-center justify-center"
                      disabled={isConnected}
                    >
                      打开端口扫描
                    </Button>
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center"
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
                      className="w-full flex items-center justify-center"
                      onClick={handleDisconnect}
                      disabled={!isConnected}
                    >
                      <Link2Off className="w-4 h-4 mr-2" />
                      断开连接
                    </Button>
                  </div>
                </form>
              </Form>
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
