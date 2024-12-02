"use client";

import { useState, useEffect } from "react";
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

interface TargetSettings {
  delayStart: string;
  sequenceMode: string;
  estimatedDownload: string;
  startTime: string;
  endTime: string;
  duration: string;
}

const DEFAULT_SETTINGS: TargetSettings = {
  delayStart: "0",
  sequenceMode: "one-after-another",
  estimatedDownload: "00:00:00",
  startTime: "15:39:51",
  endTime: "15:39:52",
  duration: "01s",
};

export function TargetControls() {
  const [settings, setSettings] = useState<TargetSettings>(DEFAULT_SETTINGS);
  const [errors, setErrors] = useState<{
    [key in keyof TargetSettings]?: string;
  }>({});

  useEffect(() => {
    const savedSettings = localStorage.getItem("targetSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (field: keyof TargetSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    // 简单验证
    if (field === "delayStart" && (isNaN(Number(value)) || Number(value) < 0)) {
      setErrors((prev) => ({ ...prev, delayStart: "延迟开始必须是非负数" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = () => {
    localStorage.setItem("targetSettings", JSON.stringify(settings));
    alert("设置已保存");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setErrors({});
    localStorage.removeItem("targetSettings");
  };

  return (
    <div className="space-y-6 bg-gray-900/50 p-6 rounded-lg border border-gray-800 transition-transform transform hover:scale-105">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="delay-start" className="text-sm text-gray-400">
            延迟开始
          </Label>
          <div className="flex items-center gap-2">
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
        </div>
        <div>
          <Label htmlFor="sequence-mode" className="text-sm text-gray-400">
            序列模式
          </Label>
          <Select
            value={settings.sequenceMode}
            onValueChange={(value) => handleChange("sequenceMode", value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="one-after-another">一个接一个</SelectItem>
              <SelectItem value="simultaneous">同时进行</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm text-gray-400">预计下载时间</Label>
          <div className="text-white">{settings.estimatedDownload}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm text-gray-400">预计完成时间</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">从</div>
              <Input
                type="time"
                value={settings.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500">到</div>
              <Input
                type="time"
                value={settings.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            持续时间: {settings.duration}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={handleSave} className="bg-teal-500 text-white">
          保存设置
        </Button>
        <Button
          onClick={handleReset}
          variant="destructive"
          className="text-white"
        >
          重置默认
        </Button>
      </div>
    </div>
  );
}
