import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/store/connection";
import { motion } from "framer-motion";
import { languages } from "@/lib/constants";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function AdvancedTab() {
  const { settings, errors, setSettings, validateField } = useSettingsStore();

  const handleChange = (field: string, value: any) => {
    if (validateField(field, value)) {
      setSettings({ [field]: value });
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container max-w-4xl mx-auto p-4 space-y-6"
    >
      <motion.div variants={item} className="grid gap-6">
        {[
          <Card
            key="general"
            className="p-6 bg-gray-800/90 backdrop-blur border-0 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="updateInterval">更新间隔 (ms)</Label>
                <Input
                  id="updateInterval"
                  type="number"
                  value={settings.updateInterval}
                  onChange={(e) =>
                    handleChange("updateInterval", parseInt(e.target.value))
                  }
                  className="bg-gray-700"
                />
                {errors.updateInterval && (
                  <span className="text-red-400 text-sm">
                    {errors.updateInterval}
                  </span>
                )}
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="timeout">连接超时 (s)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={settings.connectionTimeout}
                  onChange={(e) =>
                    handleChange("connectionTimeout", parseInt(e.target.value))
                  }
                  className="bg-gray-700"
                />
                {errors.connectionTimeout && (
                  <span className="text-red-400 text-sm">
                    {errors.connectionTimeout}
                  </span>
                )}
              </motion.div>
            </div>
          </Card>,
          <Card
            key="switches"
            className="p-6 bg-gray-800/90 backdrop-blur border-0 shadow-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="debugMode">调试模式</Label>
                <Switch
                  id="debugMode"
                  checked={settings.debugMode}
                  onCheckedChange={(checked) =>
                    handleChange("debugMode", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">通知提醒</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    handleChange("notifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">自动保存</Label>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    handleChange("autoSave", checked)
                  }
                />
              </div>
            </div>
          </Card>,
          <Card
            key="language"
            className="p-6 bg-gray-800/90 backdrop-blur border-0 shadow-lg"
          >
            <div className="space-y-4">
              <Label>语言设置</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleChange("language", value)}
              >
                <SelectTrigger className="bg-gray-700">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>,
          <Card
            key="performance"
            className="p-6 bg-gray-800/90 backdrop-blur border-0 shadow-lg"
          >
            <div className="space-y-4">
              <Label>性能设置</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">最大连接数</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={settings.maxConnections}
                    onChange={(e) =>
                      handleChange("maxConnections", parseInt(e.target.value))
                    }
                    className="bg-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bufferSize">缓冲区大小 (KB)</Label>
                  <Input
                    id="bufferSize"
                    type="number"
                    value={settings.bufferSize}
                    onChange={(e) =>
                      handleChange("bufferSize", parseInt(e.target.value))
                    }
                    className="bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </Card>,
          <Card
            key="backup"
            className="p-6 bg-gray-800/90 backdrop-blur border-0 shadow-lg"
          >
            <div className="space-y-4">
              <Label>备份设置</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoBackup">自动备份</Label>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) =>
                      handleChange("autoBackup", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="backupInterval">备份间隔 (分钟)</Label>
                  <Input
                    id="backupInterval"
                    type="number"
                    value={settings.backupInterval}
                    onChange={(e) =>
                      handleChange("backupInterval", parseInt(e.target.value))
                    }
                    className="w-32 bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </Card>,
        ].map((card, index) => (
          <motion.div
            key={index}
            variants={item}
            className="transition-all duration-200 hover:shadow-xl"
          >
            {card}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
