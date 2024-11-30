"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  const labels = Array.from({ length: 10 }, (_, i) => i * 10);

  const data = {
    labels,
    datasets: [
      {
        label: "HFR",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "AutoFocus",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Stars",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(53, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="h-[300px] w-full">
      <Line options={options} data={data} />
    </div>
  );
}
