import { ChevronDown, X } from "lucide-react";

interface PanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function WeatherPanel({ collapsed, onToggle }: PanelProps) {
  return (
    <div className="border-b border-[#2a4254]">
      <div
        className="flex items-center justify-between p-2 bg-[#234254] cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-sm font-medium">Weather</h2>
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Connected</span>
          </div>
        </div>
      )}
    </div>
  );
}
