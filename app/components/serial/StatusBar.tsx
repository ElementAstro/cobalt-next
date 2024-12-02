import { Button } from "@/components/ui/button";
import { FC } from "react";

interface StatusBarProps {
  isMockMode: boolean;
}

const StatusBar: FC<StatusBarProps> = ({ isMockMode }) => {
  return (
    <div className="flex items-center gap-4 mt-4">
      <Button variant="outline" size="sm">
        STR
      </Button>
      <span className="ml-auto">
        {isMockMode ? "Mock 模式已启用" : "实际串口模式"}
      </span>
    </div>
  );
};

export default StatusBar;
