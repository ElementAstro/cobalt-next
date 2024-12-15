import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, Pause, Edit, Trash, Check, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import ScriptRow from "@/components/script/ScriptRow";

interface Script {
  id: number;
  name: string;
  content: string;
  status: "idle" | "running" | "paused";
}

interface ScriptTableProps {
  scripts: Script[];
  handleRunScript: (id: number) => void;
  handlePauseScript: (id: number) => void;
  handleEditScript: (script: Script) => void;
  handleDeleteScript: (id: number) => void;
}

export default function ScriptTable({
  scripts,
  handleRunScript,
  handlePauseScript,
  handleEditScript,
  handleDeleteScript,
}: ScriptTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-700 dark:text-gray-300">
            名称
          </TableHead>
          <TableHead className="text-gray-700 dark:text-gray-300">
            状态
          </TableHead>
          <TableHead className="text-gray-700 dark:text-gray-300">
            操作
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scripts.map((script) => (
          <ScriptRow
            key={script.id}
            script={script}
            handleRunScript={handleRunScript}
            handlePauseScript={handlePauseScript}
            handleEditScript={handleEditScript}
            handleDeleteScript={handleDeleteScript}
          />
        ))}
      </TableBody>
    </Table>
  );
}
