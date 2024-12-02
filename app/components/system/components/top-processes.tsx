import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Process } from "@/types/system";
import { useState } from "react";

interface TopProcessesProps {
  processes: Process[];
}

export function TopProcesses({ processes }: TopProcessesProps) {
  const [showAll, setShowAll] = useState(false);
  const sortedProcesses = processes.sort((a, b) => b.cpu - a.cpu);
  const topProcesses = showAll ? sortedProcesses : sortedProcesses.slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Processes</h2>
      <Table className="w-full overflow-x-auto">
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
      <button
        className="mt-2 text-blue-500"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
