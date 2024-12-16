import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plugin } from "@/types/plugin";
import { motion, AnimatePresence } from "framer-motion";
import { usePluginStore } from "@/lib/store/plugin";

interface AutocompleteSearchProps {
  plugins: Plugin[];
  onSearch: (query: string) => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const suggestionVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export function AutocompleteSearch({
  plugins,
  onSearch,
  className,
}: AutocompleteSearchProps) {
  const searchPlugins = usePluginStore((state) => state.searchPlugins);
  const setSearchFilters = usePluginStore((state) => state.setSearchFilters);
  const searchFilters = usePluginStore((state) => state.searchFilters);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("searchHistory") || "[]");
    }
    return [];
  });

  const popularSearches = ["天文摄影", "望远镜控制", "图像处理", "自动导星"];

  const addToHistory = (term: string) => {
    const newHistory = [
      term,
      ...searchHistory.filter((item) => item !== term),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  useEffect(() => {
    setSuggestions(
      searchPlugins(query)
        .map((plugin) => plugin.name)
        .slice(0, 5)
    );
  }, [query, searchPlugins]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSearch = () => {
    if (query.trim()) {
      addToHistory(query.trim());
      setShowSuggestions(false);
      onSearch(query);
      setSearchFilters({ ...searchFilters });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative ${className}`}
      ref={containerRef}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <Input
          type="text"
          placeholder="搜索插件..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-12 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 dark:bg-gray-800"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3"
          onClick={handleSearch}
        >
          搜索
        </Button>
      </div>
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-gray-700 rounded-md shadow-lg"
          >
            {suggestions.length > 0 && (
              <div className="p-2">
                <h3 className="text-sm text-gray-400 px-2 py-1">搜索建议</h3>
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    variants={suggestionVariants}
                    whileHover={{ backgroundColor: "#4B5563" }}
                    className="px-4 py-2 cursor-pointer text-white hover:bg-gray-600 dark:hover:bg-gray-700"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </motion.li>
                ))}
              </div>
            )}

            {searchHistory.length > 0 && (
              <div className="p-2 border-t border-gray-600">
                <h3 className="text-sm text-gray-400 px-2 py-1">搜索历史</h3>
                {searchHistory.map((term, index) => (
                  <motion.div
                    key={`history-${index}`}
                    className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    <span className="text-gray-300">{term}</span>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="p-2 border-t border-gray-600">
              <h3 className="text-sm text-gray-400 px-2 py-1">热门搜索</h3>
              <div className="flex flex-wrap gap-2 p-2">
                {popularSearches.map((term, index) => (
                  <motion.span
                    key={`popular-${index}`}
                    className="px-3 py-1 bg-gray-600 rounded-full text-sm text-gray-200 cursor-pointer hover:bg-gray-500"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
