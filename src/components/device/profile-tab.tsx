import React from "react";
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
import { Search, Download, Upload } from "lucide-react";
import { useApiService } from "@/services/device-connection";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfileStore } from "@/store/useDeviceStore";
import { ProfileData } from "@/types/device";

interface ProfileTabProps {
  toast: (props: { title: string; description: string }) => void;
}

export function ProfileTab({ toast }: ProfileTabProps) {
  const { fetchProfileData, updateProfileData } = useApiService();
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonConfig, setJsonConfig] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchProfileData().then((data) => {
      setProfile({
        ...data,
        protocol: data.protocol || "tcp",
      });
    });
  }, [fetchProfileData, setProfile]);

  useEffect(() => {
    setJsonConfig(JSON.stringify(profile, null, 2));
  }, [profile]);

  const handleChange = (field: keyof ProfileData, value: string | boolean) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    updateProfileData({ [field]: value })
      .then(() => {
        toast({
          title: "Profile Updated",
          description: `${field} has been updated.`,
        });
      })
      .catch((error) => {
        toast({ title: "Update Failed", description: error.message });
      });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `profile-${profile.name}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedProfile: ProfileData = JSON.parse(
            e.target?.result as string
          );
          setProfile(importedProfile);
          updateProfileData(importedProfile);
          toast({
            title: "Profile Imported",
            description: "Profile settings have been updated.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid profile file format.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJsonSave = () => {
    try {
      const parsed = JSON.parse(jsonConfig);
      setProfile(parsed);
      setShowJsonEditor(false);
      toast({
        title: "配置已更新",
        description: "JSON配置已成功应用",
      });
    } catch (e) {
      setValidationErrors([(e as Error).message]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-gray-900 p-6 rounded-lg"
    >
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div className="flex-1 w-full">
            <Label htmlFor="name" className="text-white">
              Profile Name
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 bg-gray-800 text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoConnect"
              checked={profile.autoConnect}
              onCheckedChange={(checked) =>
                handleChange("autoConnect", checked)
              }
            />
            <Label htmlFor="autoConnect" className="text-white">
              Auto Connect
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Connection Mode</Label>
            <RadioGroup
              value={profile.mode}
              onValueChange={(value) => handleChange("mode", value)}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="local" />
                <Label htmlFor="local" className="text-white">
                  Local
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote" className="text-white">
                  Remote
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="guiding" className="text-white">
              Guiding
            </Label>
            <Select
              value={profile.guiding}
              onValueChange={(value) => handleChange("guiding", value)}
            >
              <SelectTrigger className="mt-1 bg-gray-800 text-white">
                <SelectValue placeholder="Select guiding" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800">
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="host" className="text-white">
              Host
            </Label>
            <Input
              id="host"
              value={profile.host}
              onChange={(e) => handleChange("host", e.target.value)}
              className="mt-1 bg-gray-800 text-white"
            />
          </div>
          <div>
            <Label htmlFor="port" className="text-white">
              Port
            </Label>
            <Input
              id="port"
              value={profile.port}
              onChange={(e) => handleChange("port", e.target.value)}
              className="mt-1 bg-gray-800 text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="indiWebManager"
                    checked={profile.indiWebManager}
                    onCheckedChange={(checked) =>
                      handleChange("indiWebManager", checked)
                    }
                  />
                  <Label htmlFor="indiWebManager" className="text-white">
                    INDI Web Manager
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white">
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
            className="flex items-center bg-gray-800 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            Scan Network
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center bg-gray-800 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Profile
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center bg-gray-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Import Profile</DialogTitle>
              <DialogDescription>
                Choose a profile file to import. This will override current
                settings.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="mt-4 bg-gray-700 text-white"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg p-4 space-y-4 bg-gray-800">
        <h3 className="text-lg font-medium text-white">
          Advanced Connection Settings
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Connection Retry</Label>
            <Select
              value={profile.retry.toString()}
              onValueChange={(value) => handleChange("retry", value)}
            >
              <SelectTrigger className="mt-1 bg-gray-800 text-white">
                <SelectValue placeholder="Select retry times" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800">
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} times
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white">Connection Protocol</Label>
            <Select
              value={profile.protocol}
              onValueChange={(value) => handleChange("protocol", value)}
            >
              <SelectTrigger className="mt-1 bg-gray-800 text-white">
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800">
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="udp">UDP</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJsonEditor(!showJsonEditor)}
          >
            {showJsonEditor ? "返回表单视图" : "编辑 JSON"}
          </Button>
        </div>

        {showJsonEditor ? (
          <div className="space-y-4">
            <ScrollArea className="h-[400px] w-full bg-gray-800 p-4 rounded-lg">
              <Textarea
                value={jsonConfig}
                onChange={(e) => setJsonConfig(e.target.value)}
                className="w-full h-full bg-gray-800 text-white"
              />
            </ScrollArea>
            {validationErrors.length > 0 && (
              <div className="text-red-500">
                {validationErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <Button onClick={handleJsonSave} className="bg-gray-800 text-white">
              保存 JSON
            </Button>
          </div>
        ) : (
          <div className="space-y-4">{/* Existing form fields */}</div>
        )}
      </div>
    </motion.div>
  );
}
