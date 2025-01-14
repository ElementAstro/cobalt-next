"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, AlertTriangle, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  Clock,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import { create } from "zustand";

export interface UpdateLog {
  version: string;
  date: string;
  changes: string[];
  importance: "critical" | "high" | "medium" | "low";
}

interface UpdateLogState {
  logs: UpdateLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
}

export const useUpdateLogStore = create<UpdateLogState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,
  fetchLogs: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/update-logs");
      if (!response.ok) {
        throw new Error("Failed to fetch update logs");
      }
      const data = await response.json();
      set({ logs: data, isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const versionItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.98 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

const importanceColors = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const importanceIcons = {
  critical: AlertTriangle,
  high: Zap,
  medium: Info,
  low: Check,
};

export function UpdateLogModal() {
  const [expandedVersions, setExpandedVersions] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const { logs, isLoading, error, fetchLogs } = useUpdateLogStore();
  const controls = useAnimationControls();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) =>
      prev.includes(version)
        ? prev.filter((v) => v !== version)
        : [...prev, version]
    );
    controls.start("hover");
  };

  const getVersionType = (version: string) => {
    const [major, minor] = version.split(".");
    return minor === "0" ? "major" : "minor";
  };

  const copyChangelog = (version: string, changes: string[]) => {
    const text = `版本 ${version}\n${changes.join("\n")}`;
    navigator.clipboard.writeText(text);
    controls.start("tap");
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) =>
      prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
    );
  };

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesFilter =
          filter === "all" || getVersionType(log.version) === filter;
        const matchesSearch =
          log.version.toLowerCase().includes(search.toLowerCase()) ||
          log.changes.some((change) =>
            change.toLowerCase().includes(search.toLowerCase())
          );
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === SortOrder.DESC ? dateB - dateA : dateA - dateB;
      });
  }, [logs, filter, search, sortOrder]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-accent">
          <Clock className="mr-2 h-4 w-4" />
          查看更新日志
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] h-[90vh] sm:h-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold">更新日志</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            查看应用程序的最新更新和改进信息
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索更新内容..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              onValueChange={(value) => setFilter(value)}
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="筛选版本" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有版本</SelectItem>
                <SelectItem value="major">主要版本</SelectItem>
                <SelectItem value="minor">次要版本</SelectItem>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSortOrder}
                    className="shrink-0"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {sortOrder === SortOrder.DESC ? "从新到旧" : "从旧到新"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Separator />

          <ScrollArea className="h-[50vh] sm:h-[400px] pr-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-destructive">错误: {error}</p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.version}
                    variants={versionItem}
                    initial="hidden"
                    animate="show"
                    whileHover="hover"
                    whileTap="tap"
                    className="relative border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-[80%] bg-primary rounded-full transition-all duration-300" />

                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            版本 {log.version}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                getVersionType(log.version) === "major"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {getVersionType(log.version) === "major"
                                ? "主要"
                                : "次要"}
                            </Badge>
                            <Badge
                              className={cn(
                                "flex items-center gap-1",
                                importanceColors[log.importance]
                              )}
                            >
                              {React.createElement(
                                importanceIcons[log.importance],
                                {
                                  className: "h-3 w-3",
                                }
                              )}
                              {log.importance === "critical" && "严重"}
                              {log.importance === "high" && "重要"}
                              {log.importance === "medium" && "中等"}
                              {log.importance === "low" && "低"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyChangelog(log.version, log.changes)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleVersion(log.version)}
                        >
                          {expandedVersions.includes(log.version) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedVersions.includes(log.version) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ul className="mt-4 space-y-2 group">
                            {log.changes.map((change, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-2 text-sm text-muted-foreground hover:bg-accent/20 px-2 py-1 rounded-md cursor-pointer transition-all duration-200"
                              >
                                <Tag className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span className="group-hover:text-foreground transition-colors duration-200">
                                  {change}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
