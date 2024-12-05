import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: { x: Date; y: number }[];
  xLabel: string;
  yLabel: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xLabel,
  yLabel,
}) => {
  const formattedData = data.map((d) => ({
    x: d.x.getTime(), // Convert Date to timestamp
    y: d.y,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          name={xLabel}
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <YAxis dataKey="y" name={yLabel} />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleTimeString()}
        />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
