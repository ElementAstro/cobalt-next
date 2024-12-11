import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore, Profile } from "@/lib/store/connection";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Save, Trash2, PlusCircle, Wifi, WifiOff } from "lucide-react";

interface ProfileTabProps {
  toast: (props: { title: string; description: string }) => void;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function ProfileTab({ toast }: ProfileTabProps) {
  const {
    activeProfile,
    updateProfile,
    setActiveProfile,
    profiles,
    addProfile,
    deleteProfile,
  } = useProfileStore();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (field: string, value: string | boolean) => {
    let error = "";
    if (field === "name" && typeof value === "string" && value.trim() === "") {
      error = "名称不能为空";
    }
    if (field === "port" && typeof value === "string" && !/^\d+$/.test(value)) {
      error = "端口必须是数字";
    }
    if (field === "host" && typeof value === "string" && value.trim() === "") {
      error = "主机地址不能为空";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (!activeProfile?.id) return;

    if (validate(field, value)) {
      updateProfile(activeProfile.id, { [field]: value });
      toast({
        title: "配置已更新",
        description: `${field} 已更新成功。`,
      });
    }
  };

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
    };
    addProfile(newProfile);
    setActiveProfile(newProfile);
  };

  const handleDeleteProfile = () => {
    if (activeProfile) {
      deleteProfile(activeProfile.id);
      // setActiveProfile(undefined); // 使用 undefined 替代 null
    }
  };

  if (!activeProfile) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]"
        {...fadeInUp}
      >
        <CardHeader>
          <CardTitle>没有选中的配置</CardTitle>
          <CardDescription>请创建或选择一个配置文件</CardDescription>
        </CardHeader>
        <Button
          onClick={handleCreateProfile}
          className="mt-4"
          variant="outline"
          size="lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          创建新配置
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      className="container mx-auto p-4 space-y-6"
    >
      <Card className="dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>配置管理</CardTitle>
            <CardDescription>管理你的连接配置</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
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
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div {...fadeInUp} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">配置名称</Label>
                  <Input
                    id="name"
                    value={activeProfile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="dark:bg-gray-700"
                  />
                  {errors.name && (
                    <span className="text-sm text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoConnect"
                    checked={activeProfile.autoConnect}
                    onCheckedChange={(checked) =>
                      handleChange("autoConnect", checked)
                    }
                  />
                  <Label htmlFor="autoConnect">自动连接</Label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>连接模式</Label>
                  <RadioGroup
                    value={activeProfile.mode}
                    onValueChange={(value) => handleChange("mode", value)}
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
                    onValueChange={(value) => handleChange("guiding", value)}
                  >
                    <SelectTrigger className="dark:bg-gray-700">
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
                <motion.div {...fadeInUp} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="host">主机地址</Label>
                    <Input
                      id="host"
                      value={activeProfile.host}
                      onChange={(e) => handleChange("host", e.target.value)}
                      className="dark:bg-gray-700"
                    />
                    {errors.host && (
                      <span className="text-sm text-red-500">
                        {errors.host}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">端口</Label>
                    <Input
                      id="port"
                      value={activeProfile.port}
                      onChange={(e) => handleChange("port", e.target.value)}
                      className="dark:bg-gray-700"
                    />
                    {errors.port && (
                      <span className="text-sm text-red-500">
                        {errors.port}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="indiWebManager"
                  checked={activeProfile.indiWebManager}
                  onCheckedChange={(checked) =>
                    handleChange("indiWebManager", checked === true)
                  }
                />
                <Label htmlFor="indiWebManager">启用 INDI Web Manager</Label>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
