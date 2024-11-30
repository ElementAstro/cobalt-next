import { useState, useEffect, useCallback } from "react";
import { Log } from "@/types/log";
import { generateMockLogs } from "@/utils/mock-log-data";

export function useRealtimeLogs(initialLogs: Log[], maxLogs: number = 1000) {
  const [logs, setLogs] = useState(initialLogs);

  const addNewLog = useCallback(() => {
    const newLog = generateMockLogs(1)[0];
    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      return updatedLogs.slice(0, maxLogs);
    });
  }, [maxLogs]);

  useEffect(() => {
    const interval = setInterval(addNewLog, 5000); // 每5秒添加一个新日志

    return () => clearInterval(interval);
  }, [addNewLog]);

  return logs;
}
