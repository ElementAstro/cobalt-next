import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RotateCcw } from "lucide-react";
import { useAdvancedSettingsStore } from "@/lib/store/server";

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

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = () => {
    saveSettings();
    handleSaveConfig();
  };

  const handleLoad = () => {
    loadSettings();
    handleLoadConfig();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          保存配置
        </Button>
        <Button variant="outline" onClick={handleLoad}>
          <RotateCcw className="w-4 h-4 mr-2" />
          加载配置
        </Button>
      </div>
      <div className="space-y-2">
        <Label>连接超时（秒）</Label>
        <Input
          type="number"
          value={connectionTimeout}
          onChange={(e) =>
            updateSettings({ connectionTimeout: parseInt(e.target.value, 10) })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>最大重试次数</Label>
        <Input
          type="number"
          value={maxRetries}
          onChange={(e) =>
            updateSettings({ maxRetries: parseInt(e.target.value, 10) })
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="debug"
          checked={debugMode}
          onCheckedChange={(checked) => updateSettings({ debugMode: checked })}
        />
        <Label htmlFor="debug">启用调试模式</Label>
      </div>
    </div>
  );
}
