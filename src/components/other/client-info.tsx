"use client";

import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { RefreshCcw, Sun, Moon } from "lucide-react";

type ClientInfo = {
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  timezone: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean | null;
  online: boolean;
  performance: {
    memory?: string;
    loadTime: string;
  };
  battery?: {
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
  };
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  webGL: {
    renderer: string;
    vendor: string;
  };
  storage: {
    localStorageSize: number;
    sessionStorageSize: number;
  };
  network: {
    type: string;
    downlinkMax: number;
  };
  cpu: {
    cores: number;
  };
  mediaDevices: {
    audioinput: number;
    audiooutput: number;
    videoinput: number;
  };
  fonts?: string[];
};

export function ClientInfo() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const theme = "dark";

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();

    const getPerformanceLoadTime = (): string => {
      const [navigation] = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (navigation) {
        return `${Math.round(
          navigation.loadEventEnd - navigation.startTime
        )}ms`;
      }
      return "不可用";
    };

    const getMemoryInfo = (): string => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        return `${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(
          memory.jsHeapSizeLimit / 1048576
        )}MB`;
      }
      return "不可用";
    };

    const getWebGLInfo = (): { renderer: string; vendor: string } => {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension(
          "WEBGL_debug_renderer_info"
        );
        if (debugInfo) {
          const renderer =
            (gl as WebGLRenderingContext).getParameter(
              debugInfo.UNMASKED_RENDERER_WEBGL
            ) || "不可用";
          const vendor =
            (gl as WebGLRenderingContext).getParameter(
              debugInfo.UNMASKED_VENDOR_WEBGL
            ) || "不可用";
          return { renderer, vendor };
        }
      }
      return { renderer: "不可用", vendor: "不可用" };
    };

    const getFonts = (): string[] => {
      if (document.fonts) {
        const fonts: string[] = [];
        document.fonts.forEach((font) => fonts.push(font.family));
        return fonts;
      }
      return [];
    };

    const getClientInfo = async () => {
      const info: ClientInfo = {
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        device: result.device.type || "Desktop",
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack:
          navigator.doNotTrack === "1"
            ? true
            : navigator.doNotTrack === "0"
            ? false
            : null,
        online: navigator.onLine,
        performance: {
          memory: getMemoryInfo(),
          loadTime: getPerformanceLoadTime(),
        },
        webGL: getWebGLInfo(),
        storage: {
          localStorageSize: localStorage.length,
          sessionStorageSize: sessionStorage.length,
        },
        network: {
          type: "未知",
          downlinkMax: 0,
        },
        cpu: {
          cores: navigator.hardwareConcurrency || 1,
        },
        mediaDevices: {
          audioinput: 0,
          audiooutput: 0,
          videoinput: 0,
        },
        fonts: getFonts(),
      };

      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          info.battery = {
            charging: battery.charging,
            level: battery.level * 100,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          };
        } catch (error) {
          console.error("Battery API 错误:", error);
        }
      }

      if ("connection" in navigator && (navigator as any).connection) {
        const connection = (navigator as any).connection;
        info.connection = {
          effectiveType: connection.effectiveType || "未知",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        };
        info.network = {
          type: connection.effectiveType || "未知",
          downlinkMax: connection.downlinkMax || 0,
        };
      }

      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
          );
          info.geolocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (error) {
          console.error("地理位置错误:", error);
        }
      }

      // 媒体设备信息
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          info.mediaDevices = {
            audioinput: devices.filter((device) => device.kind === "audioinput")
              .length,
            audiooutput: devices.filter(
              (device) => device.kind === "audiooutput"
            ).length,
            videoinput: devices.filter((device) => device.kind === "videoinput")
              .length,
          };
        } catch (error) {
          console.error("媒体设备错误:", error);
        }
      }

      setClientInfo(info);
    };

    getClientInfo();
  }, []);

  const handleRefresh = () => {
    setClientInfo(null);
    // 重新获取客户端信息
    const parser = new UAParser();
    const result = parser.getResult();

    const getPerformanceLoadTime = (): string => {
      const [navigation] = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (navigation) {
        return `${Math.round(
          navigation.loadEventEnd - navigation.startTime
        )}ms`;
      }
      return "不可用";
    };

    const getMemoryInfo = (): string => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        return `${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(
          memory.jsHeapSizeLimit / 1048576
        )}MB`;
      }
      return "不可用";
    };

    const getWebGLInfo = (): { renderer: string; vendor: string } => {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension(
          "WEBGL_debug_renderer_info"
        );
        if (debugInfo) {
          const renderer =
            (gl as WebGLRenderingContext).getParameter(
              debugInfo.UNMASKED_RENDERER_WEBGL
            ) || "不可用";
          const vendor =
            (gl as WebGLRenderingContext).getParameter(
              debugInfo.UNMASKED_VENDOR_WEBGL
            ) || "不可用";
          return { renderer, vendor };
        }
      }
      return { renderer: "不可用", vendor: "不可用" };
    };

    const getFonts = (): string[] => {
      if (document.fonts) {
        const fonts: string[] = [];
        document.fonts.forEach((font) => fonts.push(font.family));
        return fonts;
      }
      return [];
    };

    const fetchClientInfo = async () => {
      const info: ClientInfo = {
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        device: result.device.type || "Desktop",
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack:
          navigator.doNotTrack === "1"
            ? true
            : navigator.doNotTrack === "0"
            ? false
            : null,
        online: navigator.onLine,
        performance: {
          memory: getMemoryInfo(),
          loadTime: getPerformanceLoadTime(),
        },
        webGL: getWebGLInfo(),
        storage: {
          localStorageSize: localStorage.length,
          sessionStorageSize: sessionStorage.length,
        },
        network: {
          type: "未知",
          downlinkMax: 0,
        },
        cpu: {
          cores: navigator.hardwareConcurrency || 1,
        },
        mediaDevices: {
          audioinput: 0,
          audiooutput: 0,
          videoinput: 0,
        },
        fonts: getFonts(),
      };

      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          info.battery = {
            charging: battery.charging,
            level: battery.level * 100,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          };
        } catch (error) {
          console.error("Battery API 错误:", error);
        }
      }

      if ("connection" in navigator && (navigator as any).connection) {
        const connection = (navigator as any).connection;
        info.connection = {
          effectiveType: connection.effectiveType || "未知",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        };
        info.network = {
          type: connection.effectiveType || "未知",
          downlinkMax: connection.downlinkMax || 0,
        };
      }

      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
          );
          info.geolocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (error) {
          console.error("地理位置错误:", error);
        }
      }

      // 媒体设备信息
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          info.mediaDevices = {
            audioinput: devices.filter((device) => device.kind === "audioinput")
              .length,
            audiooutput: devices.filter(
              (device) => device.kind === "audiooutput"
            ).length,
            videoinput: devices.filter((device) => device.kind === "videoinput")
              .length,
          };
        } catch (error) {
          console.error("媒体设备错误:", error);
        }
      }

      setClientInfo(info);
    };

    fetchClientInfo();
  };

  if (!clientInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
          <span className="text-sm text-muted-foreground">加载中...</span>
        </div>
      </div>
    );
  }

  const performanceData = [
    {
      name: "内存使用",
      value: parseInt(clientInfo.performance.memory || "0"),
    },
    {
      name: "页面加载时间",
      value: parseInt(clientInfo.performance.loadTime),
    },
  ];

  return (
    <div
      className={`container mx-auto p-2 sm:p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">客户端信息</h1>
              </div>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <InfoCard
          title="系统"
          items={[
            { label: "浏览器", value: clientInfo.browser },
            { label: "操作系统", value: clientInfo.os },
            { label: "设备类型", value: clientInfo.device },
            { label: "屏幕分辨率", value: clientInfo.screen },
            { label: "语言", value: clientInfo.language },
            { label: "时区", value: clientInfo.timezone },
          ]}
        />
        <InfoCard
          title="网络"
          items={[
            { label: "在线状态", value: clientInfo.online ? "是" : "否" },
            {
              label: "启用 Cookie",
              value: clientInfo.cookiesEnabled ? "是" : "否",
            },
            {
              label: "请勿追踪",
              value:
                clientInfo.doNotTrack === null
                  ? "未设置"
                  : clientInfo.doNotTrack
                  ? "启用"
                  : "禁用",
            },
            ...(clientInfo.connection
              ? [
                  {
                    label: "连接类型",
                    value: clientInfo.connection.effectiveType,
                  },
                  {
                    label: "下行带宽",
                    value: `${clientInfo.connection.downlink} Mbps`,
                  },
                  {
                    label: "往返时间",
                    value: `${clientInfo.connection.rtt} ms`,
                  },
                ]
              : []),
          ]}
        />
        <InfoCard
          title="性能"
          items={[
            {
              label: "内存使用",
              value: clientInfo.performance.memory || "不可用",
            },
            { label: "页面加载时间", value: clientInfo.performance.loadTime },
          ]}
        />
        {clientInfo.battery && (
          <InfoCard
            title="电池"
            items={[
              {
                label: "充电中",
                value: clientInfo.battery.charging ? "是" : "否",
              },
              {
                label: "电量",
                value: `${clientInfo.battery.level.toFixed(2)}%`,
              },
              {
                label: "充电时间",
                value:
                  clientInfo.battery.chargingTime === Infinity
                    ? "不适用"
                    : `${clientInfo.battery.chargingTime} 秒`,
              },
              {
                label: "放电时间",
                value:
                  clientInfo.battery.dischargingTime === Infinity
                    ? "不适用"
                    : `${clientInfo.battery.dischargingTime} 秒`,
              },
            ]}
          />
        )}
        {clientInfo.geolocation && (
          <InfoCard
            title="地理位置"
            items={[
              {
                label: "纬度",
                value: clientInfo.geolocation.latitude.toFixed(6),
              },
              {
                label: "经度",
                value: clientInfo.geolocation.longitude.toFixed(6),
              },
            ]}
          />
        )}
        <InfoCard
          title="图形"
          items={[
            { label: "WebGL 渲染器", value: clientInfo.webGL.renderer },
            { label: "WebGL 厂商", value: clientInfo.webGL.vendor },
          ]}
        />
        <InfoCard
          title="存储"
          items={[
            {
              label: "本地存储项数",
              value: clientInfo.storage.localStorageSize,
            },
            {
              label: "会话存储项数",
              value: clientInfo.storage.sessionStorageSize,
            },
          ]}
        />
        <InfoCard
          title="硬件"
          items={[
            { label: "CPU 核心数", value: clientInfo.cpu.cores },
            {
              label: "音频输入设备",
              value: clientInfo.mediaDevices.audioinput,
            },
            {
              label: "音频输出设备",
              value: clientInfo.mediaDevices.audiooutput,
            },
            {
              label: "视频输入设备",
              value: clientInfo.mediaDevices.videoinput,
            },
          ]}
        />
        {clientInfo.fonts && (
          <InfoCard
            title="字体"
            items={[
              { label: "已安装字体数", value: clientInfo.fonts.length },
              ...clientInfo.fonts.map((font, index) => ({
                label: `字体 ${index + 1}`,
                value: font,
              })),
            ]}
          />
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({
  title,
  items,
  children,
}: {
  title: string;
  items: { label: string; value: string | number | boolean }[];
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-semibold">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          {children ? (
            children
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-right">
                    {item.value.toString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}