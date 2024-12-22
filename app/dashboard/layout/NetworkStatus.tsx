"use client";

import { useEffect } from "react";
import {
  Wifi,
  WifiOff,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Activity,
  Database,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNetworkSpeed } from "@/hooks/use-network-speed";
import { useNetworkStore } from "@/lib/store/dashboard/wifi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function NetworkStatus() {
  const { status, currentSpeed, speedHistory, networkInfo } = useNetworkStore();
  useNetworkSpeed(); // 使用这个hook来更新网络状态

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <Wifi className="h-5 w-5 text-green-500" />;
      case "offline":
        return <WifiOff className="h-5 w-5 text-red-500" />;
      case "slow":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Connected";
      case "offline":
        return "Disconnected";
      case "slow":
        return "Slow Connection";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Network Status"
        >
          {getStatusIcon()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] max-w-[400px] p-4">
        <Tabs defaultValue="speed">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="speed">Speed</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>
          <TabsContent value="speed">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="font-medium">{getStatusText()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <ArrowDown className="h-4 w-4 text-green-500" />
                  <span>{currentSpeed.download.toFixed(2)} Mbps</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowUp className="h-4 w-4 text-red-500" />
                  <span>{currentSpeed.upload.toFixed(2)} Mbps</span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={speedHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={formatTime}
                      formatter={(value: number) => value.toFixed(2) + " Mbps"}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="download"
                      stroke="#82ca9d"
                      name="Download"
                    />
                    <Line
                      type="monotone"
                      dataKey="upload"
                      stroke="#8884d8"
                      name="Upload"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="info">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Network Information</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Network Type</p>
                  <p className="font-medium">{networkInfo.type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Latency</p>
                  <p className="font-medium">
                    {networkInfo.latency === -1
                      ? "Measurement failed"
                      : `${networkInfo.latency} ms`}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="usage">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Data Usage</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Download</p>
                  <p className="font-medium">
                    {networkInfo.dataUsage.download.toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Upload</p>
                  <p className="font-medium">
                    {networkInfo.dataUsage.upload.toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
