import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useWifiStore } from "@/lib/store/wifi";
import { mockWifiService } from "@/utils/mock-wifi";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "react-responsive";

import NetworkItem from "./WiFiItem";
import WiFiSettings from "./WiFiSettings";
import { WiFiNetwork } from "@/types/wifi";

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
  } = useWifiStore();

  const { theme, setTheme } = useTheme();
  const [isLandscape, setIsLandscape] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const isNarrowLandscape = useMediaQuery({
    query: "(max-height: 500px) and (orientation: landscape)",
  });

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
        className={`max-w-4xl mx-auto p-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark ${
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
                      <p className="text-center text-sm text-muted-foreground">
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
                    <p className="text-center text-sm text-muted-foreground">
                      未找到匹配的网络
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {isLandscape && !isNarrowLandscape && (
          <div className="pb-4 border-b dark:border-b-dark">
            <h2 className="text-lg font-semibold">网络详情</h2>
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
              </motion.div>
            ) : (
              <p>未连接到任何网络</p>
            )}
          </div>
        )}

        {isNarrowLandscape && (
          <div className="bottom-0 left-0 right-0 bg-background dark:bg-background-dark border-t dark:border-t-dark p-2 flex justify-between items-center">
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
