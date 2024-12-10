"use client";

interface BatteryManager {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  health?: string;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

import { useState, useEffect } from "react";
import {
  Battery,
  BatteryCharging,
  BatteryWarning,
  BatteryLow,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BatteryInfo {
  level: number;
  charging: boolean;
  health: string;
}

interface BatteryDisplayProps {
  showPercentage?: boolean;
  showChargingTime?: boolean;
  showHealth?: boolean;
  theme?: "light" | "dark";
  size?: "small" | "medium" | "large";
  alertThreshold?: number;
  onAlert?: () => void;
  refreshInterval?: number; // 自动刷新电池状态的间隔时间（毫秒）
}

export default function BatteryDisplay({
  showPercentage = true,
  showChargingTime = true,
  showHealth = true,
  theme = "light",
  size = "medium",
  alertThreshold = 20,
  onAlert,
  refreshInterval = 60000, // 默认每分钟刷新一次
}: BatteryDisplayProps) {
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({
    level: 100,
    charging: false,
    health: "Good",
  });
  const [chargingTime, setChargingTime] = useState<number | null>(null);
  const [dischargingTime, setDischargingTime] = useState<number | null>(null);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const updateBatteryInfo = () => {
      if (battery) {
        setBatteryInfo({
          level: battery.level * 100,
          charging: battery.charging,
          health: battery.health || "Good",
        });
        setChargingTime(battery.chargingTime);
        setDischargingTime(battery.dischargingTime);

        // 电量低于阈值时触发警报
        if (battery.level * 100 <= alertThreshold && !battery.charging) {
          setIsAlert(true);
          onAlert && onAlert();
        } else {
          setIsAlert(false);
        }
      }
    };

    const initBattery = async () => {
      if ("getBattery" in navigator) {
        battery = await (navigator as any).getBattery();
        updateBatteryInfo();

        if (battery) {
          battery.addEventListener("levelchange", updateBatteryInfo);
          battery.addEventListener("chargingchange", updateBatteryInfo);
          battery.addEventListener("chargingtimechange", updateBatteryInfo);
          battery.addEventListener("dischargingtimechange", updateBatteryInfo);
          battery.addEventListener("healthchange" as any, updateBatteryInfo);
        }
      }
    };

    initBattery();

    // 自动刷新电池状态
    const interval = setInterval(() => {
      updateBatteryInfo();
    }, refreshInterval);

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", updateBatteryInfo);
        battery.removeEventListener("chargingchange", updateBatteryInfo);
        battery.removeEventListener("chargingtimechange", updateBatteryInfo);
        battery.removeEventListener("dischargingtimechange", updateBatteryInfo);
        battery.removeEventListener("healthchange" as any, updateBatteryInfo);
      }
      clearInterval(interval);
    };
  }, [alertThreshold, onAlert, refreshInterval]);

  const getBatteryColor = (level: number) => {
    if (level > 50) return theme === "light" ? "bg-green-500" : "bg-green-400";
    if (level > 20)
      return theme === "light" ? "bg-yellow-500" : "bg-yellow-400";
    return theme === "light" ? "bg-red-500" : "bg-red-400";
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-20 h-10";
      case "large":
        return "w-40 h-20";
      default:
        return "w-32 h-16";
    }
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === Infinity) return "未知";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时 ${minutes}分钟`;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        theme === "light" ? "bg-gray-100" : "bg-gray-800"
      }`}
    >
      <motion.div
        className={`${
          theme === "light" ? "bg-white" : "bg-gray-700"
        } p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`relative ${getSizeClass()} border-2 ${
            theme === "light" ? "border-gray-300" : "border-gray-500"
          } rounded-full overflow-hidden`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`absolute bottom-0 left-0 right-0 ${getBatteryColor(
              batteryInfo.level
            )}`}
            initial={{ height: 0 }}
            animate={{ height: `${batteryInfo.level}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {showPercentage && (
                <motion.span
                  key="percentage"
                  className={`text-2xl font-bold ${
                    theme === "light" ? "text-gray-800" : "text-white"
                  } mix-blend-difference`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.round(batteryInfo.level)}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <AnimatePresence>
          {isAlert && (
            <motion.div
              className="flex items-center text-red-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <BatteryLow className="w-6 h-6 mr-2" />
              <span>电量过低！</span>
            </motion.div>
          )}
          {!isAlert && batteryInfo.charging ? (
            <motion.div
              className={`flex items-center ${
                theme === "light" ? "text-green-500" : "text-green-400"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <BatteryCharging className="w-6 h-6 mr-2" />
              <span>充电中</span>
            </motion.div>
          ) : batteryInfo.level <= 20 ? (
            <motion.div
              className={`flex items-center ${
                theme === "light" ? "text-red-500" : "text-red-400"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <BatteryWarning className="w-6 h-6 mr-2" />
              <span>电量低</span>
            </motion.div>
          ) : (
            <motion.div
              className={`flex items-center ${
                theme === "light" ? "text-blue-500" : "text-blue-400"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Battery className="w-6 h-6 mr-2" />
              <span>电池正常</span>
            </motion.div>
          )}
        </AnimatePresence>
        {showChargingTime && (
          <motion.div
            className={`text-sm ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {batteryInfo.charging
              ? `充满电需要时间: ${formatTime(chargingTime)}`
              : `剩余使用时间: ${formatTime(dischargingTime)}`}
          </motion.div>
        )}
        {/* 手动刷新按钮 */}
        <motion.button
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 rounded ${
            theme === "light"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-400 text-white hover:bg-blue-500"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          刷新状态
        </motion.button>
      </motion.div>
    </div>
  );
}
