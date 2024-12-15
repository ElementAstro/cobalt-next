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
import { useBadPixelStore } from "@/lib/store/guiding/bad-pixel";

export default function SettingsPanel() {
  const { options, setOptions } = useBadPixelStore();

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
        <div className="flex items-center justify-between">
          <Label htmlFor="refresh-interval">刷新间隔 (ms)</Label>
          <input
            id="refresh-interval"
            type="number"
            value={options.refreshInterval}
            onChange={(e) =>
              setOptions({ refreshInterval: parseInt(e.target.value) })
            }
            className="w-24 p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
          />
        </div>
      )}
    </div>
  );
}
