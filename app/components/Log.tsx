// Log.tsx
"use client";

import { Suspense } from "react";
import { LogDashboard } from "./log/LogDashboard";
import { generateMockLogs } from "@/utils/mock-log-data";
import { useRealtimeLogs } from "../../hooks/use-realtime-logs";

export default function Log() {
  const initialLogs = generateMockLogs(1000);

  const realtimeLogs = useRealtimeLogs([], {
    enabled: true,
    interval: 5000,
    maxLogs: 1000,
  });

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LogDashboard initialLogs={initialLogs} />
    </Suspense>
  );
}