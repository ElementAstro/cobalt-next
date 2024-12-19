import { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { ToolCard } from "./ToolCard";
import { Tool } from "@/types/toolpanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategorySectionProps } from "@/types/toolpanel";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";

export function CategorySection({
  category,
  tools,
  onSelectTool,
}: CategorySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { setNodeRef } = useDroppable({
    id: category,
  });

  const sortTools = (tools: Tool[]) => {
    return [...tools].sort((a, b) => {
      switch (sortBy) {
        case "usage":
          return b.usageCount - a.usageCount;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedTools = sortTools(
    tools.filter((tool) =>
      tool.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  );

  const gridClassName = {
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
    list: "grid-cols-1",
  }[viewMode];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mb-6 space-y-4"
    >
      <div className="sticky top-0 z-10 bg-background/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 shadow-md rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-4 w-full">
            <Input
              placeholder="搜索工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">按名称</SelectItem>
                <SelectItem value="usage">按使用频率</SelectItem>
                <SelectItem value="recent">最近使用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-accent" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-accent" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`grid ${gridClassName} gap-4 px-2 sm:px-4 auto-rows-max`}
      >
        <AnimatePresence mode="popLayout">
          {filteredAndSortedTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              <ToolCard {...tool} onSelect={onSelectTool} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400"
          >
            没有找到匹配的工具
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
