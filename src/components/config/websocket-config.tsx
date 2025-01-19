"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Power, PowerOff, RefreshCw, Activity, Check, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useToast } from "@/hooks/use-toast";

import useWebSocketStore from "@/store/useWebSocketStore";
import wsClient from "@/utils/ws-client";

const formSchema = z.object({
  url: z.string().url({ message: "请输入有效的WebSocket URL" }),
  reconnectInterval: z.number().min(1000).max(60000),
  maxReconnectAttempts: z.number().min(1).max(10),
  heartbeatInterval: z.number().min(1000).max(60000),
  debug: z.boolean(),
  binaryType: z.enum(["blob", "arraybuffer"]),
  queueSize: z.number().min(10).max(1000),
  timeout: z.number().min(1000).max(30000),
  compression: z.boolean(),
  autoReconnect: z.boolean(),
  messageFormat: z.enum(["json", "text", "binary"]),
});

interface WebSocketStats {
  messagesSent: number;
  messagesReceived: number;
  connectionAttempts: number;
  lastConnectedAt: Date | null;
  lastDisconnectedAt: Date | null;
  messageQueueSize: number;
  latency: number;
  packetLoss: number;
  bandwidth: number;
  errors: number;
  messageHistory: Array<{
    timestamp: Date;
    direction: "in" | "out";
    message: string;
  }>;
}

