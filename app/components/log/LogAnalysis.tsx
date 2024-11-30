import { Log } from "@/types/log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogAnalysisProps {
  logs: Log[];
}

export function LogAnalysis({ logs }: LogAnalysisProps) {
  if (logs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>日志分析</CardTitle>
        </CardHeader>
        <CardContent>
          <p>暂无日志数据</p>
        </CardContent>
      </Card>
    );
  }

  const errorCount = logs.filter((log) => log.level === "error").length;
  const warningCount = logs.filter((log) => log.level === "warning").length;
  const topSources = Object.entries(
    logs.reduce((acc, log) => {
      acc[log.source] = (acc[log.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>日志分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>错误数量: {errorCount}</p>
          <p>警告数量: {warningCount}</p>
          <p>前三大日志来源:</p>
          <ul className="list-disc list-inside">
            {topSources.map(([source, count]) => (
              <li key={source}>
                {source}: {count} 条日志
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
