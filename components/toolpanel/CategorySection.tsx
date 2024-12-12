import { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { ToolCard } from "./ToolCard";
import { Tool } from "@/types/toolpanel";
import { Badge } from "@/components/ui/badge";
import { CategorySectionProps } from "@/types/toolpanel";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

export function CategorySection({
  category,
  tools,
  onSelectTool,
}: CategorySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { setNodeRef } = useDroppable({
    id: category,
  });

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mb-6 space-y-4"
    >
      <div className="sticky top-0 z-10 bg-background dark:bg-gray-800 p-4 shadow-md rounded-lg">
        <Input
          placeholder="搜索工具..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>

      <div
        ref={setNodeRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ToolCard {...tool} onSelect={onSelectTool} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTools.length === 0 && (
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
