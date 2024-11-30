"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../components/auth-provider";
import { api } from "@/services/system";
import { ResourceLimits } from "@/types/system";

export default function Advanced() {
  const { user } = useAuth();
  const [resourceLimits, setResourceLimits] = useState<ResourceLimits>({
    maxCpuUsage: 100,
    maxMemoryUsage: 100,
    maxDiskUsage: 100,
    maxNetworkUsage: 100,
  });
  const [groupBy, setGroupBy] = useState("none");
  const { toast } = useToast();

  useEffect(() => {
    const loadResourceLimits = async () => {
      try {
        const limits = await api.fetchResourceLimits();
        setResourceLimits(limits);
      } catch (error) {
        console.error("Failed to fetch resource limits:", error);
        toast({
          title: "Error",
          description: "Failed to load resource limits. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadResourceLimits();
  }, [toast]);

  const handleSave = async () => {
    try {
      await api.updateResourceLimits(resourceLimits);
      toast({
        title: "Settings saved",
        description: "Resource limits have been updated.",
      });
    } catch (error) {
      console.error("Failed to save resource limits:", error);
      toast({
        title: "Error",
        description: "Failed to save resource limits. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (user?.role !== "admin") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Advanced Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Process Grouping</CardTitle>
          <CardDescription>
            Choose how to group processes in the process list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="user">Group by User</SelectItem>
              <SelectItem value="status">Group by Status</SelectItem>
              <SelectItem value="parent">Group by Parent Process</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resource Limits</CardTitle>
          <CardDescription>
            Set system-wide resource usage limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-cpu">Max CPU Usage (%)</Label>
            <Slider
              id="max-cpu"
              min={0}
              max={100}
              step={1}
              value={[resourceLimits.maxCpuUsage]}
              onValueChange={(value) =>
                setResourceLimits({ ...resourceLimits, maxCpuUsage: value[0] })
              }
            />
            <p className="text-sm text-muted-foreground">
              {resourceLimits.maxCpuUsage}%
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-memory">Max Memory Usage (%)</Label>
            <Slider
              id="max-memory"
              min={0}
              max={100}
              step={1}
              value={[resourceLimits.maxMemoryUsage]}
              onValueChange={(value) =>
                setResourceLimits({
                  ...resourceLimits,
                  maxMemoryUsage: value[0],
                })
              }
            />
            <p className="text-sm text-muted-foreground">
              {resourceLimits.maxMemoryUsage}%
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-disk">Max Disk Usage (%)</Label>
            <Slider
              id="max-disk"
              min={0}
              max={100}
              step={1}
              value={[resourceLimits.maxDiskUsage]}
              onValueChange={(value) =>
                setResourceLimits({ ...resourceLimits, maxDiskUsage: value[0] })
              }
            />
            <p className="text-sm text-muted-foreground">
              {resourceLimits.maxDiskUsage}%
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-network">Max Network Usage (MB/s)</Label>
            <Slider
              id="max-network"
              min={0}
              max={1000}
              step={10}
              value={[resourceLimits.maxNetworkUsage]}
              onValueChange={(value) =>
                setResourceLimits({
                  ...resourceLimits,
                  maxNetworkUsage: value[0],
                })
              }
            />
            <p className="text-sm text-muted-foreground">
              {resourceLimits.maxNetworkUsage} MB/s
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Resource Limits</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
