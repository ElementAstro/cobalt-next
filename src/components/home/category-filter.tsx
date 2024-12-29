"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <motion.div
      className="overflow-x-auto scrollbar-hide sticky top-0 z-10 py-4"
      style={{ backgroundColor: "rgba(255, 255, 255, 0)" }} // 设置透明背景色
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex gap-2 px-4 min-w-min mx-auto max-w-7xl">
        {categories.map((category: string) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`${
                activeCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-800/50 text-indigo-200"
              } hover:bg-indigo-500 transition-all duration-300 whitespace-nowrap`}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
