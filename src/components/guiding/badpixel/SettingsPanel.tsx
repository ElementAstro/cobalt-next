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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="language-select">语言</Label>
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
        <Label htmlFor="auto-refresh">自动刷新</Label>
        <Switch
          id="auto-refresh"
          checked={options.autoRefresh}
          onCheckedChange={(checked) => setOptions({ autoRefresh: checked })}
        />
      </div>
      {options.autoRefresh && (
        <div className="space-y-2">
          <Label>刷新间隔 (ms)</Label>
          <Slider
            value={[options.refreshInterval]}
            onValueChange={([value]) => handleRefreshIntervalChange(value)}
            min={1000}
            max={10000}
            step={100}
          />
          <div className="text-sm text-gray-500">
            当前值: {options.refreshInterval}ms
          </div>
        </div>
      )}
    </div>
  );
}
