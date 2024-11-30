"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CpuUsageChart } from "../components/cpu-usage-chart";
import { MemoryUsageChart } from "../components/memory-usage-chart";
import { DiskUsageChart } from "../components/disk-usage-chart";
import { NetworkUsageChart } from "../components/network-usage-chart";

export default function ResourceUsage() {
  const [activeTab, setActiveTab] = useState("cpu");

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="disk">Disk</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="cpu">
          <Card>
            <CardHeader>
              <CardTitle>CPU Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <CpuUsageChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <MemoryUsageChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="disk">
          <Card>
            <CardHeader>
              <CardTitle>Disk Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <DiskUsageChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkUsageChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ResourceDetails activeTab={activeTab} />
    </div>
  );
}

function ResourceDetails({ activeTab }: { activeTab: string }) {
  const details = {
    cpu: [
      { label: "Cores", value: "8" },
      { label: "Clock Speed", value: "3.6 GHz" },
      { label: "Cache", value: "16 MB" },
    ],
    memory: [
      { label: "Total", value: "32 GB" },
      { label: "Type", value: "DDR4" },
      { label: "Speed", value: "3200 MHz" },
    ],
    disk: [
      { label: "Total Space", value: "1 TB" },
      { label: "Type", value: "SSD" },
      { label: "Interface", value: "NVMe" },
    ],
    network: [
      { label: "Interface", value: "Ethernet" },
      { label: "Speed", value: "1 Gbps" },
      { label: "IP Address", value: "192.168.1.100" },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {details[activeTab].map((item) => (
            <div
              key={item.label}
              className="bg-muted px-4 py-5 sm:px-6 rounded-lg"
            >
              <dt className="text-sm font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
