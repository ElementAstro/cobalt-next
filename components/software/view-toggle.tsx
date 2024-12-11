import { Grid, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store/software";

export function ViewToggle() {
  const view = useStore((state) => state.view);
  const setView = useStore((state) => state.setView);

  return (
    <motion.div
      className="flex space-x-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v) => setView(v as "list" | "grid" | "detail")}
        className="flex space-x-2 w-full"
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
