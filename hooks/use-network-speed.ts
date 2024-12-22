import { useEffect } from "react";
import {
  useNetworkStore,
  NetworkSpeed,
  NetworkInfo,
} from "@/lib/store/dashboard/wifi";

export function useNetworkSpeed() {
  const { updateSpeed, updateStatus, updateNetworkInfo } = useNetworkStore();

  useEffect(() => {
    let totalDownload = 0;
    let totalUpload = 0;

    const measureSpeed = async () => {
      // 模拟网络速度测试
      const download = Math.random() * 100;
      const upload = Math.random() * 20;
      const newSpeed: NetworkSpeed = {
        download,
        upload,
        timestamp: Date.now(),
      };

      updateSpeed(newSpeed);

      // 更新网络状态
      if (download < 1 || upload < 0.1) {
        updateStatus("slow");
      } else {
        updateStatus("online");
      }

      // 模拟数据使用量计算
      totalDownload += (download * 5) / 8; // 5秒内的下载量(MB)
      totalUpload += (upload * 5) / 8; // 5秒内的上传量(MB)

      updateNetworkInfo({
        dataUsage: {
          download: totalDownload,
          upload: totalUpload,
        },
      });
    };

    const measureLatency = async () => {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("https://www.example.com", {
          method: "HEAD",
          mode: "no-cors",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const latency = Date.now() - start;
        updateNetworkInfo({ latency });
      } catch (error) {
        console.error("Error measuring latency:", error);
        updateNetworkInfo({ latency: -1 }); // Use -1 to indicate an error
      }
    };

    const detectNetworkType = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;
      if (connection) {
        updateNetworkInfo({ type: connection.effectiveType || "unknown" });
      }
    };

    const handleOnline = () => updateStatus("online");
    const handleOffline = () => updateStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    measureSpeed();
    measureLatency();
    detectNetworkType();

    const speedInterval = setInterval(measureSpeed, 5000);
    const latencyInterval = setInterval(measureLatency, 10000);
    const networkTypeInterval = setInterval(detectNetworkType, 30000);

    return () => {
      clearInterval(speedInterval);
      clearInterval(latencyInterval);
      clearInterval(networkTypeInterval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [updateSpeed, updateStatus, updateNetworkInfo]);
}
