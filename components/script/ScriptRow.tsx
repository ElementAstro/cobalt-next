import { Button } from "@/components/ui/button";
import { Play, Pause, Edit, Trash, Check, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TableRow, TableCell } from "@/components/ui/table";

interface Script {
  id: number;
  name: string;
  content: string;
  status: "idle" | "running" | "paused";
}

interface ScriptRowProps {
  script: Script;
  handleRunScript: (id: number) => void;
  handlePauseScript: (id: number) => void;
  handleEditScript: (script: Script) => void;
  handleDeleteScript: (id: number) => void;
}

export default function ScriptRow({
  script,
  handleRunScript,
  handlePauseScript,
  handleEditScript,
  handleDeleteScript,
}: ScriptRowProps) {
  return (
    <TableRow>
      <TableCell className="text-gray-800 dark:text-gray-200">
        {script.name}
      </TableCell>
      <TableCell>
        {script.status === "running" ? (
          <div className="flex items-center space-x-1 text-yellow-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>运行中</span>
          </div>
        ) : script.status === "paused" ? (
          <div className="flex items-center space-x-1 text-orange-500">
            <Pause className="h-4 w-4" />
            <span>已暂停</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-green-500">
            <Check className="h-4 w-4" />
            <span>空闲</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {script.status !== "running" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRunScript(script.id)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>运行脚本</TooltipContent>
            </Tooltip>
          )}
          {script.status === "running" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePauseScript(script.id)}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>暂停脚本</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditScript(script)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>编辑脚本</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteScript(script.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>删除脚本</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
