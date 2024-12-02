import { useState } from "react";
import { Input } from "@/components/ui/input";

export function LogsTab() {
  const [search, setSearch] = useState("");
  const logs = `[2023-07-01 10:00:15] Connected to Mount
[2023-07-01 10:00:16] Camera 1 initialized
[2023-07-01 10:00:17] Focuser ready
[2023-07-01 10:00:18] Filter wheel connected
[2023-07-01 10:00:19] Weather station data received
[2023-07-01 10:00:20] All systems operational`;

  const filteredLogs = logs
    .split("\n")
    .filter((log) => log.toLowerCase().includes(search.toLowerCase()))
    .join("\n");

  return (
    <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto">
      <Input
        placeholder="搜索日志..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2"
      />
      <pre className="text-sm whitespace-pre-wrap">
        {filteredLogs}
      </pre>
    </div>
  );
}
