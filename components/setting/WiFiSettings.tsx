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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "react-responsive";

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
  wifiPower: "high" | "medium" | "low";
  setWifiPower: (value: "high" | "medium" | "low") => void;
  saveNetworkHistory: boolean;
  setSaveNetworkHistory: (value: boolean) => void;
  maxHistoryItems: number;
  setMaxHistoryItems: (value: number) => void;
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
  wifiPower,
  setWifiPower,
  saveNetworkHistory,
  setSaveNetworkHistory,
  maxHistoryItems,
  setMaxHistoryItems,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={isDesktop ? "default" : "sm"}>
          <Settings className="w-4 h-4 mr-2" />
          设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Wi-Fi 设置</DialogTitle>
          <DialogDescription>调整您的 Wi-Fi 连接首选项</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">常规</TabsTrigger>
            <TabsTrigger value="advanced">高级</TabsTrigger>
            <TabsTrigger value="power">电源</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
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
                <label className="block text-sm font-medium mb-2">
                  首选频段
                </label>
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
                      <p>
                        模拟模式用于测试和演示目的，不会影响实际的WiFi连接。
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>保存网络历史</span>
                <Switch
                  checked={saveNetworkHistory}
                  onCheckedChange={setSaveNetworkHistory}
                />
              </div>
              <div className="space-y-2">
                <label>最大历史记录数</label>
                <Slider
                  value={[maxHistoryItems]}
                  onValueChange={([value]) => setMaxHistoryItems(value)}
                  max={50}
                  min={5}
                  step={5}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="power">
            <RadioGroup value={wifiPower} onValueChange={setWifiPower}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">高性能模式</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">平衡模式</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">节能模式</Label>
              </div>
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WiFiSettings;
