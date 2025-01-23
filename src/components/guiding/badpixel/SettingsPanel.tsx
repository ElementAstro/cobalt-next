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
import { Globe, RefreshCcw, Clock, Save } from "lucide-react";
import { motion } from "framer-motion";

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
            onCheckedChange={(checked) => setOptions({ autoRefresh: checked })}
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
    </motion.div>
  );
}
