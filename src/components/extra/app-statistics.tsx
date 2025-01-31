import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStatistics } from '@/store/extra/statistics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

export function AppStatistics() {
  const { getTopApps } = useStatistics();
  const [activeTab, setActiveTab] = useState('usage');
  const topApps = getTopApps(5);

  const barData = topApps.map(({ appId, stats }) => ({
    name: appId,
    launchCount: stats.launchCount,
  }));

  const pieData = topApps.map(({ appId, stats }) => ({
    name: appId,
    totalDuration: Math.round(stats.totalDuration / 60), // 转换为分钟
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>应用使用统计</CardTitle>
        <CardDescription>查看应用使用情况和趋势</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="usage">使用次数</TabsTrigger>
            <TabsTrigger value="duration">使用时长</TabsTrigger>
          </TabsList>
          <TabsContent value="usage" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="launchCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="duration" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="totalDuration"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}