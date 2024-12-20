"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, Save, X, RefreshCw } from "lucide-react";
import { useRequestStore } from "@/lib/store/debug/request";

const BUILT_IN_TEMPLATES = [
  {
    name: "GET Request",
    config: {
      method: "GET",
      url: "https://api.example.com/users",
      headers: {},
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      rejectUnauthorized: true,
    },
  },
  {
    name: "POST JSON",
    config: {
      method: "POST",
      url: "https://api.example.com/users",
      headers: { "Content-Type": "application/json" },
      data: { name: "John Doe", email: "john@example.com" },
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      rejectUnauthorized: true,
    },
  },
  {
    name: "PUT with Authentication",
    config: {
      method: "PUT",
      url: "https://api.example.com/users/1",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE",
      },
      data: { name: "Jane Doe", email: "jane@example.com" },
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      rejectUnauthorized: true,
    },
  },
  {
    name: "DELETE Request",
    config: {
      method: "DELETE",
      url: "https://api.example.com/users/1",
      headers: { Authorization: "Bearer YOUR_TOKEN_HERE" },
      data: {},
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      rejectUnauthorized: true,
    },
  },
];

export default function TemplateManager() {
  const { templates, addTemplate, deleteTemplate, updateTemplate } =
    useRequestStore();
  const [name, setName] = useState("");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [data, setData] = useState("");
  const [timeout, setTimeoutValue] = useState(5000);
  const [retries, setRetries] = useState(3);
  const [retryDelay, setRetryDelay] = useState(1000);
  const [rejectUnauthorized, setRejectUnauthorized] = useState(true);
  const [search, setSearch] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    method: "GET",
    url: "",
    headers: "",
    data: "",
    timeout: 5000,
    retries: 3,
    retryDelay: 1000,
    rejectUnauthorized: true,
  });

  // 添加模拟数据
  useEffect(() => {
    if (templates.length === 0) {
      BUILT_IN_TEMPLATES.forEach((template) => addTemplate(template));
    }
  }, [addTemplate, templates.length]);

  const handleSave = () => {
    if (name.trim() && url.trim()) {
      try {
        const parsedHeaders = headers ? JSON.parse(headers) : {};
        const parsedData = data ? JSON.parse(data) : {};
        const newTemplate = {
          name: name.trim(),
          config: {
            method,
            url: url.trim(),
            headers: parsedHeaders,
            data: parsedData,
            timeout,
            retries,
            retryDelay,
            rejectUnauthorized,
          },
        };
        addTemplate(newTemplate);
        setName("");
        setMethod("GET");
        setUrl("");
        setHeaders("");
        setData("");
        setTimeoutValue(5000);
        setRetries(3);
        setRetryDelay(1000);
        setRejectUnauthorized(true);
      } catch (error) {
        alert("无效的 JSON 配置");
      }
    }
  };

  const handleUpdate = () => {
    if (editingTemplate && editValues.name.trim() && editValues.url.trim()) {
      try {
        const parsedHeaders = editValues.headers
          ? JSON.parse(editValues.headers)
          : {};
        const parsedData = editValues.data ? JSON.parse(editValues.data) : {};
        const updatedTemplate = {
          name: editValues.name.trim(),
          config: {
            method: editValues.method,
            url: editValues.url.trim(),
            headers: parsedHeaders,
            data: parsedData,
            timeout: editValues.timeout,
            retries: editValues.retries,
            retryDelay: editValues.retryDelay,
            rejectUnauthorized: editValues.rejectUnauthorized,
          },
        };
        updateTemplate(updatedTemplate);
        setEditingTemplate(null);
      } catch (error) {
        alert("无效的 JSON 配置");
      }
    }
  };

  const handleRemove = (templateName: string) => {
    deleteTemplate(templateName);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template.name);
    setEditValues({
      name: template.name,
      method: template.config.method,
      url: template.config.url,
      headers: JSON.stringify(template.config.headers, null, 2),
      data: JSON.stringify(template.config.data || {}, null, 2),
      timeout: template.config.timeout,
      retries: template.config.retries,
      retryDelay: template.config.retryDelay,
      rejectUnauthorized: template.config.rejectUnauthorized,
    });
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.config.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>请求模板管理</CardTitle>
          <Button
            onClick={() => {
              // 重置到内置模板
              templates.forEach((template) => {
                if (
                  !BUILT_IN_TEMPLATES.some((bt) => bt.name === template.name)
                ) {
                  deleteTemplate(template.name);
                }
              });
            }}
            variant="ghost"
            className="text-blue-400 hover:text-blue-500"
          >
            <RefreshCw className="w-5 h-5 mr-1" />
            重置
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 添加模板表单 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <Input
                placeholder="模板名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 text-white"
              />
              <Input
                placeholder="请求方法 (GET, POST, PUT, DELETE)"
                value={method}
                onChange={(e) => setMethod(e.target.value.toUpperCase())}
                className="w-full bg-gray-700 text-white"
              />
              <Input
                placeholder="请求 URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-700 text-white"
              />
              <Textarea
                placeholder='请求头 (JSON 格式，例如: {"Content-Type": "application/json"} )'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={3}
                className="w-full bg-gray-700 text-white"
              />
              <Textarea
                placeholder='请求体 (JSON 格式，例如: {"name": "John Doe"} )'
                value={data}
                onChange={(e) => setData(e.target.value)}
                rows={4}
                className="w-full bg-gray-700 text-white"
              />
              <div className="flex space-x-4">
                <Input
                  type="number"
                  placeholder="超时时间 (ms)"
                  value={timeout}
                  onChange={(e) => setTimeoutValue(Number(e.target.value))}
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  type="number"
                  placeholder="重试次数"
                  value={retries}
                  onChange={(e) => setRetries(Number(e.target.value))}
                  className="w-full bg-gray-700 text-white"
                />
                <Input
                  type="number"
                  placeholder="重试延迟 (ms)"
                  value={retryDelay}
                  onChange={(e) => setRetryDelay(Number(e.target.value))}
                  className="w-full bg-gray-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="rejectUnauthorized">拒绝未经授权:</label>
                <input
                  type="checkbox"
                  id="rejectUnauthorized"
                  checked={rejectUnauthorized}
                  onChange={(e) => setRejectUnauthorized(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                保存模板
              </Button>
            </motion.div>
            {/* 搜索框 */}
            <Input
              placeholder="搜索模板..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-700 text-white"
            />
            {/* 模板列表 */}
            <AnimatePresence>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template, index) => (
                    <motion.li
                      key={template.name}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
                    >
                      {editingTemplate === template.name ? (
                        <div className="w-full space-y-2">
                          <Input
                            placeholder="模板名称"
                            value={editValues.name}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                name: e.target.value,
                              })
                            }
                            className="w-full bg-gray-700 text-white"
                          />
                          <Input
                            placeholder="请求方法"
                            value={editValues.method}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                method: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full bg-gray-700 text-white"
                          />
                          <Input
                            placeholder="请求 URL"
                            value={editValues.url}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                url: e.target.value,
                              })
                            }
                            className="w-full bg-gray-700 text-white"
                          />
                          <Textarea
                            placeholder="请求头 (JSON 格式)"
                            value={editValues.headers}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                headers: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full bg-gray-700 text-white"
                          />
                          <Textarea
                            placeholder="请求体 (JSON 格式)"
                            value={editValues.data}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                data: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full bg-gray-700 text-white"
                          />
                          <div className="flex space-x-4">
                            <Input
                              type="number"
                              placeholder="超时时间 (ms)"
                              value={editValues.timeout}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  timeout: Number(e.target.value),
                                })
                              }
                              className="w-full bg-gray-700 text-white"
                            />
                            <Input
                              type="number"
                              placeholder="重试次数"
                              value={editValues.retries}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  retries: Number(e.target.value),
                                })
                              }
                              className="w-full bg-gray-700 text-white"
                            />
                            <Input
                              type="number"
                              placeholder="重试延迟 (ms)"
                              value={editValues.retryDelay}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  retryDelay: Number(e.target.value),
                                })
                              }
                              className="w-full bg-gray-700 text-white"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label htmlFor="editRejectUnauthorized">
                              拒绝未经授权:
                            </label>
                            <input
                              type="checkbox"
                              id="editRejectUnauthorized"
                              checked={editValues.rejectUnauthorized}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  rejectUnauthorized: e.target.checked,
                                })
                              }
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleUpdate}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              保存
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => setEditingTemplate(null)}
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {template.config.method} {template.config.url}
                            </p>
                          </div>
                          {!BUILT_IN_TEMPLATES.some(
                            (bt) => bt.name === template.name
                          ) && (
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                onClick={() => handleEdit(template)}
                                className="text-yellow-400 hover:text-yellow-500"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleRemove(template.name)}
                                className="text-red-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.li>
                  ))
                ) : (
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-500"
                  >
                    无匹配的模板。
                  </motion.li>
                )}
              </motion.ul>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
