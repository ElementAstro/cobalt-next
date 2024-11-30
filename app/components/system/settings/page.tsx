"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useAuth } from "../components/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(
    user?.settings || {
      darkMode: false,
      refreshRate: 5,
      cpuWarningThreshold: 80,
      memoryWarningThreshold: 80,
      diskWarningThreshold: 80,
      networkWarningThreshold: 80,
      notifications: true,
      autoUpdate: true,
      dataRetentionDays: 30,
    }
  );
  const { toast } = useToast();

  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings);
    }
  }, [user]);

  useEffect(() => {
    setTheme(settings.darkMode ? "dark" : "light");
  }, [settings.darkMode, setTheme]);

  const handleSave = async () => {
    // In a real application, you would save the settings to the backend here
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, darkMode: checked })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="refresh-rate">Refresh Rate (seconds)</Label>
                <Input
                  id="refresh-rate"
                  type="number"
                  value={settings.refreshRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      refreshRate: Number(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cpu-warning">CPU Warning Threshold (%)</Label>
                <Slider
                  id="cpu-warning"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.cpuWarningThreshold]}
                  onValueChange={(value) =>
                    setSettings({ ...settings, cpuWarningThreshold: value[0] })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {settings.cpuWarningThreshold}%
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="memory-warning">
                  Memory Warning Threshold (%)
                </Label>
                <Slider
                  id="memory-warning"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.memoryWarningThreshold]}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      memoryWarningThreshold: value[0],
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {settings.memoryWarningThreshold}%
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-update">Auto Update</Label>
                <Switch
                  id="auto-update"
                  checked={settings.autoUpdate}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoUpdate: checked })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="data-retention">Data Retention (days)</Label>
                <Input
                  id="data-retention"
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      dataRetentionDays: Number(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button onClick={handleSave}>Save All Settings</Button>
    </div>
  );
}
