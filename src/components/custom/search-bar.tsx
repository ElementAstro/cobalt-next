"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialSuggestions: string[];
  placeholder?: string;
  onSearch?: (term: string) => void;
  className?: string;
  variant?: "default" | "minimal" | "compact";
  animationDuration?: number;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  iconVariant?: "default" | "modern" | "minimal";
  primaryColor?: string;
  secondaryColor?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  showClearButton?: boolean;
  suggestionLimit?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialSuggestions,
  placeholder = "搜索...",
  onSearch,
  className,
  variant = "default",
  animationDuration = 0.3,
  disabled = false,
  value,
  onChange,
  iconVariant = "default",
  primaryColor,
  secondaryColor,
  size = "md",
  loading = false,
  showClearButton = true,
  suggestionLimit = 10,
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const searchTerm = value !== undefined ? value : internalSearchTerm;
  const setSearchTerm = onChange
    ? onChange
    : (term: string) => setInternalSearchTerm(term);

  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const iconSize =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const inputPadding =
    size === "sm" ? "pl-8 pr-8" : size === "lg" ? "pl-12 pr-12" : "pl-10 pr-10";
  const iconPosition =
    size === "sm" ? "left-1.5" : size === "lg" ? "left-3" : "left-2";

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full mx-auto p-1",
        variant === "minimal" && "max-w-[300px]",
        variant === "compact" && "max-w-[200px]",
        className,
        "rounded-lg shadow-lg hover:shadow-md transition-shadow"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationDuration }}
    >
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className={cn(
            "w-full py-2 rounded-full border-2 focus:ring transition-all duration-300",
            inputPadding,
            primaryColor
              ? `focus:border-[${primaryColor}] focus:ring-[${primaryColor}]/20`
              : "focus:border-blue-500 focus:ring-blue-200",
            secondaryColor
              ? `bg-[${secondaryColor}] text-[${secondaryColor}]/90 placeholder-[${secondaryColor}]/70`
              : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
            variant === "minimal" && "border-none shadow-none",
            size === "sm" && "text-sm",
            size === "lg" && "text-lg"
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="搜索"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 transition-colors",
            iconPosition,
            primaryColor
              ? `text-[${primaryColor}] hover:text-[${primaryColor}]/80`
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Search className={iconSize} />
            </motion.div>
          ) : (
            <Search className={iconSize} />
          )}
          <span className="sr-only">聚焦搜索</span>
        </Button>
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors",
              primaryColor
                ? `text-[${primaryColor}] hover:text-[${primaryColor}]/80`
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
            onClick={handleClear}
          >
            <X className={iconSize} />
            <span className="sr-only">清除搜索</span>
          </Button>
        )}
      </div>
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            className="absolute z-10 w-full mt-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                className={cn(
                  "px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors",
                  primaryColor ? `hover:bg-[${primaryColor}]/10` : ""
                )}
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
    </motion.form>
  );
};

export default SearchBar;
