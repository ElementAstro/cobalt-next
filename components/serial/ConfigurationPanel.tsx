import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FC } from "react";
import { SerialConfig, SerialPort } from "@/types/serial";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ConfigurationPanelProps {
  isMockMode: boolean;
  toggleMockMode: (checked: boolean) => void;
  activePort: SerialPort | undefined;
  onConfigChange: (portId: string, key: keyof SerialConfig, value: any) => void;
  onSaveConfig: () => void;
  onLoadConfig: () => void;
}

const ConfigurationPanel: FC<ConfigurationPanelProps> = ({
  isMockMode,
  toggleMockMode,
  activePort,
  onConfigChange,
  onSaveConfig,
  onLoadConfig,
}) => {
  return (
    <Card className={`p-4 bg-gray-200`}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="mock-mode">Mock 模式</Label>
          <Switch
            id="mock-mode"
            checked={isMockMode}
            onCheckedChange={toggleMockMode}
          />
        </div>
        {activePort && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="baud-rate">波特率</Label>
                <Select
                  value={activePort.config.baudRate.toString()}
                  onValueChange={(value) =>
                    onConfigChange(activePort.id, "baudRate", parseInt(value))
                  }
                >
                  <SelectTrigger id="baud-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9600">9600</SelectItem>
                    <SelectItem value="115200">115200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="data-bits">数据位</Label>
                <Select
                  value={activePort.config.dataBits.toString()}
                  onValueChange={(value) =>
                    onConfigChange(activePort.id, "dataBits", parseInt(value))
                  }
                >
                  <SelectTrigger id="data-bits">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stop-bits">停止位</Label>
                <Select
                  value={activePort.config.stopBits.toString()}
                  onValueChange={(value) =>
                    onConfigChange(activePort.id, "stopBits", parseInt(value))
                  }
                >
                  <SelectTrigger id="stop-bits">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parity">校验位</Label>
                <Select
                  value={activePort.config.parity}
                  onValueChange={(value: "none" | "even" | "odd") =>
                    onConfigChange(activePort.id, "parity", value)
                  }
                >
                  <SelectTrigger id="parity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="even">Even</SelectItem>
                    <SelectItem value="odd">Odd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flow-control">流控制</Label>
                <Select
                  value={
                    typeof activePort.config.flowControl === "boolean"
                      ? activePort.config.flowControl
                        ? "hardware"
                        : "none"
                      : activePort.config.flowControl || "none"
                  }
                  onValueChange={(value) =>
                    onConfigChange(activePort.id, "flowControl", value)
                  }
                >
                  <SelectTrigger id="flow-control">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onLoadConfig}>
                加载配置
              </Button>
              <Button variant="default" onClick={onSaveConfig}>
                <Save className="h-4 w-4 mr-2" />
                保存配置
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ConfigurationPanel;
