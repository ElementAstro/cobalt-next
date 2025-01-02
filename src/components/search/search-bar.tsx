// FILEPATH: /d:/cobalt-next/src/components/search/search-bar.tsx
"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  Settings,
  RefreshCw,
  Filter,
  Sliders,
  Plus,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { CelestialObject, SearchFilters } from "@/types/search";

interface SearchBarProps {
  onSearch: (term: string, filters?: SearchFilters) => void;
  items: CelestialObject[];
}

export function SearchBar({ onSearch, items }: SearchBarProps) {
  const {
    setObjects,
    filters,
    searchTerm,
    showAdvanced,
    showSuggestions,
    suggestions,
    searchHistory,
    isLoading,
    setSearchTerm,
    setShowAdvanced,
    setShowSuggestions,
    setSuggestions,
    setFilters, // 添加setFilters
    addToHistory,
    clearHistory,
  } = useSearchStore();

  const fuseRef = useRef<Fuse<CelestialObject> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useRef(
    debounce((value: string, currentFilters: SearchFilters) => {
      if (value && fuseRef.current) {
        let results = fuseRef.current
          .search(value)
          .map((result) => result.item);

        if (currentFilters.constellations.length > 0) {
          results = results.filter((item) =>
            currentFilters.constellations.includes(item.constellation)
          );
        }

        if (currentFilters.types.length > 0) {
          results = results.filter((item) =>
            currentFilters.types.includes(item.type)
          );
        }

        if (currentFilters.minMagnitude !== undefined) {
          results = results.filter(
            (item) => item.magnitude >= currentFilters.minMagnitude
          );
        }

        if (currentFilters.maxMagnitude !== undefined) {
          results = results.filter(
            (item) => item.magnitude <= currentFilters.maxMagnitude
          );
        }

        setSuggestions(results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
      onSearch(value, filters);
    }, 300)
  ).current;

  useEffect(() => {
    fuseRef.current = new Fuse(items, {
      keys: ["name", "constellation", "type", "magnitude"],
      threshold: 0.3,
    });
    setObjects(items);
  }, [items]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value, filters);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (value: string) => {
    if (!value.trim()) return;
    addToHistory(value);
    onSearch(value, filters);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleAdvancedFilterChange = (
    filterName: keyof SearchFilters,
    value: string
  ) => {
    let newFilters: SearchFilters = { ...filters };

    switch (filterName) {
      case "constellations":
        newFilters.constellations = [value];
        break;
      case "types":
        newFilters.types = [value];
        break;
      case "minMagnitude":
        newFilters.minMagnitude = Number(value);
        break;
      case "maxMagnitude":
        newFilters.maxMagnitude = Number(value);
        break;
      // 添加其他过滤器的处理
      default:
        break;
    }

    setFilters(newFilters);
    debouncedSearch(searchTerm, newFilters);
  };

  const handleAddFilter = () => {
    // 示例功能：添加更多过滤器
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
        <motion.div whileHover={{ scale: 1.01 }} className="flex-grow relative">
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
          </AnimatePresence>
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="text-white"
                  onClick={handleAddFilter}
                  aria-label="添加过滤器"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">添加过滤器</span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>添加更多过滤选项</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AnimatePresence>
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
                  <div className="p-2 text-sm text-muted-foreground flex justify-between items-center">
                    <span>搜索历史</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearHistory}
                      aria-label="清除历史"
                    >
                      <Sliders className="h-4 w-4 text-white" />
                    </Button>
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
                    value={filters.constellations[0] || ""}
                    onValueChange={(value) =>
                      handleAdvancedFilterChange("constellations", value)
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
                    value={filters.types[0] || ""}
                    onValueChange={(value) =>
                      handleAdvancedFilterChange("types", value)
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
                  <Select
                    value={filters.minMagnitude.toString() || ""}
                    onValueChange={(value) =>
                      handleAdvancedFilterChange("minMagnitude", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择最小亮度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      {/* 更多亮度选项 */}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.maxMagnitude.toString() || ""}
                    onValueChange={(value) =>
                      handleAdvancedFilterChange("maxMagnitude", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择最大亮度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      {/* 更多亮度选项 */}
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
                        {item.constellation} - {item.type} - 亮度:{" "}
                        {item.magnitude}
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
