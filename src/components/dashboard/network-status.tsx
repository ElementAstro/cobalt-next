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
  Signal,
  Clock,
  HardDrive,
  Globe,
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
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";

const statusColors = {
  online: "text-green-500",
  offline: "text-red-500",
  slow: "text-yellow-500",
};

export function NetworkStatus() {
  const networkStatus = useNetworkStatus();
  const [status, setStatus] = useState<"online" | "offline" | "slow">("online");
  const [currentSpeed, setCurrentSpeed] = useState({ download: 0, upload: 0 });
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
    dns: "N/A",
    packetLoss: 0,
    jitter: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const refreshNetworkStatus = async () => {
    try {
      const response = await fetch("/api/network-status");
      const data = await response.json();
      setCurrentSpeed(data.speed);
      setSpeedHistory((prev) => [
        ...prev.slice(-29), // Keep last 30 entries
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
        return <Wifi className="h-5 w-5" />;
      case "offline":
        return <WifiOff className="h-5 w-5" />;
      case "slow":
        return <AlertCircle className="h-5 w-5" />;
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group relative",
              statusColors[status]
            )}
            aria-label="Network Status"
            disabled={isRefreshing}
          >
            <AnimatePresence mode="wait">
              {isRefreshing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center"
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="font-medium">{getStatusText()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <ArrowDown className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Download</span>
                  </div>
                  <div className="text-xl font-semibold mt-1">
                    {currentSpeed.download.toFixed(2)} Mbps
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Upload</span>
                  </div>
                  <div className="text-xl font-semibold mt-1">
                    {currentSpeed.upload.toFixed(2)} Mbps
                  </div>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={speedHistory}>
                    <defs>
                      <linearGradient
                        id="downloadGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="uploadGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={formatTime}
                      formatter={(value: number) => value.toFixed(2) + " Mbps"}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="download"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#downloadGradient)"
                      name="Download"
                    />
                    <Area
                      type="monotone"
                      dataKey="upload"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#uploadGradient)"
                      name="Upload"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="info">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Network Information</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={<Signal className="h-4 w-4" />}
                  title="Signal Strength"
                  value={networkInfo.signalStrength || "N/A"}
                />
                <InfoCard
                  icon={<Clock className="h-4 w-4" />}
                  title="Latency"
                  value={
                    networkInfo.latency === -1
                      ? "N/A"
                      : `${networkInfo.latency} ms`
                  }
                />
                <InfoCard
                  icon={<Globe className="h-4 w-4" />}
                  title="IP Address"
                  value={networkInfo.ipAddress || "N/A"}
                />
                <InfoCard
                  icon={<HardDrive className="h-4 w-4" />}
                  title="Network Type"
                  value={networkInfo.type}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="usage">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Data Usage</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={<ArrowDown className="h-4 w-4 text-green-500" />}
                  title="Download"
                  value={formatBytes(
                    networkInfo.dataUsage.download * 1024 * 1024
                  )}
                />
                <InfoCard
                  icon={<ArrowUp className="h-4 w-4 text-red-500" />}
                  title="Upload"
                  value={formatBytes(
                    networkInfo.dataUsage.upload * 1024 * 1024
                  )}
                />
              </div>

              <div className="h-48">
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
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

interface SpeedData {
  timestamp: number;
  download: number;
  upload: number;
}
