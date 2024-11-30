import { useState } from "react";
import {
  LogLevelColor,
  LogRetentionPolicy,
  LogAlertRule,
  MockModeSettings,
} from "@/types/log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingsProps {
  logLevelColors: LogLevelColor;
  setLogLevelColors: (colors: LogLevelColor) => void;
  retentionPolicy: LogRetentionPolicy;
  setRetentionPolicy: (policy: LogRetentionPolicy) => void;
  alertRule: LogAlertRule;
  setAlertRule: (rule: LogAlertRule) => void;
  realtimeUpdates: boolean;
  setRealtimeUpdates: (enabled: boolean) => void;
  mockMode: MockModeSettings;
  setMockMode: (settings: MockModeSettings) => void;
}

export function Settings({
  logLevelColors,
  setLogLevelColors,
  retentionPolicy,
  setRetentionPolicy,
  alertRule,
  setAlertRule,
  realtimeUpdates,
  setRealtimeUpdates,
  mockMode,
  setMockMode,
}: SettingsProps) {
  const [colors, setColors] = useState(logLevelColors);
  const [retention, setRetention] = useState(retentionPolicy.days);
  const [alert, setAlert] = useState(alertRule);
  const [mock, setMock] = useState(mockMode);

  const handleColorChange = (level: keyof LogLevelColor, color: string) => {
    setColors((prev) => ({ ...prev, [level]: color }));
  };

  const handleSave = () => {
    setLogLevelColors(colors);
    setRetentionPolicy({ days: retention });
    setAlertRule(alert);
    setMockMode(mock);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>设置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">日志级别颜色</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="info-color">信息</Label>
                <Input
                  id="info-color"
                  type="color"
                  value={colors.info}
                  onChange={(e) => handleColorChange("info", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="warning-color">警告</Label>
                <Input
                  id="warning-color"
                  type="color"
                  value={colors.warning}
                  onChange={(e) => handleColorChange("warning", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="error-color">错误</Label>
                <Input
                  id="error-color"
                  type="color"
                  value={colors.error}
                  onChange={(e) => handleColorChange("error", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="retention-days">日志保留天数</Label>
            <Input
              id="retention-days"
              type="number"
              value={retention}
              onChange={(e) => setRetention(parseInt(e.target.value))}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">告警规则</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alert-level">级别</Label>
                <select
                  id="alert-level"
                  value={alert.level}
                  onChange={(e) =>
                    setAlert((prev) => ({
                      ...prev,
                      level: e.target.value as LogLevelColor,
                    }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="info">信息</option>
                  <option value="warning">警告</option>
                  <option value="error">错误</option>
                </select>
              </div>
              <div>
                <Label htmlFor="alert-keyword">关键词</Label>
                <Input
                  id="alert-keyword"
                  type="text"
                  value={alert.keyword}
                  onChange={(e) =>
                    setAlert((prev) => ({ ...prev, keyword: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="realtime-updates"
              checked={realtimeUpdates}
              onCheckedChange={setRealtimeUpdates}
            />
            <Label htmlFor="realtime-updates">实时更新</Label>
          </div>
          <div>
            <h3 className="text-lg font-medium">Mock 模式</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="mock-mode"
                  checked={mock.enabled}
                  onCheckedChange={(checked) =>
                    setMock((prev) => ({ ...prev, enabled: checked }))
                  }
                />
                <Label htmlFor="mock-mode">启用启用 Mock 模式</Label>
              </div>
              <div>
                <Label htmlFor="mock-interval">日志生成间隔（毫秒）</Label>
                <Input
                  id="mock-interval"
                  type="number"
                  value={mock.logGenerationInterval}
                  onChange={(e) =>
                    setMock((prev) => ({
                      ...prev,
                      logGenerationInterval: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSave}>保存设置</Button>
        </div>
      </CardContent>
    </Card>
  );
}
