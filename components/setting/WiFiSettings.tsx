import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings, Info } from "lucide-react";

interface WiFiSettingsProps {
  autoJoinNetworks: boolean;
  setAutoJoinNetworks: (value: boolean) => void;
  notifyAvailableNetworks: boolean;
  setNotifyAvailableNetworks: (value: boolean) => void;
  askToJoinNetworks: boolean;
  setAskToJoinNetworks: (value: boolean) => void;
  preferredBand: string;
  setPreferredBand: (value: string) => void;
  toggleMockMode: () => void;
}

const WiFiSettings: React.FC<WiFiSettingsProps> = ({
  autoJoinNetworks,
  setAutoJoinNetworks,
  notifyAvailableNetworks,
  setNotifyAvailableNetworks,
  askToJoinNetworks,
  setAskToJoinNetworks,
  preferredBand,
  setPreferredBand,
  toggleMockMode,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          设置
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wi-Fi 设置</DialogTitle>
          <DialogDescription>调整您的 Wi-Fi 连接首选项</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <span>自动加入网络</span>
            <Switch
              checked={autoJoinNetworks}
              onCheckedChange={setAutoJoinNetworks}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>通知可用网络</span>
            <Switch
              checked={notifyAvailableNetworks}
              onCheckedChange={setNotifyAvailableNetworks}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>询问是否加入网络</span>
            <Switch
              checked={askToJoinNetworks}
              onCheckedChange={setAskToJoinNetworks}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">首选频段</label>
            <Select value={preferredBand} onValueChange={setPreferredBand}>
              <SelectTrigger>
                <SelectValue placeholder="选择首选频段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.4GHz">2.4GHz</SelectItem>
                <SelectItem value="5GHz">5GHz</SelectItem>
                <SelectItem value="Auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <span>模拟模式</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Switch
                      checked={false} // Replace with actual state if needed
                      onCheckedChange={toggleMockMode}
                    />
                    <Info className="ml-2 w-4 h-4 text-muted" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>模拟模式用于测试和演示目的，不会影响实际的WiFi连接。</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WiFiSettings;
