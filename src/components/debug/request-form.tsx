"use client";

import { useState, useEffect } from "react";
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
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDebugStore } from "@/store/useDebugStore";
import { Badge } from "../ui/badge";

const BUILT_IN_TEMPLATES = [
  {
    name: "GET Example",
    config: {
      method: "GET",
      url: "https://api.example.com/data",
      headers: {},
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      rejectUnauthorized: true,
    },
  },
];

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
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
};

const formTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

const cardTransition = {
  type: "spring",
  stiffness: 80,
  damping: 15,
};

interface RequestFormProps {
  onSubmit: (config: any) => void;
  settings: { defaultTimeout: number };
}

export default function RequestForm({ onSubmit, settings }: RequestFormProps) {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    history,
    addHistory,
    clearHistory,
    environment,
    addVariable,
    removeVariable,
  } = useDebugStore();

  const [requestDuration, setRequestDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [timeout, setTimeoutValue] = useState(settings.defaultTimeout);
  const [retries, setRetries] = useState(3);
  const [retryDelay, setRetryDelay] = useState(1000);
  const [validateSSL, setValidateSSL] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("none");
  const [isEditing, setIsEditing] = useState(false);
  const [editTemplateName, setEditTemplateName] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [batchDelay, setBatchDelay] = useState(1000);
  const [batchInProgress, setBatchInProgress] = useState(false);
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvValue, setNewEnvValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cacheEnabled, setCacheEnabled] = useState(false);
  const [cacheDuration, setCacheDuration] = useState(300000);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(false);
  const [rateLimitCount, setRateLimitCount] = useState(10);
  const [rateLimitWindow, setRateLimitWindow] = useState(60000);
  const [customHeadersEnabled, setCustomHeadersEnabled] = useState(false);
  const [customHeaders, setCustomHeaders] = useState("");
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

  useEffect(() => {
    if (selectedTemplate !== "none") {
      const template = templates.find((t) => t.name === selectedTemplate);
      if (template) {
        setMethod(template.config.method || "GET");
        setUrl(template.config.url || "");
        setHeaders(JSON.stringify(template.config.headers || {}, null, 2));
        setBody(JSON.stringify(template.config.data || {}, null, 2));
        setTimeoutValue(template.config.timeout || settings.defaultTimeout);
        setRetries(template.config.retries || 3);
        setRetryDelay(template.config.retryDelay || 1000);
        setValidateSSL(template.config.rejectUnauthorized !== false);
      }
    }
  }, [selectedTemplate, templates, settings.defaultTimeout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const config = {
        method,
        url,
        headers: headers ? JSON.parse(headers) : {},
        data: body ? JSON.parse(body) : undefined,
        timeout,
        retries,
        retryDelay,
        rejectUnauthorized: validateSSL,
        environment,
        cacheEnabled,
        cacheDuration,
        rateLimitEnabled,
        rateLimitCount,
        rateLimitWindow,
        customHeaders: customHeadersEnabled ? JSON.parse(customHeaders) : {},
      };

      await onSubmit(config);
      const duration = Date.now() - startTime;
      setRequestDuration(duration);

      const newHistory = {
        ...config,
        timestamp: Date.now(),
        status: "success" as const,
        duration,
      };
      addHistory(newHistory);
    } catch (err) {
      const duration = Date.now() - startTime;
      setRequestDuration(duration);
      setError(err instanceof Error ? err.message : "请求失败");
      const newHistory = {
        method,
        url,
        headers: headers ? JSON.parse(headers) : {},
        data: body ? JSON.parse(body) : undefined,
        timestamp: Date.now(),
        status: "error" as const,
        duration,
        error: err instanceof Error ? err.message : "Unknown error",
      };
      addHistory(newHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = () => {
    if (editTemplateName) {
      const updatedTemplate = {
        name: editTemplateName,
        config: {
          method,
          url,
          headers: headers ? JSON.parse(headers) : {},
          data: body ? JSON.parse(body) : undefined,
          timeout,
          retries,
          retryDelay,
          rejectUnauthorized: validateSSL,
          environment,
          cacheEnabled,
          cacheDuration,
          rateLimitEnabled,
          rateLimitCount,
          rateLimitWindow,
          customHeaders: customHeadersEnabled ? JSON.parse(customHeaders) : {},
        },
      };
      updateTemplate(updatedTemplate);
      setIsEditing(false);
      setEditTemplateName("");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      transition={cardTransition}
      className="w-full max-w-4xl mx-auto"
    >
      <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
        <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-xl">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              HTTP 请求测试
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Template Selection */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4"
              >
                <Label className="mb-1 sm:mb-0">选择模板</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="w-full sm:w-64 dark:bg-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="选择模板" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无模板</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.name}
                        {!BUILT_IN_TEMPLATES.some(
                          (bt) => bt.name === template.name
                        ) && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate(template.name);
                              }}
                              className="ml-2"
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                              <span className="sr-only">删除模板</span>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                                setEditTemplateName(template.name);
                              }}
                              className="ml-1"
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                              <span className="sr-only">编辑模板</span>
                            </Button>
                          </>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={handleEditTemplate}
                    variant="outline"
                    className="mt-2 sm:mt-0 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    保存模板
                  </Button>
                )}
              </motion.div>

              {/* Method and URL */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.2 }}
                className="flex flex-col sm:flex-row sm:space-x-4"
              >
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-full sm:w-1/3 dark:bg-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="方法" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="输入 URL"
                  className="w-full sm:w-2/3 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </motion.div>

              {/* Advanced Options Toggle */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
                  className="flex items-center"
                >
                  {advancedOptionsOpen ? (
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
                </Button>
              </motion.div>

              {/* Advanced Options */}
              <AnimatePresence>
                {advancedOptionsOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={animationVariants}
                    transition={formTransition}
                    className="space-y-4"
                  >
                    {/* Caching Settings */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={animationVariants}
                      transition={{ ...formTransition, delay: 0.4 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enable-cache"
                          checked={cacheEnabled}
                          onCheckedChange={setCacheEnabled}
                        />
                        <Label htmlFor="enable-cache">启用缓存</Label>
                      </div>
                      {cacheEnabled && (
                        <Input
                          type="number"
                          value={cacheDuration}
                          onChange={(e) =>
                            setCacheDuration(Number(e.target.value))
                          }
                          placeholder="缓存时间 (毫秒)"
                          className="dark:bg-gray-700 dark:text-gray-200"
                          min={0}
                        />
                      )}
                    </motion.div>

                    {/* Rate Limiting Settings */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={animationVariants}
                      transition={{ ...formTransition, delay: 0.5 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enable-rate-limit"
                          checked={rateLimitEnabled}
                          onCheckedChange={setRateLimitEnabled}
                        />
                        <Label htmlFor="enable-rate-limit">启用速率限制</Label>
                      </div>
                      {rateLimitEnabled && (
                        <>
                          <Input
                            type="number"
                            value={rateLimitCount}
                            onChange={(e) =>
                              setRateLimitCount(Number(e.target.value))
                            }
                            placeholder="最大请求数"
                            className="dark:bg-gray-700 dark:text-gray-200"
                            min={1}
                          />
                          <Input
                            type="number"
                            value={rateLimitWindow}
                            onChange={(e) =>
                              setRateLimitWindow(Number(e.target.value))
                            }
                            placeholder="时间窗口 (毫秒)"
                            className="dark:bg-gray-700 dark:text-gray-200"
                            min={0}
                          />
                        </>
                      )}
                    </motion.div>

                    {/* Custom Headers */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={animationVariants}
                      transition={{ ...formTransition, delay: 0.6 }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Switch
                          id="enable-custom-headers"
                          checked={customHeadersEnabled}
                          onCheckedChange={setCustomHeadersEnabled}
                        />
                        <Label htmlFor="enable-custom-headers">
                          自定义 Headers
                        </Label>
                      </div>
                      {customHeadersEnabled && (
                        <Textarea
                          value={customHeaders}
                          onChange={(e) => setCustomHeaders(e.target.value)}
                          placeholder='例如: {"X-Custom-Header": "value"}'
                          rows={3}
                          className="w-full dark:bg-gray-700 dark:text-gray-200"
                        />
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ... [rest of the form remains the same] ... */}
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ... [rest of the component remains the same] ... */}
    </motion.div>
  );
}
