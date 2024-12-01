import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface TelescopeData {
  tracking: boolean;
  siderealTime: string;
  rightAscension: string;
  declination: string;
  altitude: string;
  azimuth: string;
}

export function TelescopePanel({ collapsed, onToggle }: PanelProps) {
  const [data, setData] = useState<TelescopeData>({
    tracking: false,
    siderealTime: new Date().toLocaleTimeString(),
    rightAscension: "07:45:54",
    declination: "-40° 08' 17\"",
    altitude: "49° 51' 43\"",
    azimuth: "180° 00' 00\"",
  });

  // 模拟实时Sidereal Time更新
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        siderealTime: new Date().toLocaleTimeString(),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTracking = () => {
    setData((prevData) => ({
      ...prevData,
      tracking: !prevData.tracking,
    }));
    // 在此处添加实际的追踪控制逻辑
  };

  return (
    <div className="border-b border-[#2a4254]">
      <div
        className="flex items-center justify-between p-2 bg-[#234254] cursor-pointer"
        onClick={onToggle}
        aria-expanded={!collapsed}
        role="button"
      >
        <h2 className="text-sm font-medium text-white">Telescope</h2>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-white" aria-hidden="true" />
          {collapsed ? (
            <ChevronDown className="w-4 h-4 text-white" aria-hidden="true" />
          ) : (
            <ChevronUp className="w-4 h-4 text-white" aria-hidden="true" />
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-2 text-sm bg-[#1e2a38]">
          <div className="flex justify-between">
            <span className="text-gray-300">Tracking</span>
            <span className={`font-semibold ${data.tracking ? "text-green-400" : "text-red-400"}`}>
              {data.tracking ? "Active" : "Stopped"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Sidereal Time</span>
            <span>{data.siderealTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Right Ascension</span>
            <span>{data.rightAscension}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Declination</span>
            <span>{data.declination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Altitude</span>
            <span>{data.altitude}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Azimuth</span>
            <span>{data.azimuth}</span>
          </div>
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="default"
              onClick={toggleTracking}
              aria-label={data.tracking ? "Stop Tracking" : "Start Tracking"}
              className="flex items-center"
            >
              {data.tracking ? (
                <>
                  <Pause className="w-4 h-4 mr-2" aria-hidden="true" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                  Start Tracking
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}