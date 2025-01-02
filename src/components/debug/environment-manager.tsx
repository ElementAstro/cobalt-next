"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Edit2,
  Save,
  X,
  RefreshCw,
  Plus,
  Search,
  Download,
  Upload,
  AlertCircle,
  Zap,
  Folder,
  FolderOpen,
  History,
  Type,
  Check,
  ChevronDown,
  ChevronUp,
  Settings,
  Palette,
  LayoutGrid,
  List,
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [groupingEnabled, setGroupingEnabled] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [variableType, setVariableType] = useState<
    "string" | "number" | "boolean"
  >("string");
  const [history, setHistory] = useState<Array<Record<string, string>>>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

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
      // Validate value based on selected type
      let validatedValue = value.trim();
      try {
        if (variableType === "number") {
          validatedValue = String(Number(value));
          if (isNaN(Number(value))) {
            throw new Error("Invalid number");
          }
        } else if (variableType === "boolean") {
          const lowerValue = value.toLowerCase();
          if (!["true", "false"].includes(lowerValue)) {
            throw new Error("Invalid boolean");
          }
          validatedValue = lowerValue;
        }
      } catch (error) {
        alert(
          `类型验证失败: ${error instanceof Error ? error.message : "未知错误"}`
        );
        return;
      }

      // Add to history
      setHistory((prev) =>
        [{ [key.trim()]: validatedValue }, ...prev].slice(0, 50)
      );

      addVariable(key.trim(), validatedValue);
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
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
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
        stiffness: 120,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 300 },
    },
    tap: {
      scale: 0.98,
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, rotate: [0, -2, 2, -2, 2, 0] },
    tap: { scale: 0.95 },
    whileFocus: { scale: 1.1 },
  };

  const iconVariants = {
    hover: { rotate: 15, scale: 1.1 },
    tap: { rotate: -15, scale: 0.9 },
    whileFocus: { scale: 1.2 },
  };

  const groupedVariables = useMemo(() => {
    if (!groupingEnabled) return null;

    const groups: Record<string, [string, string][]> = {};
    Object.entries(environment).forEach(([key, value]) => {
      const group = key.split("_")[0];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push([key, value]);
    });

    return groups;
  }, [environment, groupingEnabled]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  return (
    <main
      className={`p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen transition-colors duration-300`}
    >
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
                variant="ghost"
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                className="text-gray-400 hover:text-gray-500"
              >
                <motion.span variants={iconVariants} className="inline-block">
                  <Palette className="w-5 h-5 mr-1" />
                </motion.span>
                主题
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                variant="ghost"
                onClick={() =>
                  setViewMode((prev) => (prev === "list" ? "grid" : "list"))
                }
                className="text-gray-400 hover:text-gray-500"
              >
                <motion.span variants={iconVariants} className="inline-block">
                  {viewMode === "list" ? (
                    <LayoutGrid className="w-5 h-5 mr-1" />
                  ) : (
                    <List className="w-5 h-5 mr-1" />
                  )}
                </motion.span>
                视图
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                variant="ghost"
                onClick={() => setGroupingEnabled(!groupingEnabled)}
                className={`text-gray-400 hover:text-gray-500 ${
                  groupingEnabled ? "bg-gray-700" : ""
                }`}
              >
                <motion.span variants={iconVariants} className="inline-block">
                  {groupingEnabled ? (
                    <FolderOpen className="w-5 h-5 mr-1" />
                  ) : (
                    <Folder className="w-5 h-5 mr-1" />
                  )}
                </motion.span>
                分组
              </Button>
            </motion.div>
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
            <div className="relative">
              <select
                value={variableType}
                onChange={(e) =>
                  setVariableType(
                    e.target.value as "string" | "number" | "boolean"
                  )
                }
                className="bg-gray-700 text-white p-2 pr-8 rounded appearance-none focus:outline-none"
              >
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔值</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
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
            {viewMode === "list" ? (
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                {groupedVariables && groupingEnabled ? (
                  Object.entries(groupedVariables).map(([group, variables]) => (
                    <motion.li
                      key={group}
                      variants={itemVariants}
                      className="bg-gray-700 p-4 rounded"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleGroup(group)}
                      >
                        <div className="flex items-center">
                          <motion.span
                            variants={iconVariants}
                            className="inline-block mr-2"
                          >
                            {expandedGroups.has(group) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </motion.span>
                          <span className="text-lg font-medium">{group}</span>
                        </div>
                        <span className="text-gray-400">
                          {variables.length} 个变量
                        </span>
                      </div>
                      <AnimatePresence>
                        {expandedGroups.has(group) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 space-y-4"
                          >
                            {variables.map(([k, v]) => (
                              <motion.div
                                key={k}
                                variants={itemVariants}
                                className="bg-gray-600 p-3 rounded flex justify-between items-center"
                              >
                                <span
                                  className="cursor-pointer hover:text-blue-400 transition-colors"
                                  onClick={() => handleCopy(`${k}: ${v}`)}
                                >
                                  <strong>{k}</strong>: {v}
                                </span>
                                <div className="flex space-x-2">
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
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))
                ) : filteredEnvironment.length > 0 ? (
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
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredEnvironment.map(([k, v]) => (
                  <motion.div
                    key={k}
                    variants={itemVariants}
                    className="bg-gray-700 p-4 rounded-lg flex flex-col space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">{k}</span>
                      <div className="flex space-x-2">
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
                    </div>
                    <div
                      className="cursor-pointer hover:text-blue-400 transition-colors"
                      onClick={() => handleCopy(`${k}: ${v}`)}
                    >
                      {v}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {Object.keys(environment).length > 0 && (
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="reset">
                <AccordionTrigger>高级操作</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      onClick={resetEnvironment}
                      className="bg-red-600 hover:bg-red-700 flex items-center w-full"
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

                  {history.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">历史记录</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {history.map((entry, index) => (
                          <div key={index} className="bg-gray-700 p-2 rounded">
                            {Object.entries(entry).map(([k, v]) => (
                              <div key={k} className="text-sm">
                                <span className="font-medium">{k}</span>: {v}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
