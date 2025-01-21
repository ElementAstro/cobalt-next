"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash,
  Edit,
  Save,
  ChevronDown,
  ChevronUp,
  Clock,
  Repeat,
  ShieldAlert,
  Database,
  Gauge,
  Network,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useDebugStore } from "@/store/useDebugStore";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import React from "react";

const RequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]),
  url: z.string().url("请输入有效的URL地址"),
  headers: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "必须是有效的JSON格式" }
  ),
  body: z.string().optional(),
  timeout: z.number().min(100).max(30000),
  retries: z.number().min(0).max(10),
  retryDelay: z.number().min(100).max(10000),
  validateSSL: z.boolean(),
  cacheEnabled: z.boolean(),
  cacheDuration: z.number().min(0).max(86400000),
  rateLimitEnabled: z.boolean(),
  rateLimitCount: z.number().min(1).max(1000),
  rateLimitWindow: z.number().min(1000).max(3600000),
  customHeaders: z.string().optional(),
});

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  loading: {
    rotate: [0, 360],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const formTransition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
};

interface RequestFormProps {
  onSubmit: (config: any) => void;
  settings: { defaultTimeout: number };
}

const AdvancedOptions = React.memo(
  ({ control, watch }: { control: any; watch: any }) => {
    const cacheEnabled = watch("cacheEnabled");
    const rateLimitEnabled = watch("rateLimitEnabled");

    return (
      <motion.div className="space-y-4" variants={animationVariants}>
        {/* Caching Section */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center space-y-0 p-4">
            <Database className="h-5 w-5 mr-2 text-primary" />
            <span className="font-semibold">缓存设置</span>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
            <div className="flex items-center space-x-2">
              <Controller
                name="cacheEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="cache-enabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="cache-enabled">启用缓存</Label>
            </div>
            {cacheEnabled && (
              <FormField
                name="cacheDuration"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="缓存时间 (毫秒)"
                        className="dark:bg-gray-700"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Rate Limiting Section */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center space-y-0 p-4">
            <Gauge className="h-5 w-5 mr-2 text-primary" />
            <span className="font-semibold">速率限制</span>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-0">
            <div className="flex items-center space-x-2">
              <Controller
                name="rateLimitEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="rate-limit-enabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="rate-limit-enabled">启用限制</Label>
            </div>
            {rateLimitEnabled && (
              <>
                <FormField
                  name="rateLimitCount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="最大请求数"
                          className="dark:bg-gray-700"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="rateLimitWindow"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="时间窗口 (毫秒)"
                          className="dark:bg-gray-700"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center space-y-0 p-4">
            <Network className="h-5 w-5 mr-2 text-primary" />
            <span className="font-semibold">网络配置</span>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <FormField
              name="validateSSL"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="validate-ssl"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="validate-ssl">SSL验证</Label>
                    <ShieldAlert className="h-4 w-4 ml-2 text-muted-foreground" />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

export default function RequestForm({ onSubmit, settings }: RequestFormProps) {
  const { toast } = useToast();
  const { templates, updateTemplate, deleteTemplate, addHistory } =
    useDebugStore();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof RequestSchema>>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      method: "GET",
      url: "",
      headers: "{}",
      timeout: settings.defaultTimeout,
      retries: 3,
      retryDelay: 1000,
      validateSSL: true,
      cacheEnabled: false,
      cacheDuration: 300000,
      rateLimitEnabled: false,
      rateLimitCount: 10,
      rateLimitWindow: 60000,
    },
  });

  const handleSubmit = async (values: z.infer<typeof RequestSchema>) => {
    setIsSubmitting(true);
    const startTime = Date.now();

    try {
      const config = {
        method: values.method,
        url: values.url,
        headers: JSON.parse(values.headers),
        data: values.body ? JSON.parse(values.body) : undefined,
        timeout: values.timeout,
        retries: values.retries,
        retryDelay: values.retryDelay,
        rejectUnauthorized: values.validateSSL,
        cacheEnabled: values.cacheEnabled,
        cacheDuration: values.cacheDuration,
        rateLimitEnabled: values.rateLimitEnabled,
        rateLimitCount: values.rateLimitCount,
        rateLimitWindow: values.rateLimitWindow,
      };

      await onSubmit(config);

      addHistory({
        ...config,
        timestamp: Date.now(),
        status: "success",
        duration: Date.now() - startTime,
      });

      toast({
        title: "请求成功",
        description: (
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span>请求耗时：{Date.now() - startTime}ms</span>
          </div>
        ),
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "未知错误";

      addHistory({
        ...form.getValues(),
        timestamp: Date.now(),
        status: "error",
        duration,
        error: errorMessage,
      });

      toast({
        title: "请求失败",
        description: (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants}
      transition={formTransition}
      className="w-full max-w-4xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Network className="h-6 w-6 mr-2 text-primary" />
                HTTP请求测试
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {/* 模板选择区域 */}
              <motion.div
                variants={animationVariants}
                transition={{ delay: 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="dark:bg-gray-700">
                            <SelectValue placeholder="选择方法" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "GET",
                              "POST",
                              "PUT",
                              "DELETE",
                              "PATCH",
                              "HEAD",
                              "OPTIONS",
                            ].map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="url"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <Input
                          {...field}
                          placeholder="https://api.example.com/data"
                          className="dark:bg-gray-700"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* 高级选项切换 */}
              <motion.div
                variants={animationVariants}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full flex items-center justify-between"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                >
                  <span className="flex items-center">
                    {advancedOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        隐藏高级选项
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        显示高级选项
                      </>
                    )}
                  </span>
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    {advancedOpen ? "已展开" : "已折叠"}
                  </Badge>
                </Button>
              </motion.div>

              {/* 高级选项内容 */}
              <AnimatePresence>
                {advancedOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={animationVariants}
                    transition={formTransition}
                  >
                    <AdvancedOptions
                      control={form.control}
                      watch={form.watch}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 提交按钮 */}
              <motion.div
                variants={animationVariants}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.span
                      className="flex items-center"
                      animate={isSubmitting ? "loading" : "visible"}
                      variants={animationVariants}
                    >
                      <Repeat className="h-4 w-4 mr-2 animate-spin" />
                      发送请求中...
                    </motion.span>
                  ) : (
                    "立即发送请求"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </motion.div>
  );
}
