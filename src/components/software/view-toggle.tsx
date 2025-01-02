import { Grid, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";
import { useSoftwareStore } from "@/store/useSoftwareStore";
import { useEffect, useState } from "react";

export function ViewToggle() {
  const view = useSoftwareStore((state) => state.view);
  const setView = useSoftwareStore((state) => state.setView);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();
    return () => window.removeEventListener("resize", handleOrientationChange);
  }, []);

  return (
    <motion.div
      className={`flex space-x-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md ${
        isLandscape ? "flex-row" : "flex-col"
      }`}
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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ToggleGroupItem
            value="list"
            aria-label="List view"
            className={`w-10 p-2 rounded-lg transition-colors duration-200 ${
              view === "list"
                ? "bg-blue-500 text-white shadow-lg"
                : "dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <List className="h-4 w-4 mx-auto" />
          </ToggleGroupItem>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ToggleGroupItem
            value="grid"
            aria-label="Grid view"
            className={`w-10 p-2 rounded-lg transition-colors duration-200 ${
              view === "grid"
                ? "bg-blue-500 text-white shadow-lg"
                : "dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <Grid className="h-4 w-4 mx-auto" />
          </ToggleGroupItem>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ToggleGroupItem
            value="detail"
            aria-label="Detail view"
            className={`w-10 p-2 rounded-lg transition-colors duration-200 ${
              view === "detail"
                ? "bg-blue-500 text-white shadow-lg"
                : "dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <LayoutGrid className="h-4 w-4 mx-auto" />
          </ToggleGroupItem>
        </motion.div>
      </ToggleGroup>
    </motion.div>
  );
}
