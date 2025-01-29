"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBadPixelStore } from "@/store/guiding/useBadPixelStore";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Globe, RefreshCcw, Clock, Save, Shield, Database, Cloud, History } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

export default function SettingsPanel() {
  const { toast } = useToast();
  const { options, setOptions } = useBadPixelStore();

  const handleRefreshIntervalChange = (value: number) => {
    if (value < 1000) {
      toast({
        title: "刷新间隔过短",
        description: "刷新间隔不能小于 1000ms",
        variant: "destructive",
      });
      return;
    }
    setOptions({ refreshInterval: value });
    toast({
      title: "已更新刷新间隔",
      description: `自动刷新间隔已设置为 ${value}ms`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-4 bg-gray-800/50 backdrop-blur rounded-lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <Label htmlFor="language-select">界面语言</Label>
            </div>
            <Select
              value={options.language}
              onValueChange={(value: "zh" | "en") =>
                setOptions({ language: value })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-green-400" />
              <Label htmlFor="auto-refresh">自动刷新</Label>
            </div>
            <Switch
              id="auto-refresh"
              checked={options.autoRefresh}
              onCheckedChange={(checked) =>
                setOptions({ autoRefresh: checked })
              }
            />
          </div>

          {options.autoRefresh && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pl-6"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <Label>刷新间隔</Label>
              </div>
              <Slider
                value={[options.refreshInterval]}
                onValueChange={([value]) => handleRefreshIntervalChange(value)}
                min={1000}
                max={10000}
                step={100}
                className="my-4"
              />
              <div className="text-sm text-gray-400 flex items-center justify-between">
                <span>当前间隔:</span>
                <span>{options.refreshInterval}ms</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>显示模式</Label>
            <Select
              value={options.displayMode}
              onValueChange={(value: "scatter" | "heatmap" | "grid") =>
                setOptions({ displayMode: value })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择显示模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter">散点图</SelectItem>
                <SelectItem value="heatmap">热力图</SelectItem>
                <SelectItem value="grid">网格图</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>显示覆盖层</Label>
            <Toggle
              pressed={options.showOverlay}
              onPressedChange={(pressed) =>
                setOptions({ showOverlay: pressed })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>过滤阈值</Label>
            <Slider
              value={[options.filterThreshold]}
              onValueChange={([value]) =>
                setOptions({ filterThreshold: value })
              }
              min={1}
              max={10}
              step={0.1}
              className="my-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>暗场校正</Label>
            <Toggle
              pressed={options.darkFrameEnabled}
              onPressedChange={(pressed) =>
                setOptions({ darkFrameEnabled: pressed })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>自动保存</Label>
            <Toggle
              pressed={options.autoSave}
              onPressedChange={(pressed) => setOptions({ autoSave: pressed })}
            />
          </div>

          {options.autoSave && (
            <div className="space-y-2">
              <Label>保存间隔 (毫秒)</Label>
              <Input
                type="number"
                value={options.saveInterval}
                onChange={(e) =>
                  setOptions({ saveInterval: parseInt(e.target.value) })
                }
                min={1000}
                step={1000}
              />
            </div>
          )}
        </div>

        {/* 新增：高级设置区域 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <Label>高级模式</Label>
            </div>
            <Switch
              checked={options.advancedMode}
              onCheckedChange={(checked) => setOptions({ advancedMode: checked })}
            />
          </div>

          {options.advancedMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pl-6"
            >
              <div className="space-y-2">
                <Label>坏点检测敏感度</Label>
                <Slider
                  value={[options.sensitivity]}
                  onValueChange={([value]) => setOptions({ sensitivity: value })}
                  min={1}
                  max={10}
                  step={0.1}
                  className="my-4"
                />
              </div>

              <div className="space-y-2">
                <Label>热点阈值</Label>
                <Input
                  type="number"
                  value={options.hotPixelThreshold}
                  onChange={(e) => setOptions({ hotPixelThreshold: parseInt(e.target.value) })}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* 新增：数据管理 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <Label>数据管理</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setOptions({ autoBackup: !options.autoBackup })}>
              <Cloud className="w-4 h-4 mr-2" />
              自动备份
            </Button>
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" />
              历史记录
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
