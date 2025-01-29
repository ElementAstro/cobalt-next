"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useGuidingStore } from "@/store/useGuidingStore";
import { toast } from "@/hooks/use-toast";

export default function SettingsDialog() {
  const { settings, setSettings } = useGuidingStore();
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleReset = () => {
    setLocalSettings(settings);
    toast({
      title: "设置已重置",
      description: "已恢复到最后保存的设置",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 验证基本参数
      if (localSettings.radius <= 0) throw new Error("搜星半径必须大于0");
      if (localSettings.exposureTime < 100)
        throw new Error("曝光时间不能小于100ms");

      // 模拟异步保存
      await new Promise((r) => setTimeout(r, 500));

      setSettings(localSettings);

      toast({
        title: "设置已保存",
        description: "所有更改已成功应用",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description:
          error instanceof Error ? error.message : "保存设置时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          系统设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>系统设置</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <Tabs defaultValue="interface">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="interface">界面</TabsTrigger>
              <TabsTrigger value="display">显示</TabsTrigger>
              <TabsTrigger value="advanced">高级</TabsTrigger>
            </TabsList>

            <TabsContent value="interface" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>主题设置</Label>
                  <Select
                    value={localSettings.colorScheme}
                    onValueChange={(value: "dark" | "light") =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        colorScheme: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">深色</SelectItem>
                      <SelectItem value="light">浅色</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>动画速度</Label>
                  <Slider
                    value={[localSettings.animationSpeed]}
                    onValueChange={([value]) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        animationSpeed: value,
                      }))
                    }
                    min={0.1}
                    max={2}
                    step={0.1}
                  />
                </div>
              </div>
              {/* ...more interface settings... */}
            </TabsContent>

            {/* ...existing tabs content... */}
          </Tabs>

          <DialogFooter className="mt-6 space-x-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
