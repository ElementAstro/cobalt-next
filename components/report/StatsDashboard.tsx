"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

type Issue = {
  id: number;
  title: string;
  type: "bug" | "feature";
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "closed";
};

type StatsDashboardProps = {
  issues: Issue[];
};

export function StatsDashboard({ issues }: StatsDashboardProps) {
  const typeData = [
    { name: "Bug", value: issues.filter((i) => i.type === "bug").length },
    {
      name: "Feature",
      value: issues.filter((i) => i.type === "feature").length,
    },
  ];

  const priorityData = [
    { name: "Low", value: issues.filter((i) => i.priority === "low").length },
    {
      name: "Medium",
      value: issues.filter((i) => i.priority === "medium").length,
    },
    { name: "High", value: issues.filter((i) => i.priority === "high").length },
  ];

  const statusData = [
    { name: "Open", value: issues.filter((i) => i.status === "open").length },
    {
      name: "In Progress",
      value: issues.filter((i) => i.status === "in-progress").length,
    },
    {
      name: "Closed",
      value: issues.filter((i) => i.status === "closed").length,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4 bg-gray-900 text-white min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>问题类型统计</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>优先级统计</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>状态统计</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
