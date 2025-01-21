"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RotateCcw, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAdvancedSettingsStore } from "@/store/useConnectionStore";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  connectionTimeout: z.number().min(1).max(300),
  maxRetries: z.number().min(1).max(10),
  debugMode: z.boolean(),
});

interface AdvancedSettingsProps {
  handleSaveConfig: () => void;
  handleLoadConfig: () => void;
}

export function AdvancedSettings({
  handleSaveConfig,
  handleLoadConfig,
}: AdvancedSettingsProps) {
  const {
    connectionTimeout,
    maxRetries,
    debugMode,
    updateSettings,
    saveSettings,
    loadSettings,
  } = useAdvancedSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const validateSettings = () => {
    try {
      settingsSchema.parse({
        connectionTimeout,
        maxRetries,
        debugMode,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setIsLoading(true);
    setSaveStatus("idle");
    try {
      await saveSettings();
      await handleSaveConfig();
      setSaveStatus("success");
      toast({
        title: "配置保存成功",
        description: "高级设置已成功保存",
        variant: "default",
      });
    } catch (error) {
      setSaveStatus("error");
      toast({
        title: "配置保存失败",
        description: "保存高级设置时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      await loadSettings();
      await handleLoadConfig();
      toast({
        title: "配置加载成功",
        description: "高级设置已成功加载",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "配置加载失败",
        description: "加载高级设置时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span>连接超时（秒）</span>
            {errors.connectionTimeout && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </Label>
          <Input
            type="number"
            value={connectionTimeout}
            onChange={(e) =>
              updateSettings({ connectionTimeout: parseInt(e.target.value, 10) })
            }
            className={errors.connectionTimeout ? "border-red-500" : ""}
          />
          {errors.connectionTimeout && (
            <p className="text-sm text-red-500">{errors.connectionTimeout}</p>
          )}
          <p className="text-sm text-muted-foreground">
            设置连接超时时间（1-300秒）
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span>最大重试次数</span>
            {errors.maxRetries && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </Label>
          <Input
            type="number"
            value={maxRetries}
            onChange={(e) =>
              updateSettings({ maxRetries: parseInt(e.target.value, 10) })
            }
            className={errors.maxRetries ? "border-red-500" : ""}
          />
          {errors.maxRetries && (
            <p className="text-sm text-red-500">{errors.maxRetries}</p>
          )}
          <p className="text-sm text-muted-foreground">
            设置最大重试次数（1-10次）
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="debug"
          checked={debugMode}
          onCheckedChange={(checked) => updateSettings({ debugMode: checked })}
        />
        <Label htmlFor="debug">启用调试模式</Label>
      </div>

      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          onClick={handleSave}
          className="flex-1 mr-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : saveStatus === "success" ? (
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          保存配置
        </Button>
        <Button
          variant="outline"
          onClick={handleLoad}
          className="flex-1 ml-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          加载配置
        </Button>
      </div>
    </div>
  );
}
