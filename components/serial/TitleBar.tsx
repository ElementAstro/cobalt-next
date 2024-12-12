import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, RefreshCw } from "lucide-react";
import { Theme, SerialPort } from "@/types/serial";
import { FC } from "react";
import { motion } from "framer-motion";

interface TitleBarProps {
  ports: SerialPort[];
  activePortId: string | null;
  onPortChange: (value: string) => void;
  onRefresh: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const TitleBar: FC<TitleBarProps> = ({
  ports,
  activePortId,
  onPortChange,
  onRefresh,
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex items-center justify-between bg-gray-900 p-3 rounded-t-lg shadow-lg
        md:px-4 backdrop-blur-sm border-b border-gray-700`}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Select value={activePortId || ""} onValueChange={onPortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a port" />
          </SelectTrigger>
          <SelectContent>
            {ports.map((port) => (
              <SelectItem key={port.id} value={port.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      port.isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {port.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="bg-gray-800 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex items-center gap-2"
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-gray-200 hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="text-gray-200 hover:bg-gray-800 rounded-lg px-3 py-1"
        >
          ✕
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TitleBar;
