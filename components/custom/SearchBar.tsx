"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialSuggestions: string[];
  placeholder?: string;
  onSearch?: (term: string) => void;
  className?: string;
  variant?: "default" | "minimal";
  animationDuration?: number;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialSuggestions,
  placeholder = "搜索...",
  onSearch,
  className,
  variant = "default",
  animationDuration = 0.3,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filteredSuggestions = initialSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions(initialSuggestions);
      setShowSuggestions(false);
    }
  }, [searchTerm, initialSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    if (onSearch) onSearch(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-sm mx-auto p-4",
        variant === "minimal" && "max-w-[300px]",
        className,
        darkMode ? "bg-gray-800" : "bg-white",
        "rounded-lg shadow-lg"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationDuration }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          搜索
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-gray-700 dark:text-gray-200"
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2 rounded-full border-2 focus:border-blue-500 focus:ring focus:ring-blue-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300",
            variant === "minimal" && "border-none shadow-none"
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="搜索"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => inputRef.current?.focus()}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">聚焦搜索</span>
        </Button>
        <AnimatePresence>
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-8 w-8 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">清除搜索</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {variant !== "minimal" && (
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="absolute right-0 top-0 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          <Search className="h-4 w-4 text-white" />
          <span className="sr-only">搜索</span>
        </Button>
      )}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            className="absolute z-10 w-full mt-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
              >
                {suggestion}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {variant === "minimal" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">切换建议</span>
        </Button>
      )}
    </motion.form>
  );
};

export default SearchBar;
