"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useXvfbStore, XvfbInstance } from "@/store/useExtraStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Save, Upload, Trash2, RefreshCw, Monitor, Radio, Palette } from "lucide-react";

const xvfbSchema = z.object({
  display: z.string().regex(/^:\d+$/, "Display must be in format :99"),
  resolution: z.string(),
  customResolution: z
    .string()
    .regex(/^\d+x\d+$/, "Must be in format WIDTHxHEIGHT")
    .optional(),
  colorDepth: z.string(),
  screen: z.string().regex(/^\d+$/, "Must be a number"),
  refreshRate: z.number().min(30).max(240),
  memory: z.number().min(64).max(1024).optional(),
  security: z
    .object({
      xauth: z.boolean(),
      tcp: z.boolean(),
      localhostOnly: z.boolean(),
    })
    .optional(),
  logging: z
    .object({
      verbose: z.boolean(),
      logFile: z.string().optional(),
      maxLogSize: z.number().optional(),
    })
    .optional(),
});

type Status = "idle" | "starting" | "running" | "stopping" | "error";

interface Log {
  type: "error" | "warning" | "info";
  message: string;
  timestamp: number;
}

type ConfigField = keyof typeof xvfbSchema.shape;

export default function XvfbConfig() {
  const {
    config: initialConfig,
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(xvfbSchema),
    defaultValues: {
      display: initialConfig.display,
      resolution: initialConfig.resolution,
      customResolution: initialConfig.customResolution,
      colorDepth: initialConfig.colorDepth,
      screen: initialConfig.screen,
      refreshRate: initialConfig.refreshRate,
      memory: 256,
      security: {
        xauth: false,
        tcp: false,
        localhostOnly: true,
      },
      logging: {
        verbose: false,
        logFile: "",
        maxLogSize: 100,
      },
    },
  });

  const [configName, setConfigName] = useState("");
  const [instances, setInstances] = useState<XvfbInstance[]>([]);

  const statusColors: Record<Status, string> = {
    idle: "bg-gray-500",
    starting: "bg-blue-500",
    running: "bg-green-500",
    stopping: "bg-yellow-500",
    error: "bg-red-500",
  };

  const currentStatusColor = statusColors[status as Status];

  const handleChange = (field: ConfigField, value: string | number) => {
    setValue(field, value);
    setConfig({ [field]: value });
  };

  const generateCommand = () => {
    const resolution =
      initialConfig.resolution === "custom"
        ? initialConfig.customResolution
        : initialConfig.resolution;
    const [width, height] = resolution.split("x");

    let command = `Xvfb ${initialConfig.display} -screen ${initialConfig.screen} ${width}x${height}x${initialConfig.colorDepth} -r ${initialConfig.refreshRate}`;

    if (initialConfig.memory) {
      command += ` -memory ${initialConfig.memory}`;
    }

    if (initialConfig.security) {
      if (initialConfig.security.xauth) {
        command += " -auth /tmp/Xvfb.auth";
      }
      if (initialConfig.security.tcp) {
        command += " -nolisten tcp";
      }
      if (initialConfig.security.localhostOnly) {
        command += " -nolisten inet";
      }
    }

    if (initialConfig.logging) {
      if (initialConfig.logging.verbose) {
        command += " -verbose";
      }
      if (initialConfig.logging.logFile) {
        command += ` -logfile ${initialConfig.logging.logFile}`;
      }
      if (initialConfig.logging.maxLogSize) {
        command += ` -maxlogsize ${initialConfig.logging.maxLogSize}`;
      }
    }

    return command;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        console.log("Xvfb is running with config:", initialConfig);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isRunning, initialConfig]);

  const addInstance = () => {
    const newInstance: XvfbInstance = {
      id: Date.now().toString(),
      display: `:${99 + instances.length}`,
      config: { ...initialConfig },
      status: "idle",
    };
    setInstances([...instances, newInstance]);
  };

  const removeInstance = (id: string) => {
    setInstances(instances.filter((instance) => instance.id !== id));
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row lg:space-x-4 max-w-[100vw] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="lg:w-2/3 mb-4 lg:mb-0"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Xvfb Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <motion.div
                key={status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge className={currentStatusColor}>{status}</Badge>
              </motion.div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="display" className="flex items-center gap-1">
                  <Monitor className="h-4 w-4" />
                  Display
                </Label>
                <Input
                  id="display"
                  value={initialConfig.display}
                  onChange={(e) => handleChange("display", e.target.value)}
                  placeholder=":99"
                  className={errors.display ? "border-red-500" : ""}
                />
                {errors.display && (
                  <span className="absolute -bottom-5 text-xs text-red-500">
                    {errors.display.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <Label htmlFor="resolution" className="flex items-center gap-1">
                  <Radio className="h-4 w-4" />
                  Resolution
                </Label>
                <Select
                  onValueChange={(value) => handleChange("resolution", value)}
                  value={initialConfig.resolution}
                >
                  <SelectTrigger className={errors.resolution ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024x768">1024x768</SelectItem>
                    <SelectItem value="1280x1024">1280x1024</SelectItem>
                    <SelectItem value="1920x1080">1920x1080</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {errors.resolution && (
                  <span className="absolute -bottom-5 text-xs text-red-500">
                    {errors.resolution.message}
                  </span>
                )}
              </div>
              {initialConfig.resolution === "custom" && (
                <div>
                  <Label htmlFor="customResolution">Custom Resolution</Label>
                  <Input
                    id="customResolution"
                    value={initialConfig.customResolution}
                    onChange={(e) =>
                      handleChange("customResolution", e.target.value)
                    }
                    placeholder="WidthxHeight"
                  />
                </div>
              )}
              <div className="relative">
                <Label htmlFor="colorDepth" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Color Depth
                </Label>
                <Select
                  onValueChange={(value) => handleChange("colorDepth", value)}
                  value={initialConfig.colorDepth}
                >
                  <SelectTrigger className={errors.colorDepth ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select color depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8-bit</SelectItem>
                    <SelectItem value="16">16-bit</SelectItem>
                    <SelectItem value="24">24-bit</SelectItem>
                    <SelectItem value="32">32-bit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.colorDepth && (
                  <span className="absolute -bottom-5 text-xs text-red-500">
                    {errors.colorDepth.message}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="screen">Screen</Label>
                <Input
                  id="screen"
                  value={initialConfig.screen}
                  onChange={(e) => handleChange("screen", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="refreshRate">Refresh Rate (Hz)</Label>
                <Input
                  id="refreshRate"
                  type="number"
                  value={initialConfig.refreshRate}
                  onChange={(e) =>
                    handleChange("refreshRate", parseInt(e.target.value))
                  }
                  placeholder="60"
                />
              </div>
            </div>

            {lastError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{lastError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div
              className="mt-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
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
                  <motion.div
                    key={name}
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
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
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-2">Logs</h3>
              <ScrollArea className="h-48 border rounded-md p-2">
                <AnimatePresence>
                  {logs.map((log: Log, i: number) => (
                    <motion.div
                      key={i}
                      className={`text-sm mb-1 ${
                        log.type === "error"
                          ? "text-red-500"
                          : log.type === "warning"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString()}:{" "}
                      {log.message}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </motion.div>

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
      </motion.div>

      <motion.div
        className="lg:w-1/3 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Xvfb Instances</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={addInstance} className="w-full mb-4">
              Add New Instance
            </Button>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <AnimatePresence>
                {instances.map((instance) => (
                  <motion.div
                    key={instance.id}
                    className="p-4 border rounded-lg mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3>Display {instance.display}</h3>
                      <Badge>{instance.status}</Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeInstance(instance.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
