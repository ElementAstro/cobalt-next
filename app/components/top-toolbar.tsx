import {
  Camera,
  Cloud,
  Database,
  GitBranch,
  LayoutGrid,
  LineChart,
  Monitor,
  Moon,
  Settings,
  Shield,
  Star,
} from "lucide-react";

export function TopToolbar() {
  return (
    <div className="h-12 border-b border-[#2a4254] flex items-center px-4 gap-4">
      <Camera className="w-5 h-5" />
      <GitBranch className="w-5 h-5" />
      <Moon className="w-5 h-5" />
      <Database className="w-5 h-5" />
      <Star className="w-5 h-5" />
      <Monitor className="w-5 h-5" />
      <LayoutGrid className="w-5 h-5" />
      <Cloud className="w-5 h-5" />
      <LineChart className="w-5 h-5" />
      <Shield className="w-5 h-5" />
      <Settings className="w-5 h-5" />
    </div>
  );
}
