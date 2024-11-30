"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/system";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Process } from "@/types/system";

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const fetchedProcesses = await api.fetchProcesses();
      setProcesses(fetchedProcesses);
    } catch (error) {
      console.error("Failed to fetch processes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch processes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKill = async (pid: number) => {
    try {
      await api.killProcess(pid);
      toast({
        title: "Success",
        description: `Process ${pid} has been terminated.`,
      });
      fetchProcesses(); // Refresh the process list
    } catch (error) {
      console.error("Failed to kill process:", error);
      toast({
        title: "Error",
        description: "Failed to terminate process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>CPU %</TableHead>
              <TableHead>Memory (MB)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.pid}>
                <TableCell>{process.pid}</TableCell>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.user}</TableCell>
                <TableCell>{process.cpu.toFixed(1)}%</TableCell>
                <TableCell>{process.memory.toFixed(0)}</TableCell>
                <TableCell>{process.status}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleKill(process.pid)}
                  >
                    Kill
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
