"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, CircleDot, Clock, Hash, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Script } from "@/types/script";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ScriptListProps {
  scripts: Script[];
  onSelectScript: (id: string) => void;
}

export default function ScriptList({
  scripts,
  onSelectScript,
}: ScriptListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScripts = scripts.filter((script) =>
    script.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusColor(lastExecutedAt: Date | null) {
    if (!lastExecutedAt) return "text-gray-400";
    const now = new Date();
    const diff = now.getTime() - new Date(lastExecutedAt).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) return "text-green-500";
    if (days < 7) return "text-yellow-500";
    return "text-red-500";
  }

  return (
    <TooltipProvider>
      <Card className="h-full bg-gray-900">
        <CardContent className="p-2 space-y-2">
          <div className="flex items-center gap-1 sticky top-0 bg-gray-900 z-10 pb-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索脚本..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-gray-800"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>新建脚本</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className="space-y-1 overflow-auto"
            style={{ height: "calc(100vh - 180px)" }}
          >
            {filteredScripts.map((script) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer"
                onClick={() => onSelectScript(script.id)}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <CircleDot
                          className={`h-4 w-4 mt-1 ${getStatusColor(
                            script.lastExecutedAt
                          )}`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{script.name}</p>
                            <Badge variant="outline" className="text-xs">
                              v{script.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {script.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {script.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(script.updatedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {script.executionCount} 次执行
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {script.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>查看详情</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
