"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LineChart } from "./line-chart";
import { useMockBackend } from "@/utils/mock-device";
import { DeviceSelector } from "./device-selector";

export function Camera() {
  const [exposure, setExposure] = useState("1");
  const [gain, setGain] = useState("0");
  const [binning, setBinning] = useState("1");
  const { toast } = useToast();
  const {
    cameraInfo,
    startExposure,
    abortExposure,
    setTemperature,
    toggleCooler,
  } = useMockBackend();

  const handleStartExposure = () => {
    startExposure(parseFloat(exposure), parseInt(gain), parseInt(binning));
    toast({
      title: "Starting Exposure",
      description: `Exposure: ${exposure}s, Gain: ${gain}, Binning: ${binning}x${binning}`,
    });
  };

  const handleAbortExposure = () => {
    abortExposure();
    toast({
      title: "Aborting Exposure",
      description: "The current exposure has been aborted.",
    });
  };

  const handleSetTemperature = () => {
    setTemperature(cameraInfo.targetTemperature);
    toast({
      title: "Setting Temperature",
      description: `Target temperature set to ${cameraInfo.targetTemperature}°C`,
    });
  };

  const handleToggleCooler = () => {
    toggleCooler();
    toast({
      title: "Toggling Cooler",
      description: `Cooler ${cameraInfo.coolerOn ? "enabled" : "disabled"}`,
    });
  };

  return (
    <div className="space-y-4">
      <DeviceSelector
        deviceType="Camera"
        devices={["ZWO ASI294MC Pro", "QHY600M", "Atik 16200"]}
        onDeviceChange={(device) => console.log(`Selected camera: ${device}`)}
      />
      <Card className="bg-slate-800/50">
        <CardHeader>
          <CardTitle>Camera Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Sensor type</Label>
              <div className="text-sm">{cameraInfo.sensorType}</div>
            </div>
            <div className="space-y-2">
              <Label>Sensor size</Label>
              <div className="text-sm">{cameraInfo.sensorSize}</div>
            </div>
            <div className="space-y-2">
              <Label>Pixel size</Label>
              <div className="text-sm">{cameraInfo.pixelSize}</div>
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <div className="text-sm">{cameraInfo.temperature}°C</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50">
        <CardHeader>
          <CardTitle>Exposure Control</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exposure">Exposure (s)</Label>
              <Input
                id="exposure"
                type="number"
                value={exposure}
                onChange={(e) => setExposure(e.target.value)}
                min="0.001"
                step="0.001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gain">Gain</Label>
              <Input
                id="gain"
                type="number"
                value={gain}
                onChange={(e) => setGain(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="binning">Binning</Label>
              <Input
                id="binning"
                type="number"
                value={binning}
                onChange={(e) => setBinning(e.target.value)}
                min="1"
                max="4"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleStartExposure}>Start Exposure</Button>
            <Button variant="destructive" onClick={handleAbortExposure}>
              Abort Exposure
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Temperature Control</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="cooler">Cooler</Label>
            <Switch
              id="cooler"
              checked={cameraInfo.coolerOn}
              onCheckedChange={handleToggleCooler}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="target-temp">Target Temperature (°C)</Label>
            <Input
              id="target-temp"
              type="number"
              value={cameraInfo.targetTemperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-24"
            />
            <Button onClick={handleSetTemperature}>Set</Button>
          </div>
          <LineChart data={cameraInfo.temperatureHistory} />
        </CardContent>
      </Card>
    </div>
  );
}
