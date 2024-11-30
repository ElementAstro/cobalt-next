import { Log } from "@/types/log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogStatsProps {
  logs: Log[];
}

export function LogStats({ logs }: LogStatsProps) {
  if (logs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>日志统计</CardTitle>
        </CardHeader>
        <CardContent>
          <p>暂无日志数据</p>
        </CardContent>
      </Card>
    );
  }

  const totalLogs = logs.length;
  const logsPerLevel = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const latestLog = logs[0];
  const oldestLog = logs[logs.length - 1];

  const timeDiff =
    new Date(latestLog.timestamp).getTime() -
    new Date(oldestLog.timestamp).getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  const averageLogsPerDay = totalLogs / (daysDiff || 1); // Avoid division by zero

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>日志统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>总日志数: {totalLogs}</p>
          <p>日志级别分布:</p>
          <ul className="list-disc list-inside">
            {Object.entries(logsPerLevel).map(([level, count]) => (
              <li key={level}>
                {level}: {count} 条 ({((count / totalLogs) * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
          <p>最新日志时间: {new Date(latestLog.timestamp).toLocaleString()}</p>
          <p>最早日志时间: {new Date(oldestLog.timestamp).toLocaleString()}</p>
          <p>平均每日日志数: {averageLogsPerDay.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
