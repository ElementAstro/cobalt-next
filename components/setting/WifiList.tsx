import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  Wifi,
  Lock,
  Settings,
  RefreshCcw,
  Info,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useWifiStore } from "@/lib/store/wifi";
import { mockWifiService } from "@/utils/mock-wifi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WiFiNetwork } from "@/types/wifi";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "react-responsive";

const NetworkItem = React.memo(
  ({
    network,
    onConnect,
    onDisconnect,
    isConnected,
  }: {
    network: WiFiNetwork;
    onConnect: (network: WiFiNetwork, password?: string) => void;
    onDisconnect: () => void;
    isConnected: boolean;
  }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const handleConnect = async () => {
      if (network.isSecure && !password) {
        setShowPasswordInput(true);
        return;
      }
      setIsConnecting(true);
      try {
        await onConnect(network, password);
      } finally {
        setIsConnecting(false);
        setPassword("");
        setShowPasswordInput(false);
      }
    };

    return (
      <motion.div
        className="p-4 rounded-lg bg-card"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Wifi className="mr-2" />
            <span className="font-medium">{network.name}</span>
          </div>
          <div className="flex items-center">
            {network.isSecure && <Lock className="w-4 h-4 mr-2" />}
            <div className="w-6 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${network.signalStrength}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {network.frequency} {network.status && `• ${network.status}`}
        </div>
        {isConnected ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-500">已连接</span>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              断开连接
            </Button>
          </div>
        ) : (
          <>
            {showPasswordInput && network.isSecure && (
              <div className="flex mb-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="输入WiFi密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mr-2"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            <Button
              className="w-full mt-2"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isConnecting ? "连接中..." : "连接"}
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          className="w-full mt-2 flex items-center justify-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <ChevronUp className="mr-2" />
          ) : (
            <ChevronDown className="mr-2" />
          )}
          {showDetails ? "隐藏详情" : "显示详情"}
        </Button>
        {showDetails && (
          <div className="mt-2 text-sm">
            <p>信号强度: {network.signalStrength}%</p>
            <p>频段: {network.frequency}</p>
            <p>安全性: {network.isSecure ? "加密" : "开放"}</p>
            {network.lastConnected && (
              <p>
                上次连接: {new Date(network.lastConnected).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </motion.div>
    );
  }
);

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
    return [...networks].sort((a, b) => {
      // 首先按信号强度排序
      if (b.signalStrength !== a.signalStrength) {
        return b.signalStrength - a.signalStrength;
      }
      // 如果信号强度相同，最近连接的网络优先
      const aRecentIndex = recentNetworks.indexOf(a.id);
      const bRecentIndex = recentNetworks.indexOf(b.id);
      if (aRecentIndex !== -1 && bRecentIndex !== -1) {
        return aRecentIndex - bRecentIndex;
      }
      if (aRecentIndex !== -1) return -1;
      if (bRecentIndex !== -1) return 1;
      // 如果都不是最近连接的，按名称字母顺序排序
      return a.name.localeCompare(b.name);
    });
  }, [networks, recentNetworks]);

  return (
    <div
      className={`max-w-4xl mx-auto p-4 bg-background text-foreground ${
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
        {/*  <div className="flex items-center justify-between mb-6">
          
             <Switch 
            checked={isWifiOn} 
            onCheckedChange={(checked) => {
              setWifiOn(checked)
              if (checked) {
                toast({
                  title: "WiFi已开启",
                  description: "正在扫描可用网络...",
                })
              } else {
                toast({
                  title: "WiFi已关闭",
                  description: "所有网络连接已断开",
                })
              }
            }} 
          />
            
        </div>
*/}
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
                    <RefreshCcw className="animate-spin" />
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={fetchNetworks}
            disabled={!isWifiOn || isLoading}
          >
            <RefreshCcw className="mr-2" />
            刷新
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="w-full text-primary flex items-center justify-center"
              >
                <Settings className="mr-2" />
                更多 Wi-Fi 设置
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wi-Fi 设置</DialogTitle>
                <DialogDescription>调整您的 Wi-Fi 连接首选项</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span>自动加入网络</span>
                  <Switch
                    checked={autoJoinNetworks}
                    onCheckedChange={setAutoJoinNetworks}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>通知可用网络</span>
                  <Switch
                    checked={notifyAvailableNetworks}
                    onCheckedChange={setNotifyAvailableNetworks}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>询问是否加入网络</span>
                  <Switch
                    checked={askToJoinNetworks}
                    onCheckedChange={setAskToJoinNetworks}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    首选频段
                  </label>
                  <Select
                    value={preferredBand}
                    onValueChange={setPreferredBand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择首选频段" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2.4GHz">2.4GHz</SelectItem>
                      <SelectItem value="5GHz">5GHz</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {isLandscape && !isNarrowLandscape ? (
        <div className="w-1/2 pl-4 border-l">
          <h2 className="text-lg font-semibold mb-4">网络详情</h2>
          {connectedNetwork ? (
            <div>
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
                {networks.find((n) => n.id === connectedNetwork)?.lastConnected}
              </p>
            </div>
          ) : (
            <p>未连接到任何网络</p>
          )}
        </div>
      ) : null}

      <div
        className={`mt-8 space-y-4 ${
          isLandscape && !isNarrowLandscape ? "w-1/2 pr-4" : "w-full"
        }`}
      >
        <h2 className="text-lg font-semibold">设置</h2>
        <div className="flex items-center justify-between">
          <span>深色模式</span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">主色调</label>
          <Slider
            defaultValue={[220]}
            max={360}
            step={1}
            onValueChange={([hue]) => {
              document.documentElement.style.setProperty(
                "--primary-hue",
                hue.toString()
              );
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>模拟模式</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Switch
                    checked={isMockMode}
                    onCheckedChange={toggleMockMode}
                  />
                  <Info className="ml-2 w-4 h-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>模拟模式用于测试和演示目的，不会影响实际的WiFi连接。</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isNarrowLandscape && (
        <div className="bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNetworks}
            disabled={!isWifiOn || isLoading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wi-Fi 设置</DialogTitle>
                <DialogDescription>调整您的 Wi-Fi 连接首选项</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span>自动加入网络</span>
                  <Switch
                    checked={autoJoinNetworks}
                    onCheckedChange={setAutoJoinNetworks}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>通知可用网络</span>
                  <Switch
                    checked={notifyAvailableNetworks}
                    onCheckedChange={setNotifyAvailableNetworks}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>询问是否加入网络</span>
                  <Switch
                    checked={askToJoinNetworks}
                    onCheckedChange={setAskToJoinNetworks}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    首选频段
                  </label>
                  <Select
                    value={preferredBand}
                    onValueChange={setPreferredBand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择首选频段" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2.4GHz">2.4GHz</SelectItem>
                      <SelectItem value="5GHz">5GHz</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {connectedNetwork && (
            <div className="text-sm">
              <p>
                已连接: {networks.find((n) => n.id === connectedNetwork)?.name}
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
  );
}
