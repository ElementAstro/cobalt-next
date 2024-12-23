import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "react-responsive";

import NetworkItem from "./WiFiItem";
import WiFiSettings from "./WiFiSettings";
import { WiFiNetwork } from "@/types/wifi";
import { mockWifiService } from "@/utils/mock-wifi";

interface WiFiState {
  isWifiOn: boolean;
  networks: WiFiNetwork[];
  connectedNetwork: string | null;
  isMockMode: boolean;
  isLoading: boolean;
  autoJoinNetworks: boolean;
  notifyAvailableNetworks: boolean;
  askToJoinNetworks: boolean;
  preferredBand: string;
  recentNetworks: WiFiNetwork[];
  wifiPower: "high" | "medium" | "low";
  connectionHistory: WiFiNetwork[];
  networkStats: {
    [key: string]: {
      successfulConnections: number;
      lastConnectionSpeed: number;
      averageSignalStrength: number;
    };
  };
  setWifiOn: (on: boolean) => void;
  setNetworks: (nets: WiFiNetwork[]) => void;
  connectToNetwork: (id: string) => void;
  disconnectFromNetwork: () => void;
  toggleMockMode: () => void;
  setLoading: (loading: boolean) => void;
  setAutoJoinNetworks: (autoJoin: boolean) => void;
  setNotifyAvailableNetworks: (notify: boolean) => void;
  setAskToJoinNetworks: (ask: boolean) => void;
  setPreferredBand: (band: string) => void;
  setWifiPower: (power: "high" | "medium" | "low") => void;
  addToHistory: (network: WiFiNetwork) => void;
  updateNetworkStats: (networkId: string, stats: any) => void;
}

export const useWifiStore = create<WiFiState>((set) => ({
  isWifiOn: true,
  networks: [],
  connectedNetwork: null,
  isMockMode: false,
  isLoading: false,
  autoJoinNetworks: true,
  notifyAvailableNetworks: true,
  askToJoinNetworks: true,
  preferredBand: "auto",
  recentNetworks: [],
  wifiPower: "high",
  connectionHistory: [],
  networkStats: {},
  setWifiOn: (on) => set({ isWifiOn: on }),
  setNetworks: (nets) => set({ networks: nets }),
  connectToNetwork: (id) => set({ connectedNetwork: id }),
  disconnectFromNetwork: () => set({ connectedNetwork: null }),
  toggleMockMode: () => set((state) => ({ isMockMode: !state.isMockMode })),
  setLoading: (loading) => set({ isLoading: loading }),
  setAutoJoinNetworks: (autoJoin) => set({ autoJoinNetworks: autoJoin }),
  setNotifyAvailableNetworks: (notify) =>
    set({ notifyAvailableNetworks: notify }),
  setAskToJoinNetworks: (ask) => set({ askToJoinNetworks: ask }),
  setPreferredBand: (band) => set({ preferredBand: band }),
  setWifiPower: (power) => set({ wifiPower: power }),
  addToHistory: (network) =>
    set((state) => ({
      connectionHistory: [...state.connectionHistory, network],
    })),
  updateNetworkStats: (networkId, stats) =>
    set((state) => ({
      networkStats: {
        ...state.networkStats,
        [networkId]: {
          ...state.networkStats[networkId],
          ...stats,
        },
      },
    })),
}));

