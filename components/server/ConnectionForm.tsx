"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ConnectionForm({ onConnect }: { onConnect: () => void }) {
  const [isSSL, setIsSSL] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [activeTab, setActiveTab] = useState("connection");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ip: "",
      port: 5950,
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionStrength(Math.floor(Math.random() * 100) + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleConnect = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // 模拟连接过程
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (values.ip && values.username && values.password) {
      setIsConnected(true);
      onConnect();
      setAlertType("success");
      setShowAlert(true);
      setConnectionStrength(Math.floor(Math.random() * 100) + 1);
      setConnectionHistory((prev) => [...prev, `${values.ip}:${values.port}`]);
    } else {
      setAlertType("error");
      setShowAlert(true);
    }
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowAlert(false);
    setConnectionStrength(0);
  };

  const handleReset = () => {
    form.reset();
    setIsSSL(false);
    setRememberLogin(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveConfig = () => {
    // 实现保存配置逻辑
    console.log("Saving configuration:", form.getValues());
  };

  const handleLoadConfig = () => {
    // 实现加载配置逻辑
    console.log("Loading configuration");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div
      className={`max-h-screen bg-background p-4 flex flex-col ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <ConnectionAlert showAlert={showAlert} alertType={alertType} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex flex-col sm:flex-row items-center justify-center"
      >
        <Card className="w-full max-w-xl bg-gray-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-normal flex items-center gap-2 text-white">
              <Plug className="w-6 h-6 text-blue-400" />
              连接
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
                      onClick={toggleTheme}
                      className="text-yellow-400"
                    >
                      {isDarkMode ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isDarkMode ? "切换为浅色模式" : "切换为暗色模式"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleHistory}
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
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-700 rounded-md">
                <TabsTrigger value="connection" className="text-white">
                  连接
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-white">
                  高级设置
                </TabsTrigger>
              </TabsList>
              <TabsContent value="connection">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <ScrollArea className="h-[50vh] sm:h-[60vh] pr-4">
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(handleConnect)}
                            className="space-y-6"
                          >
                            <ConnectionDetails
                              form={form}
                              isSSL={isSSL}
                              setIsSSL={setIsSSL}
                            />
                            <LoginForm
                              form={form}
                              showPassword={showPassword}
                              togglePasswordVisibility={
                                togglePasswordVisibility
                              }
                            />

                            <div className="space-y-2">
                              <Label className="text-white">
                                租赁票据文件（即将推出）
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  disabled
                                  placeholder="选择票据文件（即将推出）"
                                  className="bg-gray-700 text-white"
                                />
                                <Button type="button" variant="secondary">
                                  浏览
                                </Button>
                              </div>
                              <p className="text-sm text-gray-400">
                                连接前请选择电脑中的租赁票据文件
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10"
                              onClick={handleReset}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              重置登录/票据数据
                            </Button>

                            <div className="flex items-center gap-2">
                              <Switch
                                id="remember"
                                checked={rememberLogin}
                                onCheckedChange={setRememberLogin}
                              />
                              <Label htmlFor="remember" className="text-white">
                                记住登录数据/票据
                              </Label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
              </TabsContent>
              <TabsContent value="advanced">
                <AdvancedSettings
                  handleSaveConfig={handleSaveConfig}
                  handleLoadConfig={handleLoadConfig}
                />
              </TabsContent>
            </Tabs>

            {isConnected && (
              <div className="mt-4 space-y-2">
                <Label className="text-white">连接强度</Label>
                <Progress value={connectionStrength} className="w-full" />
              </div>
            )}

            <p className="text-center text-gray-400 mt-4">连接到锂应用服务器</p>
          </CardContent>
        </Card>
      </motion.div>

      <ConnectionHistory
        isVisible={showHistory}
        onClose={toggleHistory}
        history={connectionHistory}
      />
    </div>
  );
}