import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption, SortOption } from "@/types/software";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SoftwareFiltersProps {
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
  selectedSort: string;
  selectedFilter: string;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  totalCount: number;
}

export function SoftwareFilters({
  sortOptions,
  filterOptions,
  selectedSort,
  selectedFilter,
  onSortChange,
  onFilterChange,
  onSearchChange,
  onReset,
  totalCount,
}: SoftwareFiltersProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm text-gray-400">找到 {totalCount} 个应用</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="搜索应用"
          className="w-[180px] dark:bg-gray-700 dark:text-white"
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select value={selectedFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:text-white">
            <SelectValue placeholder="筛选条件" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:text-white">
            <SelectValue placeholder="排序依据" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onReset} className="dark:bg-gray-700 dark:text-white">
          重置
        </Button>
      </div>
    </motion.div>
  );
}
