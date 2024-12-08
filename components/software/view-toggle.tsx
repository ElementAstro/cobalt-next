import { Grid, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";

interface ViewToggleProps {
  view: "list" | "grid" | "detail";
  onViewChange: (view: "list" | "grid" | "detail") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <motion.div
      className="flex space-x-2 p-2 rounded-lg dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v) => onViewChange(v as "list" | "grid" | "detail")}
        className="flex space-x-2"
      >
        <ToggleGroupItem
          value="list"
          aria-label="List view"
          className={`w-10 p-2 rounded-lg ${
            view === "list"
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-700 dark:text-white"
          }`}
        >
          <List className="h-4 w-4 mx-auto" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="grid"
          aria-label="Grid view"
          className={`w-10 p-2 rounded-lg ${
            view === "grid"
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-700 dark:text-white"
          }`}
        >
          <Grid className="h-4 w-4 mx-auto" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="detail"
          aria-label="Detail view"
          className={`w-10 p-2 rounded-lg ${
            view === "detail"
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-700 dark:text-white"
          }`}
        >
          <LayoutGrid className="h-4 w-4 mx-auto" />
        </ToggleGroupItem>
      </ToggleGroup>
    </motion.div>
  );
}
