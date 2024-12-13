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
      className="flex flex-wrap gap-2 justify-center landscape:flex-col landscape:fixed landscape:left-4 landscape:top-1/2 landscape:-translate-y-1/2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category: string, index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={`
              ${
                activeCategory === category
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800"
              } 
              backdrop-blur-sm transition-all duration-300
            `}
          >
            {category}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
