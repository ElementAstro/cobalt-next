"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMockBackend } from "@/utils/mock-device";
import { DeviceSelector } from "../components/device-selector";

export function Focuser() {
  const [targetPosition, setTargetPosition] = useState("12500");
  const { toast } = useToast();
  const { focuserInfo, moveFocuser, setTemperatureCompensation } =
    useMockBackend();

  const handleMove = (steps: number) => {
    moveFocuser(steps);
    toast({
      title: "Moving Focuser",
      description: `Moving focuser by ${steps} steps`,
    });
  };

  const handleMoveToPosition = () => {
    const position = parseInt(targetPosition);
    moveFocuser(position - focuserInfo.position);
    toast({
      title: "Moving Focuser",
      description: `Moving focuser to position ${position}`,
    });
  };

  const handleTemperatureCompensation = (enabled: boolean) => {
    setTemperatureCompensation(enabled);
    toast({
      title: "Temperature Compensation",
      description: `Temperature compensation ${
        enabled ? "enabled" : "disabled"
      }`,
    });
  };

  return (
    <div className="space-y-4 p-4 text-white">
      <DeviceSelector
        deviceType="Focuser"
        devices={["ZWO EAF", "Moonlite CSL", "Pegasus FocusCube2"]}
        onDeviceChange={(device) => console.log(`Selected focuser: ${device}`)}
      />
      <div className="flex flex-col gap-4">
        <Card className="bg-slate-800/50">
          <CardHeader>
            <CardTitle>Focuser Control</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="text-sm">{focuserInfo.position}</div>
              </div>
              <div className="space-y-2">
                <Label>Temperature</Label>
                <div className="text-sm">{focuserInfo.temperature}°C</div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="temp-comp">Temperature Compensation</Label>
                <Switch
                  id="temp-comp"
                  checked={focuserInfo.temperatureCompensation}
                  onCheckedChange={handleTemperatureCompensation}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Label htmlFor="target-position">Target position</Label>
                <Input
                  id="target-position"
                  type="number"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  className="max-w-[200px] text-black"
                />
                <Button onClick={handleMoveToPosition}>Move</Button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(-1000)}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(-100)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(100)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(1000)}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
