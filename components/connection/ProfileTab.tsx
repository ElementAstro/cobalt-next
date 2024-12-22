import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusCircle,
  Trash2,
  Wifi,
  WifiOff,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store/connection/settings";
import { Profile, useProfileStore } from "@/lib/store/connection/profile";
import { useEffect, useState } from "react";
import { AdvancedSettings } from "@/types/connection";

// ------ Animations ------
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// 模拟语言列表
const languages = [
  { label: "中文", value: "zh-CN" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "日本語", value: "ja" },
];

// 提示框动画
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ------ Main Component ------
export function ProfileTab() {
  // from advanced store
  const { settings, errors, setSettings, validateField } = useSettingsStore();
  // from profile store
  const {
    profiles,
    activeProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
  } = useProfileStore();

  const [autoRefreshLogs, setAutoRefreshLogs] = useState<NodeJS.Timeout | null>(
    null
  );
  const [mockData, setMockData] = useState("系统启动: 正在收集日志...\n");
  const [showAdvanced, setShowAdvanced] = useState(true);

  // 切换是否显示 Profile / Advanced
  const handleToggleView = () => {
    setShowAdvanced((prev) => !prev);
  };

  // 验证并更新 settings
  function handleSettingsChange(field: keyof AdvancedSettings, value: any) {
    if (validateField(field, value)) {
      setSettings({ [field]: value });
    }
  }

  // 模拟实时日志刷新
  useEffect(() => {
    if (!autoRefreshLogs) {
      const timer = setInterval(() => {
        const now = new Date().toLocaleTimeString();
        setMockData((prev) => prev + `[${now}] 采集到新的模拟数据...\n`);
      }, 4000);
      setAutoRefreshLogs(timer);
    }
    return () => {
      if (autoRefreshLogs) clearInterval(autoRefreshLogs);
    };
  }, [autoRefreshLogs]);

  // --- Profile Tab相关逻辑 ---
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const handleCreateProfile = () => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: "新配置",
      autoConnect: false,
      mode: "local",
      host: "",
      port: "",
      guiding: "internal",
      indiWebManager: false,
      theme: "system",
      isConnected: false,
      useGPS: false,
      locationNote: "",
    };
    addProfile(newProfile);
    setActiveProfile(newProfile);
  };

  const handleDeleteProfile = () => {
    if (activeProfile) {
      deleteProfile(activeProfile.id);
    }
  };

  const handleImportProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse((e.target?.result as string) || "{}");
        const newData: Profile = {
          ...imported,
          id: Date.now().toString(),
          isConnected: false,
        };
        addProfile(newData);
        setActiveProfile(newData);
      } catch {
        // 不做特别处理
      }
    };
    reader.readAsText(file);
  };

  const handleExportProfile = () => {
    if (!activeProfile) return;
    const dataStr = JSON.stringify(activeProfile, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProfile.name || "Profile"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateProfileField = (field: string, value: string | boolean) => {
    let error = "";
    if (field === "name" && typeof value === "string" && !value.trim()) {
      error = "名称不能为空";
    }
    if (field === "port" && typeof value === "string" && !/^\d*$/.test(value)) {
      error = "端口必须为数字";
    }
    setProfileErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
    return !error;
  };

  const handleProfileChange = (field: keyof Profile, value: any) => {
    if (!activeProfile) return;
    if (validateProfileField(field, value)) {
      updateProfile(activeProfile.id, { [field]: value });
    }
  };

  return (
    <motion.main
      className="min-h-screen bg-gray-900 text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          天文摄影软件 - {showAdvanced ? "高级设置" : "设备配置"}
        </h1>
        <Button variant="outline" onClick={handleToggleView}>
          {showAdvanced ? "切换到配置管理" : "切换到高级设置"}
        </Button>
      </header>

      {/* 高级设置部分 */}
      <AnimatePresence mode="wait">
        {showAdvanced && (
          <motion.section
            key="advanced-settings"
            className="space-y-4"
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <Card className="border-0 bg-gray-800/90 backdrop-blur shadow-lg">
              <CardHeader>
                <CardTitle>高级设置</CardTitle>
                <CardDescription>配置如更新间隔、超时、缓存等</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="updateInterval">更新间隔 (ms)</Label>
                    <Input
                      id="updateInterval"
                      type="number"
                      className="bg-gray-700"
                      value={settings.updateInterval}
                      onChange={(e) =>
                        handleSettingsChange(
                          "updateInterval",
                          parseInt(e.target.value || "1000", 10)
                        )
                      }
                    />
                    {errors.updateInterval && (
                      <p className="text-red-400 text-sm">
                        {errors.updateInterval}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connectionTimeout">连接超时 (s)</Label>
                    <Input
                      id="connectionTimeout"
                      type="number"
                      className="bg-gray-700"
                      value={settings.connectionTimeout}
                      onChange={(e) =>
                        handleSettingsChange(
                          "connectionTimeout",
                          parseInt(e.target.value || "30", 10)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debugMode">调试模式</Label>
                    <Switch
                      id="debugMode"
                      checked={settings.debugMode}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("debugMode", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">通知</Label>
                    <Switch
                      id="notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("notifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSave">自动保存</Label>
                    <Switch
                      id="autoSave"
                      checked={settings.autoSave}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("autoSave", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">界面语言</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(val) =>
                      handleSettingsChange("language", val)
                    }
                  >
                    <SelectTrigger className="bg-gray-700 w-full md:w-48">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxConnections">最大连接数</Label>
                    <Input
                      id="maxConnections"
                      type="number"
                      className="bg-gray-700"
                      value={settings.maxConnections}
                      onChange={(e) =>
                        handleSettingsChange(
                          "maxConnections",
                          parseInt(e.target.value || "5", 10)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bufferSize">缓冲区大小 (KB)</Label>
                    <Input
                      id="bufferSize"
                      type="number"
                      className="bg-gray-700"
                      value={settings.bufferSize}
                      onChange={(e) =>
                        handleSettingsChange(
                          "bufferSize",
                          parseInt(e.target.value || "100", 10)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>实时日志</Label>
                  <div className="bg-gray-700 p-2 rounded h-32 overflow-auto text-xs whitespace-pre-wrap">
                    {mockData}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setMockData("已重置日志...\n")}
                  >
                    重置日志
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Profile 管理部分 */}
        {!showAdvanced && (
          <motion.section
            key="profile-management"
            className="space-y-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {!activeProfile ? (
              <Card className="bg-gray-800/90 border-0 backdrop-blur shadow-lg flex justify-center items-center flex-col p-8">
                <CardHeader>
                  <CardTitle>没有选中的配置</CardTitle>
                  <CardDescription>请创建或选择一个配置文件</CardDescription>
                </CardHeader>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleCreateProfile}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  创建新配置
                </Button>
              </Card>
            ) : (
              <Card className="bg-gray-800/90 border-0 backdrop-blur shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>配置管理</CardTitle>
                    <CardDescription>编辑和管理连接配置</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleExportProfile}
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>导出配置</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              document.getElementById("import-profile")?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>导入配置</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <input
                      type="file"
                      id="import-profile"
                      className="hidden"
                      accept=".json"
                      onChange={handleImportProfile}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCreateProfile}
                      className="h-8 w-8"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleDeleteProfile}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="grid gap-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profileName">配置名称</Label>
                        <Input
                          id="profileName"
                          className="bg-gray-700"
                          value={activeProfile.name}
                          onChange={(e) =>
                            handleProfileChange("name", e.target.value)
                          }
                        />
                        {profileErrors.name && (
                          <p className="text-red-400 text-sm">
                            {profileErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-6">
                        <Switch
                          id="autoConnect"
                          checked={activeProfile.autoConnect}
                          onCheckedChange={(checked) =>
                            handleProfileChange("autoConnect", checked)
                          }
                        />
                        <Label htmlFor="autoConnect">自动连接</Label>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>连接模式</Label>
                        <RadioGroup
                          value={activeProfile.mode}
                          onValueChange={(val) =>
                            handleProfileChange("mode", val)
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="local" id="local" />
                            <Label htmlFor="local">本地</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="remote" id="remote" />
                            <Label htmlFor="remote">远程</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>导航模式</Label>
                        <Select
                          value={activeProfile.guiding}
                          onValueChange={(val) =>
                            handleProfileChange("guiding", val)
                          }
                        >
                          <SelectTrigger className="bg-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">内置</SelectItem>
                            <SelectItem value="external">外置</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {activeProfile.mode === "remote" && (
                      <motion.div
                        {...fadeInUp}
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="host">主机地址</Label>
                          <Input
                            id="host"
                            className="bg-gray-700"
                            value={activeProfile.host}
                            onChange={(e) =>
                              handleProfileChange("host", e.target.value)
                            }
                          />
                          {profileErrors.host && (
                            <p className="text-red-400 text-sm">
                              {profileErrors.host}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port">端口</Label>
                          <Input
                            id="port"
                            className="bg-gray-700"
                            value={activeProfile.port}
                            onChange={(e) =>
                              handleProfileChange("port", e.target.value)
                            }
                          />
                          {profileErrors.port && (
                            <p className="text-red-400 text-sm">
                              {profileErrors.port}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indiWebManager"
                        checked={activeProfile.indiWebManager}
                        onCheckedChange={(checked) =>
                          handleProfileChange("indiWebManager", checked)
                        }
                      />
                      <Label htmlFor="indiWebManager">
                        启用 INDI Web Manager
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useGPS"
                        checked={activeProfile.useGPS ?? false}
                        onCheckedChange={(checked) =>
                          handleProfileChange("useGPS", checked)
                        }
                      />
                      <Label htmlFor="useGPS">使用GPS数据</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locationNote">位置备注</Label>
                      <Input
                        id="locationNote"
                        className="bg-gray-700"
                        value={activeProfile.locationNote ?? ""}
                        onChange={(e) =>
                          handleProfileChange("locationNote", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      {activeProfile.isConnected ? (
                        <Wifi className="h-4 w-4 text-green-500" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          activeProfile.isConnected
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {activeProfile.isConnected ? "已连接" : "未连接"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
