import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Power, RefreshCw, Activity } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// 验证schema
const formSchema = z.object({
  url: z.string().url({ message: "请输入有效的WebSocket URL" }),
  reconnectInterval: z.number().min(1000).max(60000),
  maxReconnectAttempts: z.number().min(1).max(10),
  heartbeatInterval: z.number().min(1000).max(60000),
  debug: z.boolean(),
  binaryType: z.enum(["blob", "arraybuffer"]),
});

export default function WebSocketConfig() {
  const { config, setConfig } = useWebSocketStore();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<
    "closed" | "connecting" | "open" | "closing"
  >("closed");
  const [stats, setStats] = useState({
    messagesSent: 0,
    messagesReceived: 0,
    connectionAttempts: 0,
    lastConnectedAt: null as Date | null,
    lastDisconnectedAt: null as Date | null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: config,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDialogOpen(true);
  }

  const handleConfirm = () => {
    const values = form.getValues();
    try {
      setConfig(values);
      toast({
        title: "配置已保存",
        description: "WebSocket 配置已成功保存。",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存 WebSocket 配置，请稍后重试。",
        variant: "destructive",
      });
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

  return (
    <TooltipProvider>
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">WebSocket 配置</h2>
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center space-x-2">
                  <div
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
              className="border-green-500 text-green-500 hover:bg-green-500/10 transition-all duration-300 hover:scale-105"
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
              <Power className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                {connectionStatus === "open" ? "断开" : "连接"}
              </span>
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-black/20 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">基本设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WebSocket URL</FormLabel>
                      <FormControl>
                        <Input placeholder="ws://localhost:8080" {...field} />
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
                        <FormLabel>重连间隔 (ms)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>最大重连次数</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>心跳间隔 (ms)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>二进制类型</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择二进制类型" />
                          </SelectTrigger>
                          <SelectContent>
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
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>调试模式</FormLabel>
                        <FormDescription>
                          启用后将在控制台输出详细日志
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">连接统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>发送消息数</Label>
                    <div className="text-2xl font-bold text-green-500 animate-fade-in">
                      {stats.messagesSent}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>接收消息数</Label>
                    <div className="text-2xl font-bold text-blue-500 animate-fade-in">
                      {stats.messagesReceived}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>连接尝试次数</Label>
                    <div className="text-2xl font-bold text-yellow-500 animate-fade-in">
                      {stats.connectionAttempts}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>最后连接时间</Label>
                    <div className="text-sm">
                      {stats.lastConnectedAt
                        ? new Date(stats.lastConnectedAt).toLocaleString()
                        : "未连接"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="transition-all duration-300 hover:scale-105"
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
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin-on-hover" />
                    测试连接
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
                      取消
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                      确认
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                type="submit"
                className="transition-all duration-300 hover:scale-105"
              >
                <Activity className="w-4 h-4 mr-2 animate-pulse" />
                保存配置
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  );
}
