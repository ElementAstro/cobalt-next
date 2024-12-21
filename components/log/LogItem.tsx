// LogItem.tsx
import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLogStore } from "@/lib/store/log";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { LogEntry } from "@/types/log";

Prism.manual = true;

interface Log {
  id: number; // Changed from string to number to match the store type
  timestamp: string;
  level: string;
  message: string;
  tags?: string[];
  note?: string;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

const LogItem: React.FC<RowProps> = ({ index, style }) => {
  const {
    filteredLogs,
    selectedLogs,
    setSelectedLogs,
    setSelectedLogForNote,
    logs,
    setLogs,
    setFilteredLogs,
    newNote,
    setNewNote,
    newTag,
    setNewTag,
  } = useLogStore();

  // Using as to ensure correct typing
  const log = filteredLogs[index] as unknown as Log;

  const highlightedMessage = Prism.highlight(
    log.message,
    Prism.languages.javascript,
    "javascript"
  );

  const getLevelClass = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "warn":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <motion.div
      style={style}
      className="group p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8"
          onClick={() => setSelectedLogForNote(log as unknown as LogEntry)}
        >
          <Tag className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={selectedLogs.includes(Number(log.id))}
          onCheckedChange={(checked) => {
            setSelectedLogs(
              checked
                ? [...selectedLogs, Number(log.id)]
                : selectedLogs.filter((id) => id !== Number(log.id))
            );
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-center mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {new Date(log.timestamp).toLocaleString()}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelClass(
                log.level
              )}`}
            >
              {log.level}
            </span>
            {log.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <pre className="text-sm whitespace-pre-wrap break-words font-mono">
            <code
              className="language-javascript"
              dangerouslySetInnerHTML={{ __html: highlightedMessage }}
            />
          </pre>
          {log.note && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic border-l-2 border-gray-300 dark:border-gray-600 pl-2">
              {log.note}
            </div>
          )}
        </div>
      </div>
      <Dialog>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>添加备注和标签</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right dark:text-gray-300">
                备注
              </Label>
              <Textarea
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right dark:text-gray-300">
                标签
              </Label>
              <Input
                id="tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              if (log) {
                const updatedLogs = logs.map((item) =>
                  Number(item.id) === Number(log.id) // Convert both to number for comparison
                    ? {
                        ...item,
                        note: newNote || item.note,
                        tags: [...(item.tags || []), newTag].filter(Boolean),
                      }
                    : item
                );
                setLogs(updatedLogs);
                setFilteredLogs(updatedLogs);
                setNewNote("");
                setNewTag("");
              }
            }}
            className="dark:bg-blue-600 dark:text-white"
          >
            保存
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default LogItem;