export default function WebSocketConfig() {
  const { config, setConfig } = useWebSocketStore();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<
    "closed" | "connecting" | "open" | "closing"
  >("closed");
  const [stats, setStats] = useState<WebSocketStats>({
    messagesSent: 0,
    messagesReceived: 0,
    connectionAttempts: 0,
    lastConnectedAt: null,
    lastDisconnectedAt: null,
    messageQueueSize: 0,
    latency: 0,
    packetLoss: 0,
    bandwidth: 0,
    errors: 0,
    messageHistory: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: config,
  });

  useEffect(() => {
    if (wsClient) {
      wsClient.on("open", () => {
        setConnectionStatus("open");
        setStats((prev) => ({
          ...prev,
          lastConnectedAt: new Date(),
          connectionAttempts: prev.connectionAttempts + 1,
        }));
        toast({
          title: "连接成功",
          description: "WebSocket 连接已建立。",
          variant: "default",
        });
      });

      wsClient.on("close", () => {
        setConnectionStatus("closed");
        setStats((prev) => ({
          ...prev,
          lastDisconnectedAt: new Date(),
        }));
        toast({
          title: "连接关闭",
          description: "WebSocket 连接已关闭。",
          variant: "default",
        });
      });

      wsClient.on("message", (message: string) => {
        setStats((prev) => ({
          ...prev,
          messagesReceived: prev.messagesReceived + 1,
        }));
        if (config.debug) {
          console.log("Received message:", message);
        }
      });
    }

    return () => {
      if (wsClient) {
        wsClient.off("open", () => {
          setConnectionStatus("open");
          setStats((prev) => ({
            ...prev,
            lastConnectedAt: new Date(),
            connectionAttempts: prev.connectionAttempts + 1,
          }));
          toast({
            title: "连接成功",
            description: "WebSocket 连接已建立。",
            variant: "default",
          });
        });
        wsClient.off("close", () => {
          setConnectionStatus("closed");
          setStats((prev) => ({
            ...prev,
            lastDisconnectedAt: new Date(),
          }));
          toast({
            title: "连接关闭",
            description: "WebSocket 连接已关闭。",
            variant: "default",
          });
        });
        wsClient.off("message", (message: string) => {
          setStats((prev) => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1,
          }));
        });
      }
    };
  }, [config.debug]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDialogOpen(true);
  }

  const handleConfirm = async () => {
    const values = form.getValues();
    try {
      setConfig(values);
      toast({
        title: "配置已保存",
        description: "WebSocket 配置已成功保存。",
        variant: "default",
      });

      // 测试新配置的连接性
      if (wsClient) {
        setConnectionStatus("connecting");
        toast({
          title: "正在测试连接...",
          description: "正在使用新配置测试WebSocket连接",
          variant: "default",
        });

        const testResult = await wsClient.testConnection(values);
        if (testResult.success) {
          toast({
            title: "连接测试成功",
            description: `连接延迟：${testResult.latency}ms`,
            variant: "default",
          });
        } else {
          throw new Error(testResult.error || "连接测试失败");
        }
      }
    } catch (error: any) {
      toast({
        title: "配置保存失败",
        description: error.message || "无法保存 WebSocket 配置，请稍后重试。",
        variant: "destructive",
      });
      console.error("配置保存错误:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    toast({
      title: "操作已取消",
      description: "WebSocket 配置未保存。",
      variant: "default",
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "open":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "closing":
        return "bg-orange-500";
      default:
        return "bg-red-500";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "open":
        return <Activity className="w-5 h-5 text-green-500" />;
      case "connecting":
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      case "closing":
        return <Power className="w-5 h-5 text-orange-500" />;
      default:
        return <PowerOff className="w-5 h-5 text-red-500" />;
    }
  };

  const getConnectionQuality = () => {
    if (stats.latency < 100 && stats.packetLoss < 1) {
      return "excellent";
    } else if (stats.latency < 300 && stats.packetLoss < 5) {
      return "good";
    } else if (stats.latency < 500 && stats.packetLoss < 10) {
      return "fair";
    }
    return "poor";
  };

  const lineData = [
    {
      id: "发送消息数",
      color: "hsl(205, 70%, 50%)",
      data: [
        { x: "1", y: stats.messagesSent },
        { x: "2", y: stats.messagesSent + 10 },
        { x: "3", y: stats.messagesSent + 20 },
        { x: "4", y: stats.messagesSent + 30 },
      ],
    },
    {
      id: "接收消息数",
      color: "hsl(120, 70%, 50%)",
      data: [
        { x: "1", y: stats.messagesReceived },
        { x: "2", y: stats.messagesReceived + 5 },
        { x: "3", y: stats.messagesReceived + 15 },
        { x: "4", y: stats.messagesReceived + 25 },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 space-y-6 bg-gray-900 min-h-screen"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-3xl font-bold text-white">WebSocket 配置</h2>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      connectionStatus === "open"
                        ? "animate-ping"
                        : "animate-pulse"
                    } ${getStatusColor()}`}
                  />
                  <span className="text-sm text-white capitalize">
                    {connectionStatus}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>当前连接状态</p>
              </TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-500 hover:bg-green-500/10 transition-all duration-300 flex items-center"
              onClick={() => {
                if (connectionStatus === "open") {
                  toast({
                    title: "已断开连接",
                    description: "WebSocket 连接已关闭。",
                    variant: "default",
                  });
                  setConnectionStatus("closing");
                  if (wsClient) {
                    wsClient.close();
                  } else {
                    toast({
                      title: "关闭失败",
                      description: "WebSocket 客户端未初始化。",
                      variant: "destructive",
                    });
                  }
                } else {
                  toast({
                    title: "正在连接",
                    description: "尝试建立 WebSocket 连接...",
                    variant: "default",
                  });
                  setConnectionStatus("connecting");
                  if (wsClient) {
                    wsClient.initiateConnection();
                  } else {
                    toast({
                      title: "连接失败",
                      description: "WebSocket 客户端未初始化。",
                      variant: "destructive",
                    });
                  }
                }
              }}
            >
              <Power className="w-4 h-4 mr-2 transition-transform duration-300" />
              <span>{connectionStatus === "open" ? "断开" : "连接"}</span>
            </Button>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">基本设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        WebSocket URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ws://localhost:8080"
                          {...field}
                          className="bg-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reconnectInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          重连间隔 (ms)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxReconnectAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          最大重连次数
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="heartbeatInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          心跳间隔 (ms)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="binaryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          二进制类型
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-gray-700 text-white">
                            <SelectValue placeholder="选择二进制类型" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white">
                            <SelectItem value="blob">Blob</SelectItem>
                            <SelectItem value="arraybuffer">
                              ArrayBuffer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="debug"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-300">
                          调试模式
                        </FormLabel>
                        <FormDescription className="text-gray-400">
                          启用后将在控制台输出详细日志
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="bg-green-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Connection Stats */}
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">连接统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">发送消息数</Label>
                    <div className="text-2xl font-bold text-green-500">
                      {stats.messagesSent}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">接收消息数</Label>
                    <div className="text-2xl font-bold text-blue-500">
                      {stats.messagesReceived}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">连接尝试次数</Label>
                    <div className="text-2xl font-bold text-yellow-500">
                      {stats.connectionAttempts}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">最后连接时间</Label>
                    <div className="text-sm text-gray-300">
                      {stats.lastConnectedAt
                        ? new Date(stats.lastConnectedAt).toLocaleString()
                        : "未连接"}
                    </div>
                  </div>
                </div>

                {/* Connection Quality */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">延迟</Label>
                    <div className="text-2xl font-bold text-purple-500">
                      {stats.latency}ms
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">丢包率</Label>
                    <div className="text-2xl font-bold text-pink-500">
                      {stats.packetLoss}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">带宽</Label>
                    <div className="text-2xl font-bold text-indigo-500">
                      {stats.bandwidth}kb/s
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">连接质量</Label>
                    <div className="text-2xl font-bold">
                      <span
                        className={`${
                          getConnectionQuality() === "excellent"
                            ? "text-green-500"
                            : getConnectionQuality() === "good"
                            ? "text-yellow-500"
                            : getConnectionQuality() === "fair"
                            ? "text-orange-500"
                            : "text-red-500"
                        }`}
                      >
                        {getConnectionQuality()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message History */}
                <div className="space-y-4">
                  <Label className="text-gray-400">消息历史</Label>
                  <div className="h-64 overflow-y-auto bg-gray-700 rounded-lg p-4">
                    {stats.messageHistory.map((msg, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 py-2 border-b border-gray-600"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            msg.direction === "in"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="text-sm text-gray-300">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-gray-200 flex-1 truncate">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center space-x-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                    onClick={() => {
                      if (wsClient) {
                        wsClient.send({ type: "test" });
                        toast({
                          title: "测试消息已发送",
                          description: "已向服务器发送测试消息。",
                          variant: "default",
                        });
                      } else {
                        toast({
                          title: "发送失败",
                          description: "WebSocket 客户端未初始化。",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 animate-spin-on-hover" />
                    <span>发送测试</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认保存配置</AlertDialogTitle>
                    <AlertDialogDescription>
                      确认保存当前的 WebSocket 配置设置吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      取消
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                      <Check className="w-4 h-4 mr-2" />
                      确认
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                type="submit"
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                <Activity className="w-4 h-4 animate-pulse" />
                <span>保存配置</span>
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </TooltipProvider>
  );
}
