"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageIcon, Settings, Wrench, Code } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  orientation?: "horizontal" | "vertical";
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  orientation = "horizontal",
}: CategoryFilterProps) {
  const categories = [
    { id: "microsoft", name: "微软应用", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "system", name: "系统工具", icon: <Settings className="h-4 w-4" /> },
    { id: "tools", name: "常用工具", icon: <Wrench className="h-4 w-4" /> },
    { id: "development", name: "开发工具", icon: <Code className="h-4 w-4" /> },
    { id: "media", name: "媒体工具", icon: <ImageIcon className="h-4 w-4" /> },
  ];

  return (
    <ScrollArea
      className={cn(
        orientation === "horizontal" ? "max-w-full" : "h-auto max-h-[70vh]"
      )}
    >
      <div
        className={cn(
          "flex gap-1.5",
          orientation === "horizontal"
            ? "flex-row"
            : "flex-col w-full px-1.5 py-2"
        )}
      >
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className={cn(
            "whitespace-nowrap flex items-center gap-2",
            orientation === "vertical" && "w-full justify-start"
          )}
          size="sm"
        >
          全部应用
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "whitespace-nowrap flex items-center gap-2",
              orientation === "vertical" && "w-full justify-start"
            )}
            size="sm"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
