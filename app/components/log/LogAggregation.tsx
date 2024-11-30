import { useMemo } from "react";
import { Log } from "@/types/log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogAggregationProps {
  logs: Log[];
}

export function LogAggregation({ logs }: LogAggregationProps) {
  const aggregatedLogs = useMemo(() => {
    if (logs.length === 0) return [];

    const aggregation: Record<
      string,
      { count: number; level: string; source: string }
    > = {};
    logs.forEach((log) => {
      if (aggregation[log.message]) {
        aggregation[log.message].count += 1;
      } else {
        aggregation[log.message] = {
          count: 1,
          level: log.level,
          source: log.source,
        };
      }
    });
    return Object.entries(aggregation)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);
  }, [logs]);

  if (logs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>日志聚合 (前10条)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>暂无日志数据</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>日志聚合 (前10条)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>消息</TableHead>
              <TableHead>次数</TableHead>
              <TableHead>级别</TableHead>
              <TableHead className="hidden md:table-cell">来源</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregatedLogs.map(([message, { count, level, source }]) => (
              <TableRow key={message}>
                <TableCell className="max-w-[200px] truncate">
                  {message}
                </TableCell>
                <TableCell>{count}</TableCell>
                <TableCell>{level}</TableCell>
                <TableCell className="hidden md:table-cell">{source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
