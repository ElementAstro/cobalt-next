"use client";

import React from "react";
import { useTargetStore } from "@/lib/store/sequencer";
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
import { Check, X } from "lucide-react";

interface TargetSettings {
  delayStart: string;
  sequenceMode: string;
  estimatedDownload: string;
  startTime: string;
  endTime: string;
  duration: string;
}

export function TargetControls() {
  const { settings, setSetting, saveSettings, resetSettings } =
    useTargetStore();

  const [errors, setErrors] = React.useState<{
    [key in keyof TargetSettings]?: string;
  }>({});

  const handleChange = (field: keyof TargetSettings, value: string) => {
    setSetting(field, value);
    // 简单验证
    if (field === "delayStart" && (isNaN(Number(value)) || Number(value) < 0)) {
      setErrors((prev) => ({ ...prev, delayStart: "延迟开始必须是非负数" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      className="space-y-6 bg-gray-900/50 p-6 rounded-lg border border-gray-800 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
            <span className="text-red-500 text-sm">{errors.delayStart}</span>
          )}
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Label htmlFor="sequence-mode" className="text-sm text-gray-400">
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
              <SelectItem value="one-after-another">一个接一个</SelectItem>
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
          <div className="text-white mt-1">{settings.estimatedDownload}</div>
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
                onChange={(e) => handleChange("startTime", e.target.value)}
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
        >
          <Button onClick={saveSettings} className="bg-teal-500 text-white">
            保存设置
          </Button>
          <Button
            onClick={resetSettings}
            variant="destructive"
            className="text-white"
          >
            重置默认
          </Button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
