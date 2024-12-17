import React, { useEffect, useState } from "react";
import { X, Search, Calendar, FileType, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSearchStore } from "@/lib/store/filesystem";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { searchTerm, searchResults, setSearchTerm, setSearchResults, reset } =
    useSearchStore();
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    type: "all",
    dateRange: "any",
    size: "any",
  });

  const searchSuggestions = ["最近修改的文档", "大型视频文件", "共享的图片"];

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement actual search logic here
    const mockResults = ["Result 1", "Result 2", "Result 3"];
    setSearchResults(mockResults);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full max-w-md bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg`}
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl font-bold"
                >
                  Search Files
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  variants={itemVariants}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </CardHeader>
              <CardContent>
                <motion.form
                  onSubmit={handleSearch}
                  variants={itemVariants}
                  className="mb-4"
                >
                  <div className="relative">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search files..."
                      className={`w-full py-2 px-4 pr-10 rounded-lg bg-gray-700 text-white`}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    >
                      <Search className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.form>
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setAdvancedSearch(!advancedSearch)}
                    className="w-full justify-start"
                  >
                    <FileType className="w-4 h-4 mr-2" />
                    高级搜索选项
                  </Button>

                  {advancedSearch && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        value={searchFilters.type}
                        onValueChange={(v) =>
                          setSearchFilters({ ...searchFilters, type: v })
                        }
                      >
                        <SelectTrigger>
                          <span>文件类型</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部</SelectItem>
                          <SelectItem value="document">文档</SelectItem>
                          <SelectItem value="image">图片</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={searchFilters.dateRange}
                        onValueChange={(v) =>
                          setSearchFilters({ ...searchFilters, dateRange: v })
                        }
                      >
                        <SelectTrigger>
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>时间范围</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">不限</SelectItem>
                          <SelectItem value="today">今天</SelectItem>
                          <SelectItem value="week">本周</SelectItem>
                          <SelectItem value="month">本月</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">搜索建议</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => setSearchTerm(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mt-4"
                    >
                      <motion.h3
                        variants={itemVariants}
                        className="font-semibold mb-2"
                      >
                        Search Results:
                      </motion.h3>
                      <motion.ul
                        variants={containerVariants}
                        className="space-y-2"
                      >
                        {searchResults.map((result, index) => (
                          <motion.li
                            key={index}
                            variants={itemVariants}
                            className={`p-2 rounded-lghover:bg-gray-700 cursor-pointer transition duration-200`}
                          >
                            {result}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
