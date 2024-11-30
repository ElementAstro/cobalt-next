"use client";

import { Suspense } from "react";
import { LogDashboard } from "./LogDashboard";
import { generateMockLogs } from "@/utils/mock-log-data";
import { useRealtimeLogs } from "../../../hooks/use-realtime-logs";

export default function Home() {
  const initialLogs = generateMockLogs(1000);
  const logs = useRealtimeLogs(initialLogs);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">日志面板</h1>
      <Suspense fallback={<div>加载中...</div>}>
        <LogDashboard logs={logs} />
      </Suspense>
    </main>
  );
}
