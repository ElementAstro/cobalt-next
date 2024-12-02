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
    <div className={`flex items-center justify-between bg-blue-600 p-2`}>
      <div className="flex items-center gap-2">
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
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-white" />
          ) : (
            <Moon className="h-4 w-4 text-white" />
          )}
        </Button>
        <button className="text-white hover:bg-blue-700 px-2">✕</button>
      </div>
    </div>
  );
};

export default TitleBar;
