import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { ToolCard } from "./ToolCard";
import { Tool } from "@/types/toolpanel";
import { Badge } from "@/components/ui/badge";
import { CategorySectionProps } from "@/types/toolpanel";
import { motion } from "framer-motion";

export function CategorySection({
  category,
  tools,
  onSelectTool,
}: CategorySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { setNodeRef } = useDroppable({
    id: category,
  });

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
      <div
        ref={setNodeRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto"
        style={{ maxHeight: "400px" }}
      >
        <SortableContext items={filteredTools}>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ToolCard
                  id={tool.id}
                  name={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  usageCount={tool.usageCount}
                  category={tool.category}
                  onSelect={onSelectTool}
                  CustomComponent={tool.CustomComponent}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              没有找到匹配的工具
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
