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
import { Plus, Trash, Edit, Save, Eye, Search } from "lucide-react";
import { useRequestStore } from "@/lib/store/debug";

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
  } = useRequestStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      };
      onSubmit(config);
      const newHistory = {
        id: Date.now().toString(),
        config: {
          ...config,
          timestamp: Date.now(),
        },
      };
      addHistory(newHistory);
    } catch {
      alert("Headers 或 Body 必须是有效的 JSON 格式");
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
      };
      return JSON.stringify(config, null, 2);
    } catch {
      return "配置格式错误";
    }
  };

  const handleBatchSubmit = async () => {
    setBatchInProgress(true);
    for (let i = 0; i < batchCount; i++) {
      const form = document.createElement('form');
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
      if (i < batchCount - 1) {
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }
    setBatchInProgress(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4 lg:p-6"
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">HTTP 请求测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
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

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-2"
            >
              <Switch
                id="validate-ssl"
                checked={validateSSL}
                onCheckedChange={setValidateSSL}
              />
              <Label htmlFor="validate-ssl" className="dark:text-gray-300">
                验证 SSL
              </Label>
            </motion.div>

            <motion.div>
              <div className="flex items-center space-x-4 mb-4">
                <Switch
                  id="show-preview"
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
                <Label htmlFor="show-preview">显示请求预览</Label>
              </div>
              {showPreview && (
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  <code>{previewRequest()}</code>
                </pre>
              )}
            </motion.div>

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

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Button
                type="submit"
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Eye className="h-4 w-4 mr-2" />
                发送请求
              </Button>
              <Button
                type="button"
                onClick={saveAsTemplate}
                variant="outline"
                className="w-full flex items-center justify-center dark:border-gray-600 dark:text-gray-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                保存为模板
              </Button>
              <Button
                type="button"
                onClick={clearForm}
                variant="secondary"
                className="w-full flex items-center justify-center dark:bg-gray-600 dark:text-white"
              >
                <Trash className="h-4 w-4 mr-1" />
                清空表单
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
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
                        <code>{JSON.stringify(req, null, 2)}</code>
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
