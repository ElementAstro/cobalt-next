import { useState, useEffect } from "react";
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
import { Search } from "lucide-react";
import { useApiService } from "@/services/connection";
import { motion } from "framer-motion";

interface ProfileTabProps {
  toast: (props: { title: string; description: string }) => void;
}

interface Profile {
  name: string;
  autoConnect: boolean;
  mode: "local" | "remote";
  host: string;
  port: string;
  guiding: "internal" | "external";
  indiWebManager: boolean;
}

export function ProfileTab({ toast }: ProfileTabProps) {
  const { fetchProfileData, updateProfileData } = useApiService();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    autoConnect: false,
    mode: "remote",
    host: "",
    port: "",
    guiding: "internal",
    indiWebManager: false,
  });

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

  useEffect(() => {
    fetchProfileData().then(setProfile);
  }, [fetchProfileData]);

  const handleChange = (field: string, value: string | boolean) => {
    if (validate(field, value)) {
      setProfile((prev) => ({ ...prev, [field]: value }));
      updateProfileData({ [field]: value })
        .then(() => {
          toast({
            title: "Profile Updated",
            description: `${field} 已更新。`,
          });
        })
        .catch((error) => {
          toast({ title: "更新失败", description: error.message });
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <div className="flex-1">
          <Label htmlFor="name">Profile Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 dark:bg-gray-700 dark:text-gray-200"
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="autoConnect"
            checked={profile.autoConnect}
            onCheckedChange={(checked) => handleChange("autoConnect", checked)}
          />
          <Label htmlFor="autoConnect">Auto Connect</Label>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div>
          <Label>Connection Mode</Label>
          <RadioGroup
            value={profile.mode}
            onValueChange={(value) => handleChange("mode", value)}
            className="flex gap-4 mt-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="local" id="local" />
              <Label htmlFor="local">Local</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="remote" id="remote" />
              <Label htmlFor="remote">Remote</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="guiding">Guiding</Label>
          <Select
            value={profile.guiding}
            onValueChange={(value) => handleChange("guiding", value)}
          >
            <SelectTrigger className="mt-1 dark:bg-gray-700 dark:text-gray-200">
              <SelectValue placeholder="Select guiding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={profile.host}
            onChange={(e) => handleChange("host", e.target.value)}
            className="mt-1 dark:bg-gray-700 dark:text-gray-200"
          />
          {errors.host && <span className="text-red-500">{errors.host}</span>}
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            value={profile.port}
            onChange={(e) => handleChange("port", e.target.value)}
            className="mt-1 dark:bg-gray-700 dark:text-gray-200"
          />
          {errors.port && <span className="text-red-500">{errors.port}</span>}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="indiWebManager"
                  checked={profile.indiWebManager}
                  onCheckedChange={(checked) =>
                    handleChange("indiWebManager", checked)
                  }
                />
                <Label htmlFor="indiWebManager">INDI Web Manager</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enable INDI Web Manager for advanced device control</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: "Scanning for devices...",
              description: "This may take a few moments.",
            })
          }
          className="flex items-center"
        >
          <Search className="w-4 h-4 mr-2" />
          Scan Network
        </Button>
      </motion.div>
    </motion.div>
  );
}
