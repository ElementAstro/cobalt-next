import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useApiService } from "@/services/device-connection";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function AdvancedTab() {
  const { fetchAdvancedSettings, updateAdvancedSettings } = useApiService();
  const [settings, setSettings] = useState({
    updateInterval: 1000,
    connectionTimeout: 30,
    debugMode: false,
    logLevel: "info",
    maxRetries: 3,
    connectionBuffer: 1024,
    keepAliveInterval: 30,
  });

  const [logs, setLogs] = useState<
    Array<{
      timestamp: string;
      level: string;
      message: string;
    }>
  >([]);

  useEffect(() => {
    fetchAdvancedSettings().then((data) => {
      setSettings({
        updateInterval: data.updateInterval ?? 1000,
        connectionTimeout: data.connectionTimeout ?? 30,
        debugMode: data.debugMode ?? false,
        logLevel: data.logLevel ?? "info",
        maxRetries: data.maxRetries ?? 3,
        connectionBuffer: data.connectionBuffer ?? 1024,
        keepAliveInterval: data.keepAliveInterval ?? 30,
      });
    });
  }, [fetchAdvancedSettings]);

  const handleChange = (field: string, value: number | boolean | string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    updateAdvancedSettings({ [field]: value }).catch((error) => {
      console.error("Failed to update advanced settings:", error);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Settings</CardTitle>
          </CardHeader>
          <div>
            <Label htmlFor="updateInterval">Update Interval (ms)</Label>
            <Input
              id="updateInterval"
              type="number"
              value={settings.updateInterval}
              onChange={(e) =>
                handleChange("updateInterval", parseInt(e.target.value))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="timeout">Connection Timeout (s)</Label>
            <Input
              id="timeout"
              type="number"
              value={settings.connectionTimeout}
              onChange={(e) =>
                handleChange("connectionTimeout", parseInt(e.target.value))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="logLevel">Log Level</Label>
            <Input
              id="logLevel"
              type="text"
              value={settings.logLevel}
              onChange={(e) => handleChange("logLevel", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxRetries">Max Retries</Label>
            <Input
              id="maxRetries"
              type="number"
              value={settings.maxRetries}
              onChange={(e) =>
                handleChange("maxRetries", parseInt(e.target.value))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="connectionBuffer">Connection Buffer (bytes)</Label>
            <Input
              id="connectionBuffer"
              type="number"
              value={settings.connectionBuffer}
              onChange={(e) =>
                handleChange("connectionBuffer", parseInt(e.target.value))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="keepAliveInterval">Keep Alive Interval (s)</Label>
            <Input
              id="keepAliveInterval"
              type="number"
              value={settings.keepAliveInterval}
              onChange={(e) =>
                handleChange("keepAliveInterval", parseInt(e.target.value))
              }
              className="mt-1"
            />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Debug Settings</CardTitle>
          </CardHeader>
          <div className="flex items-center space-x-2">
            <Switch
              id="debugMode"
              checked={settings.debugMode}
              onCheckedChange={(checked) => handleChange("debugMode", checked)}
            />
            <Label htmlFor="debugMode">Enable Debug Mode</Label>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <ScrollArea className="h-64">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.level}</TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}
