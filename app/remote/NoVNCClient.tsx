"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import ConnectionSettings from "./components/ConnectionSettings";
import ControlPanel from "./components/ControlPanel";
import CustomOptions from "./components/CustomOptions";
import PerformanceChart from "./components/PerformanceChart";
import ConnectionLogs from "./components/ConnectionLogs";
import { Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [keyboardShortcuts, setKeyboardShortcuts] = useState<boolean>(true);
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
        rfb.background = theme === "dark" ? "#000000" : "#ffffff";

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
  }, [host, port, password, viewOnly, clipboardSync, theme, logEvent]);

  const disconnectFromVNC = useCallback(() => {
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
      logEvent("手动断开 VNC 连接");
    }
    setIsConnected(false);
  }, [logEvent]);

  const handleScaleChange = useCallback(
    (value: number[]) => {
      setScale(value[0]);
      if (rfbRef.current && canvasRef.current) {
        rfbRef.current.scaleViewport = true;
        canvasRef.current.style.transform = `scale(${value[0] / 100})`;
        canvasRef.current.style.transformOrigin = "top left";
        logEvent(`缩放比例调整为 ${value[0]}%`);
      }
    },
    [logEvent]
  );

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
      logEvent("进入全屏模式");
    } else {
      document.exitFullscreen();
      logEvent("退出全屏模式");
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen, logEvent]);

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

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    logEvent(`主题切换为 ${newTheme} 模式`);
  }, [theme, logEvent]);

  const handleKeyboardShortcuts = useCallback(
    (checked: boolean) => {
      setKeyboardShortcuts(checked);
      if (rfbRef.current) {
        rfbRef.current.keyboardHandlers = checked
          ? rfbRef.current.defaultKeyboardHandlers
          : [];
        logEvent(`键盘快捷键 ${checked ? "启用" : "禁用"}`);
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
    <div className={`${theme === "dark" ? "dark" : "light"} h-screen flex`}>
      {/* 左侧边栏 */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-4 overflow-auto">
        {/* 连接设置 */}
        <ConnectionSettings
          host={host}
          port={port}
          password={password}
          isConnected={isConnected}
          setHost={setHost}
          setPort={setPort}
          setPassword={setPassword}
        />

        {/* 控制面板 */}
        <ControlPanel
          isConnected={isConnected}
          toggleFullscreen={toggleFullscreen}
          connectToVNC={connectToVNC}
          disconnectFromVNC={disconnectFromVNC}
          clipboardSync={clipboardSync}
          handleClipboardSync={handleClipboardSync}
          viewOnly={viewOnly}
          handleViewOnlyChange={handleViewOnlyChange}
          colorDepth={colorDepth.toString()}
          handleColorDepthChange={handleColorDepthChange}
        />

        {/* 额外自定义选项 */}
        <CustomOptions
          keyboardShortcuts={keyboardShortcuts}
          handleKeyboardShortcuts={handleKeyboardShortcuts}
          theme={theme}
          setTheme={setTheme}
        />

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

        {/* 连接日志 */}
        <ConnectionLogs logs={connectionLogs} />
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>noVNC 客户端</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col space-y-4"
            >
              {/* 错误信息 */}
              {error && <div className="text-red-500">{error}</div>}

              {/* 画布与图表 */}
              <div className="flex-1 flex flex-row space-x-4 overflow-hidden">
                {/* 画布容器 */}
                <div
                  ref={containerRef}
                  className="flex-1 border rounded overflow-hidden relative"
                >
                  <canvas ref={canvasRef} className="w-full h-full" />
                  {/* 连接状态图表 */}
                  {isConnected && (
                    <div className="absolute top-2 right-2 bg-gray-700 bg-opacity-75 p-2 rounded">
                      <PerformanceChart data={performanceData} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoVNCClient;
