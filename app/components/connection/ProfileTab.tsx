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
import { useApiService } from "@/services/api";

interface ProfileTabProps {
  toast: (props: { title: string; description: string }) => void;
}

export function ProfileTab({ toast }: ProfileTabProps) {
  const { fetchProfileData, updateProfileData } = useApiService();
  const [profile, setProfile] = useState({
    name: "",
    autoConnect: false,
    mode: "remote",
    host: "",
    port: "",
    guiding: "internal",
    indiWebManager: false,
  });

  useEffect(() => {
    fetchProfileData().then(setProfile);
  }, [fetchProfileData]);

  const handleChange = (field: string, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex-1 w-full">
          <Label htmlFor="name">Profile Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="autoConnect"
            checked={profile.autoConnect}
            onCheckedChange={(checked) => handleChange("autoConnect", checked)}
          />
          <Label htmlFor="autoConnect">Auto Connect</Label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Connection Mode</Label>
          <RadioGroup
            value={profile.mode}
            onValueChange={(value) => handleChange("mode", value)}
            className="flex gap-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="local" id="local" />
              <Label htmlFor="local">Local</Label>
            </div>
            <div className="flex items-center space-x-2">
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
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select guiding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={profile.host}
            onChange={(e) => handleChange("host", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            value={profile.port}
            onChange={(e) => handleChange("port", e.target.value)}
            className="mt-1"
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
        >
          <Search className="w-4 h-4 mr-2" />
          Scan Network
        </Button>
      </div>
    </div>
  );
}
