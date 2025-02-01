"use client";

import React, { useState } from "react";
import { useSequencerStore } from "@/store/useSequencerStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, StopCircle, ChevronDown, Loader2, Save } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { TargetSettings } from "@/store/useSequencerStore";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface AdvancedSettings {
  retryCount: number;
  timeout: number;
  priority: "low" | "medium" | "high";
  colorTheme: string;
}

interface TargetControlsState {
  isSaving: boolean;
  errors: {
    delayStart?: string;
    retryCount?: string;
    timeout?: string;
    [key: string]: string | undefined;
  };
  advancedSettings: {
    retryCount: number;
    timeout: number;
    priority: "low" | "medium" | "high";
    colorTheme: string;
    autoRetry: boolean;
    notifyOnComplete: boolean;
    maxParallel: number;
    logLevel: "debug" | "info" | "warn" | "error";
  };
  presets: Array<{
    id: string;
    name: string;
    settings: any;
    createdAt: Date;
    lastUsed?: Date;
  }>;
}

export function TargetControls() {
  const {
    settings,
    setSetting,
    saveSettings,
    resetSettings,
    // Rename store error to avoid conflict with local state errors
    errors: storeErrors,
    notifications,
    isRunning,
    currentProgress,
  } = useSequencerStore();
  const [state, setState] = useState<TargetControlsState>({
    isSaving: false,
    errors: {},
    advancedSettings: {
      retryCount: 3,
      timeout: 60,
      priority: "medium",
      colorTheme: "default",
      autoRetry: true,
      notifyOnComplete: true,
      maxParallel: 2,
      logLevel: "info",
    },
    presets: [],
  });
  const [presets, setPresets] = React.useState<
    Array<{ name: string; settings: TargetSettings & AdvancedSettings }>
  >([]);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null
  );
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleSavePreset = () => {
    const presetName = prompt("请输入预设名称");
    if (presetName) {
      const newPreset = {
        name: presetName,
        settings: { ...settings, ...state.advancedSettings },
      };
      setPresets((prev) => [...prev, newPreset]);
    }
  };

  const handleLoadPreset = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      Object.entries(preset.settings).forEach(([key, value]) => {
        if (key in settings) {
          setSetting(key as keyof TargetSettings, value);
        } else {
          handleAdvancedChange(key as keyof AdvancedSettings, value);
        }
      });
      setSelectedPreset(presetName);
    }
  };
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isExpanded, setIsExpanded] = React.useState(!isMobile);

  const handleChange = (field: keyof TargetSettings, value: string) => {
    setSetting(field, value);
  };

  const handleAdvancedChange = (
    field: keyof AdvancedSettings,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      advancedSettings: {
        ...prev.advancedSettings,
        [field]: value,
      },
    }));
  };

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      await saveSettings();
    } catch (error) {
      // 错误已经在 store 中处理
    }
  };

  // 添加验证函数
  const validateSettings = (settings: any) => {
    const errors: Record<string, string> = {};
    if (settings.delayStart < 0) {
      errors.delayStart = "延迟开始时间不能为负数";
    }
    if (settings.retryCount < 0 || settings.retryCount > 10) {
      errors.retryCount = "重试次数必须在0-10之间";
    }
    if (settings.timeout < 0 || settings.timeout > 3600) {
      errors.timeout = "超时时间必须在0-3600秒之间";
    }
    return errors;
  };

  // 按钮点击动画变体
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    focus: { scale: 1.02 },
  };

  // 面板动画变体
  const panelVariants = {
    expanded: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    collapsed: {
      opacity: 0,
      height: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="p-4 bg-gray-900 rounded-md shadow-md space-y-4">
      <motion.div
        className="bg-gray-900/50 rounded-lg border border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        layout
      >
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center p-3 hover:bg-gray-800/50"
            >
              <span className="text-sm font-medium">目标控制</span>
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </CollapsibleTrigger>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <CollapsibleContent className="p-3 space-y-4">
                  {/* Control Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Label
                        htmlFor="delay-start"
                        className="text-sm text-gray-400"
                      >
                        延迟开始
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="delay-start"
                          type="number"
                          value={settings.delayStart}
                          onChange={(e) =>
                            handleChange("delayStart", e.target.value)
                          }
                          className={`w-20 bg-gray-800 border ${
                            state.errors.delayStart
                              ? "border-red-500"
                              : "border-gray-700"
                          } text-white`}
                        />
                        <span className="text-gray-400">秒</span>
                      </div>
                      {state.errors.delayStart && (
                        <span className="text-red-500 text-sm">
                          {state.errors.delayStart}
                        </span>
                      )}
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Label
                        htmlFor="sequence-mode"
                        className="text-sm text-gray-400"
                      >
                        序列模式
                      </Label>
                      <Select
                        value={settings.sequenceMode}
                        onValueChange={(value) =>
                          handleChange("sequenceMode", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="one-after-another">
                            一个接一个
                          </SelectItem>
                          <SelectItem value="simultaneous">
                            同时进行
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Label className="text-sm text-gray-400">
                        预计下载时间
                      </Label>
                      <div className="text-white mt-1">
                        {settings.estimatedDownload}
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Label
                        htmlFor="retry-count"
                        className="text-sm text-gray-400"
                      >
                        重试次数
                      </Label>
                      <Input
                        id="retry-count"
                        type="number"
                        value={settings.retryCount || 0}
                        onChange={(e) =>
                          handleChange("retryCount", e.target.value)
                        }
                        className={`w-20 bg-gray-800 border ${
                          state.errors.retryCount
                            ? "border-red-500"
                            : "border-gray-700"
                        } text-white mt-1`}
                      />
                      {state.errors.retryCount && (
                        <span className="text-red-500 text-sm">
                          {state.errors.retryCount}
                        </span>
                      )}
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Label
                        htmlFor="timeout"
                        className="text-sm text-gray-400"
                      >
                        超时时间
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="timeout"
                          type="number"
                          value={settings.timeout || 0}
                          onChange={(e) =>
                            handleChange("timeout", e.target.value)
                          }
                          className={`w-20 bg-gray-800 border ${
                            state.errors.timeout
                              ? "border-red-500"
                              : "border-gray-700"
                          } text-white`}
                        />
                        <span className="text-gray-400">秒</span>
                      </div>
                      {state.errors.timeout && (
                        <span className="text-red-500 text-sm">
                          {state.errors.timeout}
                        </span>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-lg font-medium text-gray-400 mb-4">
                      高级设置
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Label
                          htmlFor="priority"
                          className="text-sm text-gray-400"
                        >
                          任务优先级
                        </Label>
                        <Select
                          value={state.advancedSettings.priority}
                          onValueChange={(value) =>
                            handleAdvancedChange("priority", value)
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="low">低</SelectItem>
                            <SelectItem value="medium">中</SelectItem>
                            <SelectItem value="high">高</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Label
                          htmlFor="color-theme"
                          className="text-sm text-gray-400"
                        >
                          颜色主题
                        </Label>
                        <Select
                          value={state.advancedSettings.colorTheme}
                          onValueChange={(value) =>
                            handleAdvancedChange("colorTheme", value)
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="default">默认</SelectItem>
                            <SelectItem value="dark">暗黑</SelectItem>
                            <SelectItem value="light">明亮</SelectItem>
                            <SelectItem value="blue">蓝色</SelectItem>
                            <SelectItem value="green">绿色</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="grid gap-4 md:grid-cols-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.2,
                        },
                      },
                    }}
                    layout
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Label className="text-sm text-gray-400">
                        预计完成时间
                      </Label>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                          <div className="text-xs text-gray-500">从</div>
                          <Input
                            type="time"
                            value={settings.startTime}
                            onChange={(e) =>
                              handleChange("startTime", e.target.value)
                            }
                            className="bg-gray-800 border-gray-700 text-white mt-1"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">到</div>
                          <Input
                            type="time"
                            value={settings.endTime}
                            onChange={(e) =>
                              handleChange("endTime", e.target.value)
                            }
                            className="bg-gray-800 border-gray-700 text-white mt-1"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        持续时间: {settings.duration}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-lg font-medium text-gray-400 mb-4">
                      预设管理
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Select
                        value={selectedPreset || ""}
                        onValueChange={handleLoadPreset}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="选择预设" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {presets.map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleSavePreset}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        保存当前为预设
                      </Button>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    <motion.div
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      layout
                    >
                      <Button
                        onClick={handleSave}
                        disabled={isRunning}
                        className="bg-teal-500 text-white hover:bg-teal-600"
                      >
                        {state.isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        保存设置
                      </Button>
                      <Button
                        onClick={resetSettings}
                        variant="destructive"
                        className="text-white hover:bg-red-600"
                      >
                        <X className="mr-2 h-4 w-4" />
                        重置默认
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-white bg-blue-500 hover:bg-blue-600"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        立即执行
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-white bg-orange-500 hover:bg-orange-600"
                      >
                        <StopCircle className="mr-2 h-4 w-4" />
                        停止执行
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </CollapsibleContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Collapsible>
      </motion.div>
    </div>
  );
}
