import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DiskInfo } from "@/types/settings";

interface DiskChartProps {
  disk: DiskInfo;
}

const COLORS = ["#FF6384", "#36A2EB"];

export function DiskChart({ disk }: DiskChartProps) {
  const data = [
    { name: "已使用", value: disk.used },
    { name: "可用", value: disk.total - disk.used },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
