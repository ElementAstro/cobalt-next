import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useApiService } from "@/services/api";
import { motion } from "framer-motion";

export function AdvancedTab() {
  const { fetchAdvancedSettings, updateAdvancedSettings } = useApiService();
  const [settings, setSettings] = useState({
    updateInterval: 1000,
    connectionTimeout: 30,
    debugMode: false,
    newSetting: "", // 新的设置项
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAdvancedSettings().then((data) =>
      setSettings({ ...data, newSetting: "" })
    );
  }, [fetchAdvancedSettings]);

  const validate = (field: string, value: number | boolean | string) => {
    let error = "";
    if (
      field === "updateInterval" &&
      typeof value === "number" &&
      (value < 500 || value > 10000)
    ) {
      error = "更新间隔必须在500ms到10000ms之间";
    }
    if (
      field === "connectionTimeout" &&
      typeof value === "number" &&
      (value < 10 || value > 120)
    ) {
      error = "连接超时必须在10秒到120秒之间";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleChange = (field: string, value: number | boolean | string) => {
    if (validate(field, value)) {
      setSettings((prev) => ({ ...prev, [field]: value }));
      updateAdvancedSettings({ [field]: value }).catch((error) => {
        console.error("Failed to update advanced settings:", error);
      });
    }
  };

  return (
    <motion.div
      className="space-y-4 p-4 bg-gray-900 text-white rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Label htmlFor="updateInterval">更新间隔 (ms)</Label>
          <Input
            id="updateInterval"
            type="number"
            value={settings.updateInterval}
            onChange={(e) =>
              handleChange("updateInterval", parseInt(e.target.value))
            }
            className="mt-1 bg-gray-800 text-white"
          />
          {errors.updateInterval && (
            <span className="text-red-500">{errors.updateInterval}</span>
          )}
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Label htmlFor="timeout">连接超时 (s)</Label>
          <Input
            id="timeout"
            type="number"
            value={settings.connectionTimeout}
            onChange={(e) =>
              handleChange("connectionTimeout", parseInt(e.target.value))
            }
            className="mt-1 bg-gray-800 text-white"
          />
          {errors.connectionTimeout && (
            <span className="text-red-500">{errors.connectionTimeout}</span>
          )}
        </motion.div>
      </div>
      <motion.div
        className="flex items-center space-x-2"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Switch
          id="debugMode"
          checked={settings.debugMode}
          onCheckedChange={(checked) => handleChange("debugMode", checked)}
        />
        <Label htmlFor="debugMode">启用调试模式</Label>
      </motion.div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Label htmlFor="newSetting">新的设置项</Label>
        <Input
          id="newSetting"
          type="text"
          value={settings.newSetting}
          onChange={(e) => handleChange("newSetting", e.target.value)}
          className="mt-1 bg-gray-800 text-white"
        />
      </motion.div>
    </motion.div>
  );
}
