import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plugin } from "@/types/plugin";
import { motion, AnimatePresence } from "framer-motion";

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
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query) {
      const filteredSuggestions = plugins
        .filter((plugin) =>
          plugin.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((plugin) => plugin.name)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, plugins]);

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
    setShowSuggestions(false);
    onSearch(query);
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
          className="pl-10 pr-12 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
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
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                variants={suggestionVariants}
                whileHover={{ backgroundColor: "#4B5563" }}
                className="px-4 py-2 cursor-pointer text-white hover:bg-gray-600"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}