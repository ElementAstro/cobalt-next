import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [input, setInput] = useState(value);

  // 使用 useMemo 创建一个防抖后的 onChange 函数
  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  useEffect(() => {
    // 调用防抖后的 onChange 函数
    debouncedOnChange(input);

    // 组件卸载时取消防抖
    return () => {
      debouncedOnChange.cancel();
    };
  }, [input, debouncedOnChange]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const clearInput = () => {
    setInput("");
    onChange("");
  };

  return (
    <motion.div
      className="relative dark:bg-gray-800 p-2 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="搜索应用"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="pl-8 w-full dark:bg-gray-700 dark:text-white"
      />
      {input && (
        <X
          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={clearInput}
        />
      )}
    </motion.div>
  );
}
