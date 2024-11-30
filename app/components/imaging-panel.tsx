import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function ImagingPanel({ collapsed, onToggle }: PanelProps) {
  return (
    <div className="border-b border-[#2a4254]">
      <div
        className="flex items-center justify-between p-2 bg-[#234254] cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-sm font-medium">Imaging</h2>
        <ChevronDown
          className={`w-4 h-4 transform transition-transform ${
            collapsed ? "-rotate-90" : ""
          }`}
        />
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm">Exposure time</div>
            <Input
              type="number"
              value="1"
              className="bg-[#1a3244] border-[#2a4254]"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm">Filter</div>
            <Select>
              <SelectTrigger className="bg-[#1a3244] border-[#2a4254]">
                <SelectValue placeholder="Current" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm">Binning</div>
            <Select>
              <SelectTrigger className="bg-[#1a3244] border-[#2a4254]">
                <SelectValue placeholder="1x1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x1">1x1</SelectItem>
                <SelectItem value="2x2">2x2</SelectItem>
                <SelectItem value="4x4">4x4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Loop</span>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Save</span>
            <Switch />
          </div>
        </div>
      )}
    </div>
  );
}
