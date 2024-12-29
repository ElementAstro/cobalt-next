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
import { Plus, Trash, Edit, Save, Eye } from "lucide-react";
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

  const saveAsTemplate = () => {
    const templateName = prompt("输入模板名称:");
    if (templateName) {
      const newTemplate = {
        name: templateName,
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
        },
      };
      addTemplate(newTemplate);
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
        },
      };
      updateTemplate(updatedTemplate);
      setIsEditing(false);
      setEditTemplateName("");
    }
  };

  const clearForm = () => {
    setMethod("GET");
    setUrl("");
    setHeaders("");
    setBody("");
    setTimeoutValue(settings.defaultTimeout);
    setRetries(3);
    setRetryDelay(1000);
    setValidateSSL(true);
    setSelectedTemplate("none");
    setIsEditing(false);
    setEditTemplateName("");
  };

  const previewRequest = () => {
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
      };
      return JSON.stringify(config, null, 2);
    } catch {
      return "配置格式错误";
    }
  };

  const handleBatchSubmit = async () => {
    setBatchInProgress(true);
    for (let i = 0; i < batchCount; i++) {
      const form = document.createElement("form");
      const event = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(event);
      if (i < batchCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, batchDelay));
      }
    }
    setBatchInProgress(false);
  };

  const addEnvironmentVariable = () => {
    if (newEnvKey && newEnvValue) {
      addVariable(newEnvKey, newEnvValue);
      setNewEnvKey("");
      setNewEnvValue("");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      transition={cardTransition}
      className="w-full max-w-4xl mx-auto p-4 lg:p-6"
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
              {/* 模板选择 */}
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

              {/* 请求方法与URL */}
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

              {/* Headers */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.3 }}
              >
                <Label className="mb-1 text-sm font-medium dark:text-gray-300">
                  Headers (JSON 格式)
                </Label>
                <Textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  placeholder='例如: {"Authorization": "Bearer token"}'
                  rows={4}
                  className="w-full dark:bg-gray-700 dark:text-gray-200"
                />
              </motion.div>

              {/* Body */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.4 }}
              >
                <Label className="mb-1 text-sm font-medium dark:text-gray-300">
                  请求体 (JSON 格式)
                </Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='例如: {"name": "John Doe", "email": "john@example.com"}'
                  rows={4}
                  className="w-full dark:bg-gray-700 dark:text-gray-200"
                />
              </motion.div>

              {/* 请求参数 */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <Input
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeoutValue(Number(e.target.value))}
                  placeholder="超时时间 (毫秒)"
                  className="dark:bg-gray-700/50 dark:text-gray-200"
                  required
                  min={0}
                />
                <Input
                  type="number"
                  value={retries}
                  onChange={(e) => setRetries(Number(e.target.value))}
                  placeholder="重试次数"
                  className="dark:bg-gray-700 dark:text-gray-200"
                  required
                  min={0}
                />
                <Input
                  type="number"
                  value={retryDelay}
                  onChange={(e) => setRetryDelay(Number(e.target.value))}
                  placeholder="重试延迟 (毫秒)"
                  className="dark:bg-gray-700 dark:text-gray-200"
                  required
                  min={0}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="validate-ssl"
                    checked={validateSSL}
                    onCheckedChange={setValidateSSL}
                  />
                  <Label htmlFor="validate-ssl" className="dark:text-gray-300">
                    验证 SSL
                  </Label>
                </div>
              </motion.div>

              {/* 环境变量管理 */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.6 }}
                className="space-y-2"
              >
                <Label className="mb-1">环境变量</Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    placeholder="键"
                    className="w-1/2 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <Input
                    type="text"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    placeholder="值"
                    className="w-1/2 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <Button
                    type="button"
                    onClick={addEnvironmentVariable}
                    variant="ghost"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(environment).map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <span>{`${key}: ${value}`}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariable(key)}
                      >
                        <Trash className="h-3 w-3 text-red-500" />
                        <span className="sr-only">删除变量</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* 请求预览 */}
              <motion.div>
                <div className="flex items-center mb-4">
                  <Switch
                    id="show-preview"
                    checked={showPreview}
                    onCheckedChange={setShowPreview}
                  />
                  <Label htmlFor="show-preview">显示请求预览</Label>
                </div>
                {showPreview && (
                  <pre className="bg-gray-100 p-4 rounded overflow-auto dark:bg-gray-700">
                    <code>{previewRequest()}</code>
                  </pre>
                )}
              </motion.div>

              {/* 批量请求设置 */}
              <motion.div className="flex flex-col space-y-2">
                <Label>批量请求设置</Label>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    placeholder="请求次数"
                    min={1}
                    className="w-32"
                  />
                  <Input
                    type="number"
                    value={batchDelay}
                    onChange={(e) => setBatchDelay(Number(e.target.value))}
                    placeholder="请求间隔(ms)"
                    min={0}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    onClick={handleBatchSubmit}
                    disabled={batchInProgress}
                    className="flex items-center"
                  >
                    {batchInProgress ? "执行中..." : "执行批量请求"}
                  </Button>
                </div>
              </motion.div>

              {/* 按钮组 */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ ...formTransition, delay: 0.7 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <motion.div
                          variants={animationVariants}
                          animate="loading"
                          className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                        ></motion.div>
                        发送中...
                      </div>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        发送请求
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={saveAsTemplate}
                    variant="outline"
                    className="w-full flex items-center justify-center dark:border-gray-600 dark:text-gray-200"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    保存为模板
                  </Button>
                  <Button
                    type="button"
                    onClick={clearForm}
                    variant="secondary"
                    className="w-full flex items-center justify-center dark:bg-gray-600 dark:text-white"
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    清空表单
                  </Button>
                </div>

                {(error || requestDuration > 0) && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={animationVariants}
                    transition={formTransition}
                    className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    {error && (
                      <div className="flex items-center text-red-500 dark:text-red-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}
                    {requestDuration > 0 && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>请求耗时: {requestDuration}ms</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* 请求历史记录 */}
      <Card className="mt-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>请求历史记录</CardTitle>
          <Button
            type="button"
            onClick={clearHistory}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Trash className="h-4 w-4 mr-1" />
            清空历史
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="搜索历史记录..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow dark:bg-gray-700 dark:text-gray-200"
            />
            <Button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              variant="ghost"
              className="ml-2"
            >
              {showHistory ? "隐藏历史记录" : "显示历史记录"}
            </Button>
          </div>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, height: 0 },
                  visible: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-4 overflow-y-auto max-h-64"
              >
                {history
                  .filter(
                    (item) =>
                      item.config.method
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      item.config.url
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold">{req.config.method}</span>{" "}
                          {req.config.url}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {new Date(req.config.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded overflow-x-auto">
                        <code>{JSON.stringify(req.config, null, 2)}</code>
                      </pre>
                    </motion.div>
                  ))}
                {history.filter(
                  (item) =>
                    item.config.method
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    item.config.url.toLowerCase().includes(search.toLowerCase())
                ).length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    暂无匹配的历史记录
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
