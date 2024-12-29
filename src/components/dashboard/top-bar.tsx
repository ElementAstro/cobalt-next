import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NetworkStatus } from "./network-status";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-mobile";
import {
  Telescope,
  Focus,
  Compass,
  Filter,
  Camera,
  Logs,
  Battery,
  Wifi,
  Settings,
  WifiOff,
  WifiZero,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

interface TopBarProps {
  onOpenOffcanvas: (device: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TopBar({ onOpenOffcanvas }: TopBarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isShowDeviceName, setIsShowDeviceName] = useState(!isMobile);
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [wifiStatus, setWifiStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const devices = [
    {
      id: "camera",
      name: "Camera",
      icon: Camera,
      description: "Control camera settings",
    },
    {
      id: "telescope",
      name: "Telescope",
      icon: Telescope,
      description: "Manage telescope operations",
    },
    {
      id: "focuser",
      name: "Focuser",
      icon: Focus,
      description: "Adjust focus settings",
    },
    {
      id: "filterWheel",
      name: "Filter Wheel",
      icon: Filter,
      description: "Select and manage filters",
    },
    {
      id: "guider",
      name: "Guider",
      icon: Compass,
      description: "Control guiding system",
    },
    { id: "Logs", name: "Logs", icon: Logs, description: "View system logs" },
    {
      id: "Settings",
      name: "Settings",
      icon: Settings,
      description: "Access system settings",
    },
    {
      id: "Info",
      name: "Info",
      icon: Info,
      description: "View system information",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsShowDeviceName(!isMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const updateOnlineStatus = () => {
    setWifiStatus(navigator.onLine);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Get battery status
        if ((navigator as any).getBattery) {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener("levelchange", () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        }

        // Get WiFi status
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);
        updateOnlineStatus();
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <TooltipProvider>
      <motion.div
        className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center space-x-2"
          variants={itemVariants}
        >
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
            />
          </svg>
          <span
            className="text-xl font-bold text-white"
            onClick={() => (window.location.href = "/about")}
          >
            Cobalt
          </span>
        </motion.div>
        <motion.div
          className="flex items-center space-x-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center space-x-1 text-white"
            variants={itemVariants}
          >
            <Battery className="w-5 h-5" />
            <span>{batteryLevel !== null ? `${batteryLevel}%` : "N/A"}</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-1 text-white"
            variants={itemVariants}
          >
            <span>
              {wifiStatus !== null ? (
                wifiStatus ? (
                  <NetworkStatus />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )
              ) : (
                <WifiZero className="w-5 h-5" />
              )}
            </span>
          </motion.div>
          <motion.div
            className="text-white text-center"
            variants={itemVariants}
          >
            <div>{time.toLocaleDateString()}</div>
            <div>{time.toLocaleTimeString()}</div>
          </motion.div>
          {devices.map((device) => (
            <motion.div key={device.id} variants={itemVariants}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenOffcanvas(device.id)}
                    className="flex items-center gap-1"
                  >
                    <device.icon className="w-5 h-5" />
                    {isShowDeviceName && (
                      <span className="hidden md:inline">{device.name}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{device.description}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
