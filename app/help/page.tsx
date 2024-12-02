"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchFilters } from "@/types/plugin";
import { motion } from "framer-motion";

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-900"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="搜索插件..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-12 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-gray-800 dark:bg-gray-900">
            <SheetHeader>
              <SheetTitle>高级搜索</SheetTitle>
              <SheetDescription>
                使用附加过滤器细化您的搜索结果。
              </SheetDescription>
            </SheetHeader>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 py-4"
            >
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label
                  htmlFor="category"
                  className="text-right dark:text-gray-300"
                >
                  分类
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700">
                    <SelectItem value="imaging">影像处理</SelectItem>
                    <SelectItem value="planetarium">天文馆</SelectItem>
                    <SelectItem value="telescope-control">
                      望远镜控制
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label
                  htmlFor="rating"
                  className="text-right dark:text-gray-300"
                >
                  最低评分
                </Label>
                <Slider
                  id="rating"
                  max={5}
                  step={0.5}
                  className="col-span-3"
                  onValueChange={(value) =>
                    setFilters({ ...filters, minRating: value[0] })
                  }
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label
                  htmlFor="price"
                  className="text-right dark:text-gray-300"
                >
                  最高价格
                </Label>
                <Slider
                  id="price"
                  max={100}
                  step={5}
                  className="col-span-3"
                  onValueChange={(value) =>
                    setFilters({ ...filters, maxPrice: value[0] })
                  }
                />
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-4">
              <Button onClick={handleSearch} className="w-full">
                应用过滤器
              </Button>
            </motion.div>
          </SheetContent>
        </Sheet>
        <motion.div variants={itemVariants} className="flex-shrink-0">
          <Button onClick={handleSearch} className="w-full md:w-auto">
            搜索
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
