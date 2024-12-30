"use client";

import React from "react";
import { useTargetStore } from "@/store/useSequencerStore";
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
import { Check, X, Clock, Download, Play, StopCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { TargetSettings } from "@/store/useSequencerStore";

export function TargetControls() {
  const { settings, setSetting, saveSettings, resetSettings } =
    useTargetStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [errors, setErrors] = React.useState<{
    [key in keyof TargetSettings]?: string;
  }>({});
  const [isExpanded, setIsExpanded] = React.useState(!isMobile);

  const handleChange = (field: keyof TargetSettings, value: string) => {
    setSetting(field, value);

    // Validation rules
    switch (field) {
      case "delayStart":
        if (isNaN(Number(value)) || Number(value) < 0) {
          setErrors((prev) => ({
            ...prev,
            delayStart: "延迟开始必须是非负数",
          }));
        } else {
          setErrors((prev) => ({ ...prev, delayStart: undefined }));
        }
        break;
      default:
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="space-y-6 bg-gray-900/50 p-6 rounded-lg border border-gray-800 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {isMobile && (
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={toggleExpansion}
            variant="ghost"
            className="text-gray-400 hover:bg-gray-800"
          >
            {isExpanded ? "收起控制面板" : "展开控制面板"}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
            >
              ▼
            </motion.span>
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="grid gap-6 md:grid-cols-3"
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
                <Label htmlFor="delay-start" className="text-sm text-gray-400">
                  延迟开始
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="delay-start"
                    type="number"
                    value={settings.delayStart}
                    onChange={(e) => handleChange("delayStart", e.target.value)}
                    className={`w-20 bg-gray-800 border ${
                      errors.delayStart ? "border-red-500" : "border-gray-700"
                    } text-white`}
                  />
                  <span className="text-gray-400">秒</span>
                </div>
                {errors.delayStart && (
                  <span className="text-red-500 text-sm">
                    {errors.delayStart}
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
                  onValueChange={(value) => handleChange("sequenceMode", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="one-after-another">
                      一个接一个
                    </SelectItem>
                    <SelectItem value="simultaneous">同时进行</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Label className="text-sm text-gray-400">预计下载时间</Label>
                <div className="text-white mt-1">
                  {settings.estimatedDownload}
                </div>
              </motion.div>
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
                <Label className="text-sm text-gray-400">预计完成时间</Label>
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
                      onChange={(e) => handleChange("endTime", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  持续时间: {settings.duration}
                </div>
              </motion.div>
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
                  onClick={saveSettings}
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  <Check className="mr-2 h-4 w-4" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}