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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 sm:items-center overflow-y-auto"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg bg-gray-900/95 backdrop-blur text-white p-6 rounded-lg shadow-xl border border-gray-800 mt-16 sm:mt-0"
          >
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-col space-y-4 pb-2">
                <div className="flex justify-between items-center">
                  <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-bold"
                  >
                    高级搜索
                  </motion.h2>
                  <motion.button
                    onClick={onClose}
                    variants={itemVariants}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <motion.form
                  onSubmit={handleSearch}
                  variants={itemVariants}
                  className="relative group"
                >
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索文件、标签或内容..."
                    className="w-full py-3 px-4 pr-12 rounded-lg bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors text-lg"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Search className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </Button>
                </motion.form>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <h3 className="font-medium text-gray-400 mb-3">常用筛选</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {
                          icon: <FileType className="w-4 h-4" />,
                          label: "文档",
                        },
                        {
                          icon: <Calendar className="w-4 h-4" />,
                          label: "图片",
                        },
                        { icon: <Clock className="w-4 h-4" />, label: "视频" },
                      ].map((item, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="flex items-center justify-start space-x-2 hover:bg-gray-800"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>

                  {/* 新增: 搜索建议 */}
                  <motion.div variants={itemVariants}>
                    <h3 className="font-medium text-gray-400 mb-3">搜索建议</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-700 transition-colors py-1.5"
                          onClick={() => setSearchTerm(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>

                  {/* 搜索结果展示优化 */}
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        variants={containerVariants}
                        className="space-y-2 mt-4"
                      >
                        <h3 className="font-medium text-gray-400">搜索结果</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {searchResults.map((result, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <FileType className="w-5 h-5 text-blue-400" />
                                <span>{result}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
