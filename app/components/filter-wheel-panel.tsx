import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function FilterWheelPanel({ collapsed, onToggle }: PanelProps) {
  return (
    <div className="border-b border-[#2a4254]">
      <div
        className="flex items-center justify-between p-2 bg-[#234254] cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-sm font-medium">Filter Wheel</h2>
        <ChevronDown
          className={`w-4 h-4 transform transition-transform ${
            collapsed ? "-rotate-90" : ""
          }`}
        />
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm">Active filter</div>
            <Select>
              <SelectTrigger className="bg-[#1a3244] border-[#2a4254]">
                <SelectValue placeholder="Filter1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filter1">Filter1</SelectItem>
                <SelectItem value="filter2">Filter2</SelectItem>
                <SelectItem value="filter3">Filter3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">Change</Button>
        </div>
      )}
    </div>
  );
}
