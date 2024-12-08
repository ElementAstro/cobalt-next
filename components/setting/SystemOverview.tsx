import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemStore } from "@/lib/store/system";
import { motion } from "framer-motion";

export function SystemOverview() {
  const { systemInfo } = useSystemStore();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  const cards = [
    {
      title: "CPU 使用率",
      value: `${systemInfo.cpuUsage.toFixed(1)}%`,
      details: `${systemInfo.loadAverage
        .map((load) => load.toFixed(2))
        .join(", ")} (1, 5, 15 分钟)`,
    },
    {
      title: "内存使用率",
      value: `${systemInfo.memoryUsage.toFixed(1)}%`,
      details: "",
    },
    {
      title: "磁盘使用率",
      value: `${systemInfo.diskUsage.toFixed(1)}%`,
      details: "",
    },
    {
      title: "温度",
      value: `${systemInfo.temperature.toFixed(1)}°C`,
      details: "",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 dark:bg-gray-800">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="dark:bg-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">
                {card.title}
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-gray-400"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              {card.details && (
                <p className="text-xs text-gray-400 mt-1">{card.details}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
