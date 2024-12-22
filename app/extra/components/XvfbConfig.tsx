"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useXvfbStore from "@/lib/store/extra/xvfb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Save, Upload, Trash2, RefreshCw } from "lucide-react";

export default function XvfbConfig() {
  const {
    config,
    isRunning,
    status,
    logs,
    lastError,
    savedPresets,
    setConfig,
    toggleRunning,
    applyConfig,
    loadConfig,
    saveConfig,
    deletePreset,
    clearLogs,
    restartServer,
  } = useXvfbStore();
  const [configName, setConfigName] = useState("");

  const handleChange = (field: string, value: string | number) => {
    setConfig({ [field]: value });
  };

  const generateCommand = () => {
    const resolution =
      config.resolution === "custom"
        ? config.customResolution
        : config.resolution;
    const [width, height] = resolution.split("x");
    return `Xvfb ${config.display} -screen ${config.screen} ${width}x${height}x${config.colorDepth} -r ${config.refreshRate}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        console.log("Xvfb is running with config:", config);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isRunning, config]);

  const statusColors = {
    idle: "bg-gray-500",
    starting: "bg-blue-500",
    running: "bg-green-500",
    stopping: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Xvfb Configuration</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={statusColors[status]}>{status}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={clearLogs}>
                  Clear Logs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={restartServer}>
                  Restart Server
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display">Display</Label>
              <Input
                id="display"
                value={config.display}
                onChange={(e) => handleChange("display", e.target.value)}
                placeholder=":99"
              />
            </div>
            <div>
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                onValueChange={(value) => handleChange("resolution", value)}
                value={config.resolution}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x768">1024x768</SelectItem>
                  <SelectItem value="1280x1024">1280x1024</SelectItem>
                  <SelectItem value="1920x1080">1920x1080</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.resolution === "custom" && (
              <div>
                <Label htmlFor="customResolution">Custom Resolution</Label>
                <Input
                  id="customResolution"
                  value={config.customResolution}
                  onChange={(e) =>
                    handleChange("customResolution", e.target.value)
                  }
                  placeholder="WidthxHeight"
                />
              </div>
            )}
            <div>
              <Label htmlFor="colorDepth">Color Depth</Label>
              <Select
                onValueChange={(value) => handleChange("colorDepth", value)}
                value={config.colorDepth}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8-bit</SelectItem>
                  <SelectItem value="16">16-bit</SelectItem>
                  <SelectItem value="24">24-bit</SelectItem>
                  <SelectItem value="32">32-bit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="screen">Screen</Label>
              <Input
                id="screen"
                value={config.screen}
                onChange={(e) => handleChange("screen", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="refreshRate">Refresh Rate (Hz)</Label>
              <Input
                id="refreshRate"
                type="number"
                value={config.refreshRate}
                onChange={(e) =>
                  handleChange("refreshRate", parseInt(e.target.value))
                }
                placeholder="60"
              />
            </div>
          </div>

          {lastError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{lastError}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Saved Presets</h3>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Preset name"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="w-40"
                />
                <Button onClick={() => saveConfig(configName)} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(savedPresets).map((name) => (
                <div key={name} className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadConfig(name)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    {name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => deletePreset(name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Logs</h3>
            <ScrollArea className="h-48 border rounded-md p-2">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`text-sm mb-1 ${
                    log.type === "error"
                      ? "text-red-500"
                      : log.type === "warning"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(log.timestamp).toLocaleTimeString()}: {log.message}
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isRunning}
                onCheckedChange={toggleRunning}
                disabled={status === "starting" || status === "stopping"}
              />
              <Label>Xvfb is {isRunning ? "running" : "stopped"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={restartServer}
                disabled={!isRunning}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Restart
              </Button>
              <Button
                onClick={applyConfig}
                disabled={status === "starting" || status === "stopping"}
              >
                Apply Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
