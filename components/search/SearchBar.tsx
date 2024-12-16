import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Settings } from "lucide-react";
import Fuse from "fuse.js";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (term: string) => void;
  items: Array<{ name: string; constellation: string; type: string }>;
}

export function SearchBar({ onSearch, items }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; constellation: string; type: string }>
  >([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fuseRef = useRef<Fuse<{
    name: string;
    constellation: string;
    type: string;
  }> | null>(null);

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
    const value = e.target.value;
    setSearchTerm(value);

    if (value && fuseRef.current) {
      const results = fuseRef.current.search(value);
      setSuggestions(results.map((result) => result.item).slice(0, 5));
    } else {
      setSuggestions([]);
    }

    onSearch(value);
  };

  const handleSearchSubmit = (value: string) => {
    if (!value.trim()) return;

    const newHistory = [
      value,
      ...searchHistory.filter((h) => h !== value),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    onSearch(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto"
    >
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.01 }} className="flex-grow">
          <Input
            type="text"
            placeholder="Search celestial objects..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-background/50 backdrop-blur-sm border-gray-700"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            type="submit"
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      {searchHistory.length > 0 && !suggestions.length && searchTerm === "" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full bg-background/95 backdrop-blur-md border border-gray-700 rounded-md mt-1"
        >
          <div className="p-2 text-sm text-muted-foreground">搜索历史</div>
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
              onClick={() => {
                setSearchTerm(item);
                handleSearchSubmit(item);
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      )}
      {suggestions.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
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
                onSearch(item.name);
                setSuggestions([]);
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.constellation} - {item.type}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
