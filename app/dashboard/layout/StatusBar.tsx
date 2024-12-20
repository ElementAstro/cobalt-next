import { useState, useEffect } from "react";
import {
  Battery,
  Bluetooth,
  Moon,
  Wifi,
  Sun,
  BellRing,
  BellOff,
  Signal,
  Maximize,
  Minimize,
  Nfc as NFC,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStatusBarStore } from "@/lib/store/statusbar";

interface StatusBarProps {
  SimpleChart?: React.ComponentType;
}

export default function StatusBar({ SimpleChart }: StatusBarProps) {
  const [time, setTime] = useState(new Date());
  const store = useStatusBarStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        store.setBatteryLevel(Math.round(battery.level * 100));
        store.setCharging(battery.charging);

        battery.addEventListener("levelchange", () => {
          store.setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener("chargingchange", () => {
          store.setCharging(battery.charging);
        });
      });
    }

    const intervalId = setInterval(() => {
      store.setWifiStrength(Math.floor(Math.random() * 5));
      store.setCellularStrength(Math.floor(Math.random() * 5));
    }, 5000);

    const handleFullScreenChange = () => {
      store.setFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  const shouldShow =
    !store.isFullScreen || (store.isFullScreen && window.innerWidth <= 768);

  if (!shouldShow) return null;

  return (
    <motion.div
      className={`px-4 py-2 flex justify-between items-center text-sm transition-colors duration-300 ${
        store.theme === "dark"
          ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-white to-gray-200 text-black"
      } shadow-inner fixed bottom-0 w-full z-50`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: store.animationDuration / 1000 }}
    >
      {/* 左侧信息 */}
      <div className="flex items-center gap-3">
        <motion.time
          className="font-medium"
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        >
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </motion.time>
        <AnimatePresence>
          {store.showNFC && (
            <motion.span
              key="nfc"
              className="flex items-center text-xs"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <NFC className="h-4 w-4 mr-1" /> NFC
            </motion.span>
          )}
          {store.showBluetooth && (
            <motion.div
              key="bluetooth"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center"
            >
              <Bluetooth className="h-4 w-4 mr-1" /> 蓝牙
            </motion.div>
          )}
          {store.showMoonMode && (
            <motion.div
              key="moonMode"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center"
            >
              {store.theme === "dark" ? (
                <Moon className="h-4 w-4 mr-1" />
              ) : (
                <Sun className="h-4 w-4 mr-1" />
              )}
              {store.theme === "dark" ? "暗模式" : "亮模式"}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={() => store.setMuted(!store.isMuted)}
          className="flex items-center cursor-pointer"
        >
          {store.isMuted ? (
            <BellOff className="h-4 w-4 mr-1" />
          ) : (
            <BellRing className="h-4 w-4 mr-1" />
          )}
          {store.isMuted ? "静音" : "通知"}
        </motion.div>
        {store.showChart && SimpleChart && (
          <motion.div
            className="w-20"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <SimpleChart />
          </motion.div>
        )}
      </div>

      {/* 右侧信息 */}
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {store.showWifi && (
            <motion.div
              key="wifi"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center"
            >
              <Wifi className="h-4 w-4 mr-1" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((_, i) => (
                  <motion.div
                    key={`wifi-${i}`}
                    className={`h-2 w-1 bg-current rounded ${
                      i < store.wifiStrength ? "opacity-100" : "opacity-50"
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: [4, 6, 8, 10][i] }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {(store.show4G || store.show5G) && (
            <motion.div
              key="cellular"
              className="flex items-center gap-1"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <span className="text-xs">{store.show5G ? "5G" : "4G"}</span>
              <Signal className="h-4 w-4 mr-1" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((_, i) => (
                  <motion.div
                    key={`cellular-${i}`}
                    className={`h-2 w-1 bg-current rounded ${
                      i < store.cellularStrength ? "opacity-100" : "opacity-50"
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: [4, 6, 8, 10][i] }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-1">
          <motion.span
            className="font-medium"
            key={store.batteryLevel}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {store.batteryLevel}%
          </motion.span>
          <Battery className="h-4 w-4 mr-1" />
          {store.isCharging && (
            <motion.span
              className="text-xs"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ⚡
            </motion.span>
          )}
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          className="cursor-pointer"
        >
          {store.isFullScreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
