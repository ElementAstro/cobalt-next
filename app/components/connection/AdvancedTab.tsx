import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useApiService } from "@/services/api";

export function AdvancedTab() {
  const { fetchAdvancedSettings, updateAdvancedSettings } = useApiService();
  const [settings, setSettings] = useState({
    updateInterval: 1000,
    connectionTimeout: 30,
    debugMode: false,
  });

  useEffect(() => {
    fetchAdvancedSettings().then(setSettings);
  }, [fetchAdvancedSettings]);

  const handleChange = (field: string, value: number | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    updateAdvancedSettings({ [field]: value }).catch((error) => {
      console.error("Failed to update advanced settings:", error);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="updateInterval">Update Interval (ms)</Label>
          <Input
            id="updateInterval"
            type="number"
            value={settings.updateInterval}
            onChange={(e) =>
              handleChange("updateInterval", parseInt(e.target.value))
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="timeout">Connection Timeout (s)</Label>
          <Input
            id="timeout"
            type="number"
            value={settings.connectionTimeout}
            onChange={(e) =>
              handleChange("connectionTimeout", parseInt(e.target.value))
            }
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="debugMode"
          checked={settings.debugMode}
          onCheckedChange={(checked) => handleChange("debugMode", checked)}
        />
        <Label htmlFor="debugMode">Enable Debug Mode</Label>
      </div>
    </div>
  );
}
