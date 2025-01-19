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
  const [error, setError] = useState<{
    message: string;
    retryCount: number;
  } | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null);

  useEffect(() => {
    const updateStatus = () => {
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
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, [networkStatus]);

  const refreshNetworkStatus = async (retryCount = 0) => {
    try {
      const response = await fetch("/api/network-status");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

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
      setError(null);
      setLastRefreshTime(Date.now());
    } catch (error) {
      if (retryCount < 3) {
        setTimeout(() => refreshNetworkStatus(retryCount + 1), 2000);
      } else {
        setError({
          message:
            error instanceof Error ? error.message : "Network request failed",
          retryCount: retryCount + 1,
        });
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshNetworkStatus();
    } catch (err) {
      setError({
        message: "Failed to refresh network status",
        retryCount: 0,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return (
          <motion.div
            key="online"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Wifi className="h-5 w-5" />
          </motion.div>
        );
      case "offline":
        return (
          <motion.div
            key="offline"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <WifiOff className="h-5 w-5" />
          </motion.div>
        );
      case "slow":
        return (
          <motion.div
            key="slow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5" />
          </motion.div>
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return (
          <motion.span
            key="online"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Connected
          </motion.span>
        );
      case "offline":
        return (
          <motion.span
            key="offline"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Disconnected
          </motion.span>
        );
      case "slow":
        return (
          <motion.span
            key="slow"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Slow Connection
          </motion.span>
        );
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

  const calculateNetworkQuality = (info: typeof networkInfo) => {
    let score = 0;

    // Signal strength (0-40)
    if (info.signalStrength !== "N/A") {
      const signal = parseFloat(info.signalStrength);
      if (!isNaN(signal)) {
        score += Math.min(Math.max(signal, 0), 40);
      }
    }

    // Latency (0-30)
    if (info.latency !== -1) {
      score += Math.max(0, 30 - Math.min(info.latency / 10, 30));
    }

    // Packet loss (0-20)
    score += Math.max(0, 20 - info.packetLoss * 20);

    // Jitter (0-10)
    if (info.jitter > 0) {
      score += Math.max(0, 10 - info.jitter / 2);
    }

    return Math.round(Math.min(Math.max(score, 0), 100) / 10);
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

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Network Quality</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {calculateNetworkQuality(networkInfo)}/10
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${calculateNetworkQuality(networkInfo) * 10}%`,
                      }}
                    />
                  </div>
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
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="w-full"
                  disabled={isRefreshing}
                >
                  <AnimatePresence mode="wait">
                    {isRefreshing ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Refreshing...
                      </motion.div>
                    ) : error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center text-red-500"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Refresh Failed
                      </motion.div>
                    ) : (
                      <motion.div
                        key="normal"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Status
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                {!isRefreshing && !error && lastRefreshTime && (
                  <div className="absolute -bottom-5 left-0 right-0 text-xs text-gray-500 text-center">
                    Last refreshed: {formatTime(lastRefreshTime)}
                  </div>
                )}
              </div>
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
