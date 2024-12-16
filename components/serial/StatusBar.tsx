import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FC } from "react";
import { Activity } from "lucide-react";

interface StatusBarProps {
  isMockMode: boolean;
  isActive: boolean;
  bytesPerSecond: number;
}

const StatusBar: FC<StatusBarProps> = ({ isMockMode, isActive, bytesPerSecond }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-4 mt-4 p-2 bg-gray-800 rounded-lg"
    >
      <Button variant="outline" size="sm">
        <Activity className={`h-4 w-4 mr-2 ${isActive ? 'text-green-500' : 'text-gray-500'}`} />
        STR
      </Button>
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm text-gray-400">{bytesPerSecond} B/s</span>
        <span className="text-sm">
          {isMockMode ? "Mock 模式已启用" : "实际串口模式"}
        </span>
      </div>
    </motion.div>
  );
};

export default StatusBar;
