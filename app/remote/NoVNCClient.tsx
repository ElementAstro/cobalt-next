"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clipboard, Expand, KeyRound, Layers } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ConnectionLog {
  timestamp: Date;
  message: string;
}

const NoVNCClient: React.FC = () => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [password, setPassword] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clipboardSync, setClipboardSync] = useState(true);
  const [viewOnly, setViewOnly] = useState(false);
  const [colorDepth, setColorDepth] = useState<24 | 16 | 8>(24);
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rfbRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 动态加载 RFB
  useEffect(() => {
    const loadRFB = async () => {
      if (typeof window !== "undefined") {
        const RFB = (await import("@novnc/novnc/lib/rfb")).default;
        rfbRef.current = RFB;
      }
    };
    loadRFB();
  }, []);

  const logEvent = useCallback((message: string) => {
    setConnectionLogs((prevLogs) => [
      ...prevLogs,
      { timestamp: new Date(), message },
    ]);
  }, []);

  const connectToVNC = useCallback(() => {
    if (!host || !port) {
      setError("请同时输入主机和端口");
      return;
    }

    setError(null);
    logEvent(`尝试连接到 ${host}:${port}`);

    const url = `wss://${host}:${port}`;

    if (canvasRef.current && rfbRef.current) {
      try {
        const rfb = new rfbRef.current(canvasRef.current, url, {
          credentials: password
            ? { username: "", password, target: "" }
            : undefined,
          shared: true,
          wsProtocols: [],
        });

        rfb.viewOnly = viewOnly;
        rfb.scaleViewport = true;
        rfb.qualityLevel = 6;
        rfb.compressionLevel = 2;
        rfb.showDotCursor = true;
        rfb.background = "#000000";

        rfb.addEventListener("connect", () => {
          setIsConnected(true);
          setError(null);
          logEvent("成功连接到 VNC 服务器");
        });

        rfb.addEventListener("disconnect", () => {
          setIsConnected(false);
          setError("与 VNC 服务器断开连接");
          logEvent("与 VNC 服务器断开连接");
        });

        rfb.addEventListener("credentialsrequired", () => {
          setError("需要 VNC 认证");
          logEvent("VNC 认证请求");
        });

        if (clipboardSync) {
          rfb.addEventListener("clipboard", (e: CustomEvent) => {
            navigator.clipboard.writeText(e.detail.text);
            logEvent("剪贴板同步数据接收");
          });
        }

        rfb.scaleViewport = true;
        rfb.resizeSession = true;

        rfbRef.current = rfb;
        logEvent("VNC 连接已初始化");
      } catch (err) {
        setError("连接到 VNC 服务器失败");
        logEvent("连接 VNC 服务器时发生错误");
      }
    }
  }, [host, port, password, viewOnly, clipboardSync, logEvent]);

  const disconnectFromVNC = useCallback(() => {
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
      logEvent("手动断开 VNC 连接");
    }
    setIsConnected(false);
  }, [logEvent]);

  const handleScaleChange = useCallback((value: number[]) => {
    setScale(value[0]);
    if (rfbRef.current && canvasRef.current) {
      rfbRef.current.scaleViewport = true;
      canvasRef.current.style.transform = `scale(${value[0] / 100})`;
      canvasRef.current.style.transformOrigin = "top left";
      logEvent(`缩放比例调整为 ${value[0]}%`);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
      logEvent("进入全屏模式");
    } else {
      document.exitFullscreen();
      logEvent("退出全屏模式");
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleClipboardSync = useCallback(
    (checked: boolean) => {
      setClipboardSync(checked);
      if (rfbRef.current) {
        if (checked) {
          rfbRef.current.addEventListener("clipboard", (e: CustomEvent) => {
            navigator.clipboard.writeText(e.detail.text);
            logEvent("启用剪贴板同步");
          });
        } else {
          rfbRef.current.removeEventListener("clipboard", () => {});
          logEvent("禁用剪贴板同步");
        }
      }
    },
    [logEvent]
  );

  const handleViewOnlyChange = useCallback(
    (checked: boolean) => {
      setViewOnly(checked);
      if (rfbRef.current) {
        rfbRef.current.viewOnly = checked;
        logEvent(`设置视图模式为 ${checked ? "仅查看" : "可交互"}`);
      }
    },
    [logEvent]
  );

  const handleColorDepthChange = useCallback(
    (value: string) => {
      const depth = parseInt(value) as 24 | 16 | 8;
      setColorDepth(depth);
      if (rfbRef.current) {
        switch (depth) {
          case 24:
            rfbRef.current.qualityLevel = 8;
            rfbRef.current.compressionLevel = 2;
            break;
          case 16:
            rfbRef.current.qualityLevel = 5;
            rfbRef.current.compressionLevel = 3;
            break;
          case 8:
            rfbRef.current.qualityLevel = 3;
            rfbRef.current.compressionLevel = 4;
            break;
        }
        logEvent(`颜色深度设置为 ${depth}-bit`);
      }
    },
    [logEvent]
  );

  // 全屏变化监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      logEvent(`全屏状态变化: ${!!document.fullscreenElement}`);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (rfbRef.current) {
        rfbRef.current.disconnect();
      }
    };
  }, [logEvent]);

  // 图表数据
  const performanceData = useMemo(() => {
    return connectionLogs
      .filter((log) => log.message.includes("frame"))
      .map((log, index) => ({
        name: `帧${index + 1}`,
        frameRate: Math.floor(Math.random() * 60) + 30, // 模拟帧率数据
        latency: Math.floor(Math.random() * 100) + 50, // 模拟延迟数据
      }));
  }, [connectionLogs]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>高级 noVNC 客户端</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* 连接设置 */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Input
              type="text"
              placeholder="VNC 主机"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              disabled={isConnected}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="VNC 端口"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              disabled={isConnected}
              className="flex-1"
            />
            <Input
              type="password"
              placeholder="密码 (可选)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isConnected}
              className="flex-1"
            />
          </div>

          {/* 控制面板 */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              {!isConnected ? (
                <Button onClick={connectToVNC}>连接</Button>
              ) : (
                <Button onClick={disconnectFromVNC} variant="destructive">
                  断开连接
                </Button>
              )}
              <Button onClick={toggleFullscreen}>
                <Expand className="h-4 w-4 mr-2" />
                {isFullscreen ? "退出全屏" : "全屏"}
              </Button>
            </div>
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clipboard className="h-4 w-4" />
                <Switch
                  checked={clipboardSync}
                  onCheckedChange={handleClipboardSync}
                />
                <span>剪贴板同步</span>
              </div>
              <div className="flex items-center space-x-2">
                <KeyRound className="h-4 w-4" />
                <Switch
                  checked={viewOnly}
                  onCheckedChange={handleViewOnlyChange}
                />
                <span>只读模式</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>颜色深度:</span>
                <Select
                  onValueChange={handleColorDepthChange}
                  value={colorDepth.toString()}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="选择颜色深度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24-bit</SelectItem>
                    <SelectItem value="16">16-bit</SelectItem>
                    <SelectItem value="8">8-bit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 错误信息 */}
          {error && <div className="text-red-500">{error}</div>}

          {/* 缩放控制 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>缩放: {scale}%</span>
            </div>
            <Slider
              value={[scale]}
              onValueChange={handleScaleChange}
              min={25}
              max={200}
              step={25}
            />
          </div>

          {/* 画布容器 */}
          <div
            ref={containerRef}
            className="border rounded overflow-hidden relative"
          >
            <canvas ref={canvasRef} className="w-full h-[600px]" />
            {/* 连接状态图表 */}
            {isConnected && (
              <div className="absolute top-2 right-2 bg-gray-700 bg-opacity-75 p-2 rounded">
                <ResponsiveContainer width={300} height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="frameRate"
                      stroke="#82ca9d"
                    />
                    <Line type="monotone" dataKey="latency" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 连接日志 */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>连接日志</CardTitle>
            </CardHeader>
            <CardContent className="h-40 overflow-y-auto bg-gray-800 text-gray-200 p-2 rounded">
              {connectionLogs.length === 0 ? (
                <div className="text-center text-gray-400">暂无日志</div>
              ) : (
                connectionLogs.map((log, index) => (
                  <div key={index} className="text-sm">
                    [{log.timestamp.toLocaleTimeString()}] {log.message}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default NoVNCClient;
