"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageIcon, Settings, Wrench, Code } from "lucide-react";

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
    { id: "microsoft", name: "微软应用", icon: "windows" },
    { id: "system", name: "系统工具", icon: "settings" },
    { id: "tools", name: "常用工具", icon: "tool" },
    { id: "development", name: "开发工具", icon: "code" },
    { id: "media", name: "媒体工具", icon: "image" },
  ].map(category => ({
    ...category,
    icon: <ImageIcon className="h-4 w-4" />,
  }));

  return (
    <div
      className={cn(
        "flex gap-2",
        orientation === "horizontal"
          ? "overflow-x-auto pb-2 scrollbar-hide"
          : "flex-col"
      )}
    >
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
        className={cn(
          "whitespace-nowrap",
          orientation === "vertical" && "w-full justify-start"
        )}
      >
        全部应用
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "whitespace-nowrap",
            orientation === "vertical" && "w-full justify-start"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
