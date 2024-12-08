import { Badge } from "@/components/ui/badge";

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate: string;
}

export default function ConnectionStatus({
  isConnected,
  lastUpdate,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      <Badge variant={isConnected ? "default" : "destructive"}>
        {isConnected ? "Connected" : "Disconnected"}
      </Badge>
      {lastUpdate && (
        <span className="text-sm text-gray-300">Last update: {lastUpdate}</span>
      )}
    </div>
  );
}
