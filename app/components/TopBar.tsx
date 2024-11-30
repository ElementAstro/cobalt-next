import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Telescope, Focus, Compass, Filter } from "lucide-react";

interface TopBarProps {
  onOpenOffcanvas: (device: string) => void;
}

export function TopBar({ onOpenOffcanvas }: TopBarProps) {
  const devices = [
    { id: "telescope", name: "Telescope", icon: Telescope },
    { id: "focuser", name: "Focuser", icon: Focus },
    { id: "mount", name: "Mount", icon: Compass },
    { id: "filterWheel", name: "Filter Wheel", icon: Filter },
  ];

  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
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
        <span className="text-xl font-bold text-white">Cobalt</span>
      </div>
      <div className="flex space-x-2">
        {devices.map((device) => (
          <Button
            key={device.id}
            variant="ghost"
            size="sm"
            onClick={() => onOpenOffcanvas(device.id)}
          >
            <device.icon className="w-5 h-5 mr-1" />
            {device.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
