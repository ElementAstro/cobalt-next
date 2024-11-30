import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Process } from "@/types/system";

interface TopProcessesProps {
  processes: Process[];
}

export function TopProcesses({ processes }: TopProcessesProps) {
  const topProcesses = processes.sort((a, b) => b.cpu - a.cpu).slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Processes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process Name</TableHead>
            <TableHead className="text-right">CPU Usage (%)</TableHead>
            <TableHead className="text-right">Memory Usage (MB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topProcesses.map((process) => (
            <TableRow key={process.pid}>
              <TableCell className="font-medium">{process.name}</TableCell>
              <TableCell className="text-right">
                {process.cpu.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {process.memory.toFixed(0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
