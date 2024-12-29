"use client";

import { useEffect, useState } from "react";
import {
  Wifi,
  WifiOff,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Activity,
  Database,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useNetworkStatus } from "@/hooks/use-network-connection";
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
  const networkStatus = useNetworkStatus();
  const [status, setStatus] = useState("online");

  useEffect(() => {
    if (!networkStatus.online) {
      setStatus("offline");
    } else if (
      networkStatus.effectiveType === "slow-2g" ||
      networkStatus.effectiveType === "2g"
    ) {
      setStatus("slow");
    } else {
      setStatus("online");
    }
  }, [networkStatus]);
  const [currentSpeed, setCurrentSpeed] = useState({ download: 0, upload: 0 });
  interface SpeedData {
    timestamp: number;
    download: number;
    upload: number;
  }
  const [speedHistory, setSpeedHistory] = useState<SpeedData[]>([]);
  const [networkInfo, setNetworkInfo] = useState({
    type: "Unknown",
    latency: -1,
    signalStrength: "N/A",
    ipAddress: "N/A",
    dataUsage: {
      download: 0,
      upload: 0,
    },
  });

  const refreshNetworkStatus = async () => {
    try {
      const response = await fetch("/api/network-status");
      const data = await response.json();
      setCurrentSpeed(data.speed);
      setSpeedHistory((prev) => [
        ...prev,
        {
          timestamp: Date.now(),
          download: data.speed.download,
          upload: data.speed.upload,
        },
      ]);
      setNetworkInfo(data.info);
    } catch (error) {
      console.error("Failed to fetch network status:", error);
    }
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      await refreshNetworkStatus();
    } catch (err) {
      setError("Failed to refresh network status");
    } finally {
      setIsRefreshing(false);
    }
  };

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
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group relative"
            aria-label="Network Status"
            disabled={isRefreshing}
          >
            <AnimatePresence>
              {isRefreshing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {getStatusIcon()}
                  <RefreshCw
                    className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRefresh}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
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
                <div>
                  <p className="text-gray-500">Signal Strength</p>
                  <p className="font-medium">
                    {networkInfo.signalStrength || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">IP Address</p>
                  <p className="font-medium">
                    {networkInfo.ipAddress || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="usage">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Data Usage</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
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
              <div className="h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      {
                        name: "Download",
                        value: networkInfo.dataUsage.download,
                      },
                      { name: "Upload", value: networkInfo.dataUsage.upload },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => value.toFixed(2) + " MB"}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      animationDuration={1000}
                    />
                    {error && (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        fill="#ff4d4f"
                        fontSize={14}
                      >
                        {error}
                      </text>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
