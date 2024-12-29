"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trash2,
  Edit2, // 编辑图标
  Save, // 保存图标
  X, // 取消图标
  RefreshCw, // 刷新图标
  Plus, // 添加图标
  Search, // 搜索图标
  Download, // 下载图标
  Upload, // 上传图标
  AlertCircle, // 警告图标
  Zap, // 闪电图标
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebugStore } from "@/store/useDebugStore";

export default function EnvironmentManager() {
  const {
    environment,
    addVariable,
    updateVariable,
    removeVariable,
    resetEnvironment,
  } = useDebugStore();

  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // 添加模拟数据
  useEffect(() => {
    const mockData = {
      REACT_APP_API_URL: "https://api.example.com",
      REACT_APP_ENV: "production",
      REACT_APP_FEATURE_FLAG: "enabled",
      REACT_APP_TIMEOUT: "5000",
      REACT_APP_RETRIES: "3",
    };
    Object.entries(mockData).forEach(([k, v]) => addVariable(k, v));
  }, [addVariable]);

  const handleAdd = () => {
    if (key.trim() && value.trim()) {
      addVariable(key.trim(), value.trim());
      setKey("");
      setValue("");
      alert("变量添加成功");
    } else {
      alert("请填写完整的键值对");
    }
  };

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(environment, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "environment.json";
    link.click();
    URL.revokeObjectURL(url);
    alert("环境变量导出成功");
  }, [environment]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const result = e.target?.result;
            if (typeof result !== "string") {
              throw new Error("Invalid file content");
            }

            const data = JSON.parse(result);
            if (typeof data !== "object" || data === null) {
              throw new Error("Invalid JSON format");
            }

            Object.entries(data).forEach(([k, v]) => {
              if (typeof k === "string" && typeof v === "string") {
                addVariable(k, v);
              }
            });
            alert("环境变量导入成功");
          } catch (error) {
            alert(
              "文件格式错误: " +
                (error instanceof Error ? error.message : "未知错误")
            );
          }
        };
        reader.readAsText(file);
      }
    },
    [addVariable]
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板");
  }, []);

  const handleUpdate = (keyToUpdate: string) => {
    if (editValue.trim()) {
      updateVariable(keyToUpdate, editValue.trim());
      setEditingKey(null);
      setEditValue("");
    }
  };

  const handleRefresh = () => {
    resetEnvironment();
    // 重新加载模拟数据
    const mockData = {
      REACT_APP_API_URL: "https://api.example.com",
      REACT_APP_ENV: "production",
      REACT_APP_FEATURE_FLAG: "enabled",
      REACT_APP_TIMEOUT: "5000",
      REACT_APP_RETRIES: "3",
    };
    Object.entries(mockData).forEach(([k, v]) => addVariable(k, v));
  };

  const filteredEnvironment = Object.entries(environment).filter(
    ([k, v]) =>
      k.toLowerCase().includes(search.toLowerCase()) ||
      v.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const iconVariants = {
    hover: { rotate: 15 },
    tap: { rotate: -15 },
  };

  return (
    <main className="p-4 bg-gray-900 min-h-screen">
      <Card className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            环境变量管理器
          </CardTitle>
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                onClick={handleExport}
                variant="ghost"
                className="text-green-400 hover:text-green-500"
              >
                <motion.span variants={iconVariants} className="inline-block">
                  <Download className="w-5 h-5 mr-1" />
                </motion.span>
                导出
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <label htmlFor="import-file">
                <Button
                  asChild
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-500 cursor-pointer"
                >
                  <div>
                    <motion.span
                      variants={iconVariants}
                      className="inline-block"
                    >
                      <Upload className="w-5 h-5 mr-1" />
                    </motion.span>
                    导入
                  </div>
                </Button>
              </label>
              <input
                id="import-file"
                type="file"
                accept="application/json"
                onChange={handleImport}
                className="hidden"
              />
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                onClick={handleRefresh}
                variant="ghost"
                className="text-blue-400 hover:text-blue-500"
              >
                <motion.span variants={iconVariants} className="inline-block">
                  <RefreshCw className="w-5 h-5 mr-1" />
                </motion.span>
                刷新
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-6">
            <Input
              placeholder="键"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-gray-700 text-white"
            />
            <Input
              placeholder="值"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-gray-700 text-white"
            />
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                <motion.span variants={iconVariants} className="inline-block">
                  <Plus className="w-5 h-5 mr-1" />
                </motion.span>
                添加
              </Button>
            </motion.div>
          </div>
          <div className="mb-6">
            <div className="relative w-full">
              <Input
                placeholder="搜索变量..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-700 text-white pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <AnimatePresence>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4"
            >
              {filteredEnvironment.length > 0 ? (
                filteredEnvironment.map(([k, v]) => (
                  <motion.li
                    key={k}
                    variants={itemVariants}
                    className="bg-gray-700 p-4 rounded flex flex-col md:flex-row justify-between items-center"
                  >
                    {editingKey === k ? (
                      <div className="flex-1 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-gray-600 text-white"
                        />
                        <Button
                          onClick={() => handleUpdate(k)}
                          className="bg-green-600 hover:bg-green-700 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          保存
                        </Button>
                        <Button
                          onClick={() => setEditingKey(null)}
                          className="bg-red-600 hover:bg-red-700 flex items-center"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span
                          className="flex-1 text-lg cursor-pointer hover:text-blue-400 transition-colors"
                          onClick={() => handleCopy(`${k}: ${v}`)}
                        >
                          <strong>{k}</strong>: {v}
                        </span>
                        <div className="flex space-x-2 mt-2 md:mt-0">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditingKey(k);
                              setEditValue(v);
                            }}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => removeVariable(k)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.li>
                ))
              ) : (
                <motion.li
                  variants={itemVariants}
                  className="text-center text-gray-400"
                >
                  无匹配的环境变量。
                </motion.li>
              )}
            </motion.ul>
          </AnimatePresence>
          {Object.keys(environment).length > 0 && (
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="reset">
                <AccordionTrigger>高级操作</AccordionTrigger>
                <AccordionContent>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      onClick={resetEnvironment}
                      className="bg-red-600 hover:bg-red-700 flex items-center"
                    >
                      <motion.span
                        variants={iconVariants}
                        className="inline-block"
                      >
                        <AlertCircle className="w-5 h-5 mr-1" />
                      </motion.span>
                      重置所有变量
                    </Button>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
