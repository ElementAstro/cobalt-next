import { Button } from "@/components/ui/button";
import { Save, SaveAll } from "lucide-react";
import { FC } from "react";

interface ControlButtonsProps {
  onConnect: () => void;
  isConnected: boolean;
  onClear: () => void;
  showTimestamp: boolean;
  toggleTimestamp: () => void;
  onSaveLog: () => void;
  isAutoScroll: boolean;
  toggleAutoScroll: () => void;
  isHexView: boolean;
  toggleHexView: () => void;
  rxCount: number;
  txCount: number;
}

const ControlButtons: FC<ControlButtonsProps> = ({
  onConnect,
  isConnected,
  onClear,
  showTimestamp,
  toggleTimestamp,
  onSaveLog,
  isAutoScroll,
  toggleAutoScroll,
  isHexView,
  toggleHexView,
  rxCount,
  txCount,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={isConnected ? "destructive" : "default"}
        onClick={onConnect}
        disabled={!isConnected}
      >
        {isConnected ? "断开" : "连接"}
      </Button>
      <Button variant="secondary" onClick={onClear}>
        清屏
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleTimestamp}>
        T
      </Button>
      <Button variant="ghost" size="icon" onClick={onSaveLog}>
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant={isAutoScroll ? "default" : "secondary"}
        onClick={toggleAutoScroll}
      >
        自动滚动
      </Button>
      <Button
        variant={isHexView ? "default" : "secondary"}
        onClick={toggleHexView}
      >
        Hex 视图
      </Button>
      <div className="flex items-center gap-2 ml-auto">
        <span>RX {rxCount}</span>
        <span>TX {txCount}</span>
      </div>
    </div>
  );
};

export default ControlButtons;
