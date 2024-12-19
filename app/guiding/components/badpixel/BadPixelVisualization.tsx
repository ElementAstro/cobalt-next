"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BadPixelVisualizationProps {
  data: any;
}

export default function BadPixelVisualization({
  data,
}: BadPixelVisualizationProps) {
  const hotPixels = data.hotPixels.map((pixel: number) => ({
    x: pixel % data.width,
    y: Math.floor(pixel / data.width),
    type: "热噪点",
  }));

  const coldPixels = data.coldPixels.map((pixel: number) => ({
    x: pixel % data.width,
    y: Math.floor(pixel / data.width),
    type: "冷噪点",
  }));

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 70,
            left: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="X坐标"
            unit=""
            domain={[0, data.width]}
            label={{
              value: "X坐标",
              position: "bottom",
              offset: 40,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y坐标"
            unit=""
            domain={[0, data.height]}
            label={{
              value: "Y坐标",
              angle: -90,
              position: "left",
              offset: -50,
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const point = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p>{`类型: ${point.type}`}</p>
                    <p>{`X: ${point.x}`}</p>
                    <p>{`Y: ${point.y}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={60}
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
          <Scatter
            name="热噪点"
            data={hotPixels}
            fill="#ff7300"
            shape="circle"
          />
          <Scatter
            name="冷噪点"
            data={coldPixels}
            fill="#00bcd4"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
