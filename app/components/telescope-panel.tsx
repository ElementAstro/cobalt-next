import { ChevronDown, X } from "lucide-react";

interface PanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function TelescopePanel({ collapsed, onToggle }: PanelProps) {
  return (
    <div className="border-b border-[#2a4254]">
      <div
        className="flex items-center justify-between p-2 bg-[#234254] cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-sm font-medium">Telescope</h2>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4" />
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              collapsed ? "-rotate-90" : ""
            }`}
          />
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tracking</span>
            <span className="text-red-400">Stopped</span>
          </div>
          <div className="flex justify-between">
            <span>Sidereal time</span>
            <span>07:45:54</span>
          </div>
          <div className="flex justify-between">
            <span>Right Ascension</span>
            <span>07:45:54</span>
          </div>
          <div className="flex justify-between">
            <span>Declination</span>
            <span>-40° 08' 17"</span>
          </div>
          <div className="flex justify-between">
            <span>Altitude</span>
            <span>49° 51' 43"</span>
          </div>
          <div className="flex justify-between">
            <span>Azimuth</span>
            <span>180° 00' 00"</span>
          </div>
        </div>
      )}
    </div>
  );
}
