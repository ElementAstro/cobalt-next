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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SoftwareFiltersProps {
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
  selectedSort: string;
  selectedFilter: string;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onDateChange?: (date: DateRange | undefined) => void;
  onReset: () => void;
  totalCount: number;
  className?: string;
}

const filterVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const advancedFilterVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export function SoftwareFilters({
  sortOptions,
  filterOptions,
  selectedSort,
  selectedFilter,
  onSortChange,
  onFilterChange,
  onSearchChange,
  onDateChange,
  onReset,
  totalCount,
  className,
}: SoftwareFiltersProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("comfortable");
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleScreenshots = () => setShowScreenshots(!showScreenshots);
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();
    return () => window.removeEventListener("resize", handleOrientationChange);
  }, []);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(date);
    }
  }, [date]);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md",
          isLandscape ? "flex-row" : "flex-col",
          className
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        layout
      >
        <motion.div
          className="text-sm text-gray-400 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <FilterIcon className="w-4 h-4" />
          <span>找到 {totalCount} 个应用</span>
        </motion.div>

        <motion.div
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <div className="relative">
            <Input
              placeholder="搜索应用"
              className="w-[180px] dark:bg-gray-700 dark:text-white pl-8"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

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

          {onDateChange && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[180px] justify-start text-left font-normal dark:bg-gray-700 dark:text-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "yyyy-MM-dd")} -{" "}
                        {format(date.to, "yyyy-MM-dd")}
                      </>
                    ) : (
                      format(date.from, "yyyy-MM-dd")
                    )
                  ) : (
                    <span>选择日期范围</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onReset}
              className="dark:bg-gray-700 dark:text-white flex gap-2"
            >
              <RefreshCwIcon className="w-4 h-4" />
              重置
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={false}
        animate={showAdvancedFilters ? "open" : "closed"}
      >
        <motion.div
          variants={filterVariants}
          className="space-y-4 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="软件类型" />
              </SelectTrigger>
              <SelectContent>{/* Add software type options */}</SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="更新状态" />
              </SelectTrigger>
              <SelectContent>{/* Add update status options */}</SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="安装状态" />
              </SelectTrigger>
              <SelectContent>
                {/* Add installation status options */}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <Button
          variant="ghost"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="w-full"
        >
          {showAdvancedFilters ? "收起" : "显示高级过滤器"}
        </Button>
      </motion.div>

      <motion.div
        variants={advancedFilterVariants}
        initial="closed"
        animate={showAdvancedFilters ? "open" : "closed"}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="软件类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="astronomy">天文摄影</SelectItem>
              <SelectItem value="processing">图像处理</SelectItem>
              <SelectItem value="utilities">实用工具</SelectItem>
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger>
              <SelectValue placeholder="显示密度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">紧凑</SelectItem>
              <SelectItem value="comfortable">舒适</SelectItem>
              <SelectItem value="detailed">详细</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              checked={showScreenshots}
              onCheckedChange={toggleScreenshots}
            />
            <Label>显示截图预览</Label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className={cn(
                "transition-colors",
                selectedTags.has(tag) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