export default function WiFiList() {
  const {
    isWifiOn,
    networks,
    connectedNetwork,
    isMockMode,
    isLoading,
    autoJoinNetworks,
    notifyAvailableNetworks,
    askToJoinNetworks,
    preferredBand,
    setWifiOn,
    setNetworks,
    connectToNetwork,
    disconnectFromNetwork,
    toggleMockMode,
    setLoading,
    setAutoJoinNetworks,
    setNotifyAvailableNetworks,
    setAskToJoinNetworks,
    setPreferredBand,
    recentNetworks,
    wifiPower,
    setWifiPower,
  } = useWifiStore();

  const { theme, setTheme } = useTheme();
  const [isLandscape, setIsLandscape] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const isNarrowLandscape = useMediaQuery({
    query: "(max-height: 500px) and (orientation: landscape)",
  });

  const [networkStats, setNetworkStats] = useState<{ [key: string]: any }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const fetchNetworks = useCallback(async () => {
    setLoading(true);
    setScanProgress(0);
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 500);

    try {
      const fetchedNetworks = isMockMode
        ? await mockWifiService.getNetworks()
        : await fetch("/api/wifi/networks").then((res) => res.json());
      setNetworks(fetchedNetworks);
      toast({
        title: "扫描完成",
        description: `发现 ${fetchedNetworks.length} 个WiFi网络`,
      });
    } catch (error) {
      console.error("Failed to fetch networks:", error);
      toast({
        title: "错误",
        description: "获取网络列表失败，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      clearInterval(scanInterval);
      setScanProgress(100);
    }
  }, [isMockMode, setLoading, setNetworks]);

  useEffect(() => {
    if (isWifiOn) {
      fetchNetworks();
    } else {
      setNetworks([]);
    }
  }, [isWifiOn, isMockMode, fetchNetworks, setNetworks]);

  const handleConnect = useCallback(
    async (network: WiFiNetwork, password?: string) => {
      setLoading(true);
      try {
        if (isMockMode) {
          await mockWifiService.connectToNetwork(network.id);
        } else {
          await fetch(`/api/wifi/connect`, {
            method: "POST",
            body: JSON.stringify({ networkId: network.id, password }),
          });
        }
        connectToNetwork(network.id);
        toast({
          title: "连接成功",
          description: `已成功连接到 ${network.name}`,
        });
      } catch (error) {
        console.error("Failed to connect:", error);
        toast({
          title: "连接失败",
          description: "无法连接到网络，请重试。",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [isMockMode, connectToNetwork, setLoading]
  );

  const handleDisconnect = useCallback(async () => {
    setLoading(true);
    try {
      if (isMockMode) {
        await mockWifiService.disconnectFromNetwork();
      } else {
        await fetch(`/api/wifi/disconnect`, { method: "POST" });
      }
      disconnectFromNetwork();
      toast({
        title: "已断开连接",
        description: "已成功断开WiFi连接",
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast({
        title: "断开连接失败",
        description: "无法断开网络连接，请重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isMockMode, disconnectFromNetwork, setLoading]);

  const analyzeNetwork = useCallback(async (networkId: string) => {
    setIsAnalyzing(true);
    try {
      // 模拟网络分析
      const stats = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            latency: Math.round(Math.random() * 100),
            bandwidth: Math.round(Math.random() * 100),
            interference: Math.round(Math.random() * 100),
          });
        }, 1500)
      );

      setNetworkStats((prev) => ({
        ...prev,
        [networkId]: stats,
      }));
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const NetworkStatistics = ({ network }: { network: WiFiNetwork }) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mt-4 p-4 bg-secondary/10 rounded-lg"
    >
      <p>延迟: {networkStats[network.id]?.latency} ms</p>
      <p>带宽: {networkStats[network.id]?.bandwidth} Mbps</p>
      <p>干扰: {networkStats[network.id]?.interference} %</p>
    </motion.div>
  );

  const sortedNetworks = useMemo(() => {
    return [...networks]
      .filter((network) =>
        network.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (b.signalStrength !== a.signalStrength) {
          return b.signalStrength - a.signalStrength;
        }
        const aRecentIndex = recentNetworks.findIndex((n) => n.id === a.id);
        const bRecentIndex = recentNetworks.findIndex((n) => n.id === b.id);
        if (aRecentIndex !== -1 && bRecentIndex !== -1) {
          return aRecentIndex - bRecentIndex;
        }
        if (aRecentIndex !== -1) return -1;
        if (bRecentIndex !== -1) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [networks, recentNetworks, searchTerm]);

  return (
    <ScrollArea className="mb-2">
      <div
        className={`max-w-4xl mx-auto p-4 bg-background dark:bg-gray-900 text-foreground dark:text-white ${
          isLandscape && !isNarrowLandscape ? "flex" : ""
        }`}
      >
        <motion.div
          className={`${
            isLandscape && !isNarrowLandscape ? "w-1/2 pr-4" : "w-full"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="搜索WiFi网络"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mr-2"
              />
              <Button
                variant="outline"
                onClick={fetchNetworks}
                disabled={!isWifiOn || isLoading}
              >
                <RefreshCcw className="mr-2" />
                刷新
              </Button>
            </div>
            <AnimatePresence>
              {isWifiOn && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="animate-spin text-primary" />
                      </div>
                      <Progress value={scanProgress} className="w-full" />
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        正在扫描WiFi网络...
                      </p>
                    </div>
                  ) : (
                    sortedNetworks.map((network) => (
                      <NetworkItem
                        key={network.id}
                        network={network}
                        onConnect={handleConnect}
                        onDisconnect={handleDisconnect}
                        isConnected={network.id === connectedNetwork}
                      />
                    ))
                  )}
                  {sortedNetworks.length === 0 && !isLoading && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      未找到匹配的网络
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {isLandscape && !isNarrowLandscape && (
          <motion.div
            className="pb-4 border-b dark:border-gray-700 w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold mb-2">网络详情</h2>
            {connectedNetwork ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p>
                  当前连接到:{" "}
                  {networks.find((n) => n.id === connectedNetwork)?.name}
                </p>
                <p>
                  信号强度:{" "}
                  {
                    networks.find((n) => n.id === connectedNetwork)
                      ?.signalStrength
                  }
                  %
                </p>
                <p>
                  频段:{" "}
                  {networks.find((n) => n.id === connectedNetwork)?.frequency}
                </p>
                <p>
                  安全性:{" "}
                  {networks.find((n) => n.id === connectedNetwork)?.isSecure
                    ? "加密"
                    : "开放"}
                </p>
                <p>
                  最后连接时间:{" "}
                  {networks.find((n) => n.id === connectedNetwork)
                    ?.lastConnected
                    ? new Date(
                        networks.find(
                          (n) => n.id === connectedNetwork
                        )?.lastConnected!
                      ).toLocaleString()
                    : "无"}
                </p>
                <NetworkStatistics
                  network={networks.find((n) => n.id === connectedNetwork)!}
                />
              </motion.div>
            ) : (
              <p>未连接到任何网络</p>
            )}
          </motion.div>
        )}

        {isNarrowLandscape && (
          <div className="fixed bottom-0 left-0 right-0 bg-background dark:bg-gray-900 border-t dark:border-gray-700 p-2 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNetworks}
              disabled={!isWifiOn || isLoading}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              刷新
            </Button>
            <WiFiSettings
              autoJoinNetworks={autoJoinNetworks}
              setAutoJoinNetworks={setAutoJoinNetworks}
              notifyAvailableNetworks={notifyAvailableNetworks}
              setNotifyAvailableNetworks={setNotifyAvailableNetworks}
              askToJoinNetworks={askToJoinNetworks}
              setAskToJoinNetworks={setAskToJoinNetworks}
              preferredBand={preferredBand}
              setPreferredBand={setPreferredBand}
              toggleMockMode={toggleMockMode}
              wifiPower={wifiPower}
              setWifiPower={setWifiPower}
              saveNetworkHistory={false} // Add the appropriate value or state
              setSaveNetworkHistory={() => {}} // Add the appropriate function or state
              maxHistoryItems={0}
              setMaxHistoryItems={function (value: number): void {
                throw new Error("Function not implemented.");
              }}
            />
            {connectedNetwork && (
              <div className="text-sm">
                <p>
                  已连接:{" "}
                  {networks.find((n) => n.id === connectedNetwork)?.name}
                </p>
                <p>
                  信号:{" "}
                  {
                    networks.find((n) => n.id === connectedNetwork)
                      ?.signalStrength
                  }
                  %
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
