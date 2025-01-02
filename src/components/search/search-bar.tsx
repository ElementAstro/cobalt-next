"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Settings, RefreshCw } from "lucide-react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useSearchStore from "@/store/useSearchStore";

interface SearchBarProps {
  onSearch: (
    term: string,
    filters?: { constellation?: string; type?: string }
  ) => void;
  items: Array<{ name: string; constellation: string; type: string }>;
}

export function SearchBar({ onSearch, items }: SearchBarProps) {
  const { searchTerm, setSearchTerm, objects } = useSearchStore();

  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; constellation: string; type: string }>
  >([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<{
    constellation?: string;
    type?: string;
  }>({});
  const fuseRef = useRef<Fuse<{
    name: string;
    constellation: string;
    type: string;
  }> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useRef(
    debounce(
      (
        value: string,
        currentFilters: { constellation?: string; type?: string }
      ) => {
        if (value && fuseRef.current) {
          setIsLoading(true);
          let results = fuseRef.current
            .search(value)
            .map((result) => result.item);

          if (currentFilters.constellation) {
            results = results.filter(
              (item) => item.constellation === currentFilters.constellation
            );
          }

          if (currentFilters.type) {
            results = results.filter(
              (item) => item.type === currentFilters.type
            );
          }

          setSuggestions(results.slice(0, 5));
          setIsLoading(false);
        } else {
          setSuggestions([]);
        }
        onSearch(value, filters);
      },
      300
    )
  ).current;

  useEffect(() => {
    fuseRef.current = new Fuse(items, {
      keys: ["name", "constellation", "type"],
      threshold: 0.3,
    });

    // 从 localStorage 加载搜索历史
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, [items]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value, filters);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (value: string) => {
    if (!value.trim()) return;

    const newHistory = [
      value,
      ...searchHistory.filter((h) => h !== value),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    onSearch(value, filters);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // 延迟以允许点击建议项
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleAdvancedFilterChange = (
    filterName: keyof typeof filters,
    value: string
  ) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    debouncedSearch(searchTerm, newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 100,
      }}
      className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto"
    >
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.01 }} className="flex-grow">
          <Input
            ref={inputRef}
            type="text"
            placeholder="搜索天体..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            className="w-full bg-background/50 backdrop-blur-sm border-gray-700 text-white"
            aria-label="搜索输入"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="text-white"
            onClick={() => handleSearchSubmit(searchTerm)}
            aria-label="搜索按钮"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">搜索</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="text-white"
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-label="高级搜索设置"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">高级设置</span>
          </Button>
        </motion.div>
      </div>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-12 top-2"
          >
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
          </motion.div>
        )}

        {showSuggestions && (
          <>
            {searchHistory.length > 0 &&
              !suggestions.length &&
              searchTerm === "" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full bg-background/95 backdrop-blur-md border border-gray-700 rounded-md mt-1"
                >
                  <div className="p-2 text-sm text-muted-foreground">
                    搜索历史
                  </div>
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSearchTerm(item);
                        handleSearchSubmit(item);
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2 text-white" />
                      <span className="text-white">{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full bg-background/95 backdrop-blur-md border border-gray-700 rounded-md mt-1 p-3 space-y-2"
              >
                <div className="flex flex-col md:flex-row gap-2">
                  <Select
                    value={filters.constellation || ""}
                    onValueChange={(value) =>
                      handleAdvancedFilterChange("constellation", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择星座" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Orion">猎户座</SelectItem>
                      <SelectItem value="Cassiopeia">仙后座</SelectItem>
                      <SelectItem value="Ursa Major">大熊座</SelectItem>
                      {/* 更多星座选项 */}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.type || ""}
                    onValueChange={(value) =>
                      handleAdvancedFilterChange("type", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Galaxy">星系</SelectItem>
                      <SelectItem value="Nebula">星云</SelectItem>
                      <SelectItem value="Star">恒星</SelectItem>
                      {/* 更多类型选项 */}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setShowAdvanced(false)}
                  variant="outline"
                  className="w-full"
                >
                  应用筛选
                </Button>
              </motion.div>
            )}

            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full bg-background/95 backdrop-blur-md border border-gray-700 rounded-md mt-1 max-h-60 overflow-auto shadow-lg"
              >
                {suggestions.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 hover:bg-accent cursor-pointer border-b border-gray-700 last:border-none"
                    onClick={() => {
                      setSearchTerm(item.name);
                      handleSearchSubmit(item.name);
                      setSuggestions([]);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.constellation} - {item.type}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
