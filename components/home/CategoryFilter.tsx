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
      className="flex flex-wrap gap-2 justify-center rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category: string) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={`${
              activeCategory === category
                ? "bg-indigo-600 text-white"
                : "bg-indigo-800 text-indigo-200"
            } hover:bg-indigo-500 transition-colors duration-300`}
          >
            {category}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;