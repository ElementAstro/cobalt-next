"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CpuUsageChart } from "./components/cpu-usage-chart";
import { MemoryUsageChart } from "./components/memory-usage-chart";
import { DiskUsageChart } from "./components/disk-usage-chart";
import { NetworkUsageChart } from "./components/network-usage-chart";
import { SystemOverview } from "./components/system-overview";
import { TopProcesses } from "./components/top-processes";
import { api } from "@/services/system";
import { SystemInfo, Process } from "@/types/system";

export default function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [sysInfo, procs] = await Promise.all([
        api.fetchSystemInfo(),
        api.fetchProcesses(),
      ]);
      setSystemInfo(sysInfo);
      setProcesses(procs);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!systemInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">System Dashboard</h1>
      <SystemOverview systemInfo={systemInfo} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <CpuUsageChart usage={systemInfo.cpuUsage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <MemoryUsageChart usage={systemInfo.memoryUsage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Disk Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <DiskUsageChart usage={systemInfo.diskUsage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Network Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkUsageChart
              upload={systemInfo.networkUsage.upload}
              download={systemInfo.networkUsage.download}
            />
          </CardContent>
        </Card>
      </div>
      <TopProcesses processes={processes} />
    </div>
  );
}
