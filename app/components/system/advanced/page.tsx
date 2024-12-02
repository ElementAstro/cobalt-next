"use client";

import { useState, useEffect, useReducer } from "react";
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

interface ResourceLimitsState {
  maxCpuUsage: number;
  maxMemoryUsage: number;
  maxDiskUsage: number;
  maxNetworkUsage: number;
}

type Action =
  | { type: "SET_LIMITS"; payload: ResourceLimits }
  | { type: "UPDATE_CPU"; payload: number }
  | { type: "UPDATE_MEMORY"; payload: number }
  | { type: "UPDATE_DISK"; payload: number }
  | { type: "UPDATE_NETWORK"; payload: number }
  | { type: "RESET" };

const defaultLimits: ResourceLimits = {
  maxCpuUsage: 100,
  maxMemoryUsage: 100,
  maxDiskUsage: 100,
  maxNetworkUsage: 1000,
};

function reducer(
  state: ResourceLimitsState,
  action: Action
): ResourceLimitsState {
  switch (action.type) {
    case "SET_LIMITS":
      return { ...action.payload };
    case "UPDATE_CPU":
      return { ...state, maxCpuUsage: action.payload };
    case "UPDATE_MEMORY":
      return { ...state, maxMemoryUsage: action.payload };
    case "UPDATE_DISK":
      return { ...state, maxDiskUsage: action.payload };
    case "UPDATE_NETWORK":
      return { ...state, maxNetworkUsage: action.payload };
    case "RESET":
      return { ...defaultLimits };
    default:
      return state;
  }
}

const ResourceSlider: React.FC<{
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit: string;
}> = ({ label, id, min, max, step, value, onChange, unit }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Slider
      id={id}
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(val) => onChange(val[0])}
    />
    <p className="text-sm text-muted-foreground">
      {value} {unit}
    </p>
  </div>
);

export default function Advanced() {
  const { user } = useAuth();
  const [groupBy, setGroupBy] = useState("none");
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, defaultLimits);

  useEffect(() => {
    const loadResourceLimits = async () => {
      try {
        const limits = await api.fetchResourceLimits();
        dispatch({ type: "SET_LIMITS", payload: limits });
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
      await api.updateResourceLimits(state);
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

  const handleReset = () => {
    dispatch({ type: "RESET" });
    toast({
      title: "Settings reset",
      description: "Resource limits have been reset to default values.",
    });
  };

  if (user?.role !== "admin") {
    return <div>您没有权限访问此页面。</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">高级设置</h1>
      <Card>
        <CardHeader>
          <CardTitle>进程分组</CardTitle>
          <CardDescription>选择在进程列表中如何分组进程</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="选择分组方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无分组</SelectItem>
              <SelectItem value="user">按用户分组</SelectItem>
              <SelectItem value="status">按状态分组</SelectItem>
              <SelectItem value="parent">按父进程分组</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>资源限制</CardTitle>
          <CardDescription>设置系统范围内的资源使用限制</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResourceSlider
            label="最大 CPU 使用率 (%)"
            id="max-cpu"
            min={0}
            max={100}
            step={1}
            value={state.maxCpuUsage}
            onChange={(val) => dispatch({ type: "UPDATE_CPU", payload: val })}
            unit="%"
          />
          <ResourceSlider
            label="最大内存使用率 (%)"
            id="max-memory"
            min={0}
            max={100}
            step={1}
            value={state.maxMemoryUsage}
            onChange={(val) =>
              dispatch({ type: "UPDATE_MEMORY", payload: val })
            }
            unit="%"
          />
          <ResourceSlider
            label="最大磁盘使用率 (%)"
            id="max-disk"
            min={0}
            max={100}
            step={1}
            value={state.maxDiskUsage}
            onChange={(val) => dispatch({ type: "UPDATE_DISK", payload: val })}
            unit="%"
          />
          <ResourceSlider
            label="最大网络使用量 (MB/s)"
            id="max-network"
            min={0}
            max={1000}
            step={10}
            value={state.maxNetworkUsage}
            onChange={(val) =>
              dispatch({ type: "UPDATE_NETWORK", payload: val })
            }
            unit="MB/s"
          />
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Button onClick={handleSave} className="flex-1">
            保存资源限制
          </Button>
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            重置为默认
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
