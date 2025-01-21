"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

  // Zod schema for validation
  const variableSchema = z.object({
    key: z.string()
      .min(2, "键名至少需要2个字符")
      .max(50, "键名最多50个字符")
      .regex(/^[A-Z_][A-Z0-9_]*$/i, "键名必须以字母或下划线开头，只能包含字母、数字和下划线"),
    value: z.string()
      .min(1, "值不能为空")
      .max(500, "值最多500个字符"),
    type: z.enum(["string", "number", "boolean"])
  });

  type VariableForm = z.infer<typeof variableSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue: setFormValue,
    watch,
    formState: { errors }
  } = useForm<VariableForm>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      key: "",
      value: "",
      type: "string"
    }
  });

  const [search, setSearch] = useState<string>("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [groupingEnabled, setGroupingEnabled] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<Array<Record<string, string>>>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  const onSubmit = (data: VariableForm) => {
    let validatedValue = data.value.trim();
    
    // Additional type-specific validation
    if (data.type === "number") {
      if (isNaN(Number(data.value))) {
        alert("请输入有效的数字");
        return;
      }
      validatedValue = String(Number(data.value));
    } else if (data.type === "boolean") {
      const lowerValue = data.value.toLowerCase();
      if (!["true", "false"].includes(lowerValue)) {
        alert("请输入true或false");
        return;
      }
      validatedValue = lowerValue;
    }

    // Add to history
    setHistory((prev) =>
      [{ [data.key]: validatedValue }, ...prev].slice(0, 50)
    );

    addVariable(data.key, validatedValue);
    reset();
    alert("变量添加成功");
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
      // Validate based on variable type
      const type = watch("type");
      let validatedValue = editValue.trim();
      
      if (type === "number") {
        if (isNaN(Number(editValue))) {
          alert("请输入有效的数字");
          return;
        }
        validatedValue = String(Number(editValue));
      } else if (type === "boolean") {
        const lowerValue = editValue.toLowerCase();
        if (!["true", "false"].includes(lowerValue)) {
          alert("请输入true或false");
          return;
        }
        validatedValue = lowerValue;
      }

      updateVariable(keyToUpdate, validatedValue);
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
      <Card className="bg-gray-800/95 backdrop-blur-sm text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-700/50">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-auto">
                <select
                  {...register("type")}
                  className="bg-gray-700 text-white p-2 pr-8 rounded appearance-none focus:outline-none w-full"
                >
                  <option value="string">字符串</option>
                  <option value="number">数字</option>
                  <option value="boolean">布尔值</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="w-full">
                <Input
                  placeholder="键"
                  {...register("key")}
                  className="bg-gray-700 text-white"
                />
                {errors.key && (
                  <p className="text-red-400 text-sm mt-1">{errors.key.message}</p>
                )}
              </div>

              <div className="w-full">
                <Input
                  placeholder="值"
                  {...register("value")}
                  className="bg-gray-700 text-white"
                />
                {errors.value && (
                  <p className="text-red-400 text-sm mt-1">{errors.value.message}</p>
                )}
              </div>

              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  <motion.span variants={iconVariants} className="inline-block">
                    <Plus className="w-5 h-5 mr-1" />
                  </motion.span>
                  添加
                </Button>
              </motion.div>
            </div>
          </form>
          <div className="mb-6">
            <motion.div
              className="relative w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Input
                placeholder="搜索变量..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-700 text-white pl-10"
              />
              <motion.div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                animate={{
                  rotate: search ? 10 : 0,
                  scale: search ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="w-5 h-5 text-gray-400" />
              </motion.div>
              {search && (
                <motion.button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearch("")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
                </motion.button>
              )}
            </motion.div>
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
