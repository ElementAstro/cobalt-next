// use-realtime-logs.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Log } from "@/types/log";
import { generateMockLogs } from "@/utils/mock-log-data";

interface RealtimeLogsOptions {
  enabled: boolean;
  interval?: number;
  maxLogs?: number;
}

export function useRealtimeLogs(
  initialLogs: Log[],
  options: RealtimeLogsOptions = {
    enabled: true,
    interval: 5000,
    maxLogs: 1000,
  }
) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const initialLogsRef = useRef(initialLogs);
  const { enabled, interval = 5000, maxLogs = 1000 } = options;

  const addNewLog = useCallback(() => {
    const newLog = generateMockLogs(1)[0];
    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      return updatedLogs.slice(0, maxLogs);
    });
  }, [maxLogs]);

  useEffect(() => {
    if (enabled) {
      const intervalId = setInterval(addNewLog, interval);
      return () => clearInterval(intervalId);
    }
  }, [addNewLog, enabled, interval]);

  useEffect(() => {
    setLogs(initialLogsRef.current);
  }, []);

  return logs;
}
