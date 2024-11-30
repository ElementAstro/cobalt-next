"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CpuUsageChart } from "../components/cpu-usage-chart";
import { MemoryUsageChart } from "../components/memory-usage-chart";
import { DiskUsageChart } from "../components/disk-usage-chart";
import { NetworkUsageChart } from "../components/network-usage-chart";
import { useWebSocket } from "@/services/wbsocket";
import { Loader2 } from "lucide-react";

export default function SystemMonitoring() {
  const { systemInfo } = useWebSocket();

  if (!systemInfo) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">System Monitoring</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <CpuUsageChart />
            <p className="mt-2 text-center">
              {systemInfo.cpuUsage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <MemoryUsageChart />
            <p className="mt-2 text-center">
              {systemInfo.memoryUsage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Disk Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <DiskUsageChart />
            <p className="mt-2 text-center">
              {systemInfo.diskUsage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Network Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkUsageChart />
            <p className="mt-2 text-center">
              Upload: {systemInfo.networkUsage.upload.toFixed(2)} MB/s
              <br />
              Download: {systemInfo.networkUsage.download.toFixed(2)} MB/s
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center">
              {systemInfo.temperature.toFixed(1)}°C
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Load Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              1 min: {systemInfo.loadAverage[0].toFixed(2)}
              <br />5 min: {systemInfo.loadAverage[1].toFixed(2)}
              <br />
              15 min: {systemInfo.loadAverage[2].toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
