import { Button } from "@/components/ui/button";

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
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category: string) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => setActiveCategory(category)}
          className={`${
            activeCategory === category
              ? "bg-indigo-600 text-white"
              : "bg-indigo-800 text-indigo-200"
          } hover:bg-indigo-500`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
