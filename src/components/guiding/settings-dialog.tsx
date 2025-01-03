"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Settings } from "lucide-react";
import { useGuideStore } from "@/store/useGuidingStore";

export default function SettingsDialog() {
  const { settings, setSettings } = useGuideStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 关闭对话框逻辑如果需要
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          设置
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>调整导星软件的各项设置。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="xScale">X 轴比例:</Label>
              <Select
                value={settings.xScale.toString()}
                onValueChange={(value) =>
                  setSettings({ ...settings, xScale: parseInt(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="100" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="yScale">Y 轴比例:</Label>
              <Select
                value={settings.yScale}
                onValueChange={(value) =>
                  setSettings({ ...settings, yScale: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="+/-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+/-4">+/-4"</SelectItem>
                  <SelectItem value="+/-8">+/-8"</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="exposureTime">曝光时间 (毫秒):</Label>
              <Input
                type="number"
                id="exposureTime"
                value={settings.exposureTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    exposureTime: parseInt(e.target.value),
                  })
                }
                className="w-full"
                min={1}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.trendLine}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, trendLine: checked })
                }
                id="trendLine"
              />
              <Label htmlFor="trendLine">趋势线</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.correction}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, correction: checked })
                }
                id="correction"
              />
              <Label htmlFor="correction">修正</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.autoGuide}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoGuide: checked })
                }
                id="autoGuide"
              />
              <Label htmlFor="autoGuide">自动导星</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
