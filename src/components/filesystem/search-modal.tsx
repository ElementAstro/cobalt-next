import React, { useEffect, useState } from "react";
import { X, Search, Calendar, FileType, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useFilesystemStore } from "@/store/useFilesystemStore";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { searchTerm, searchResults, setSearchTerm, setSearchResults, reset } =
    useFilesystemStore();
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
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-lg bg-gray-900/95 backdrop-blur text-white p-4 rounded-lg shadow-xl border border-gray-800"
            >
              <DialogContent className="bg-transparent border-none shadow-none">
                <DialogHeader className="flex justify-between pb-2">
                  <motion.h2 variants={itemVariants}>高级搜索</motion.h2>
                  <DialogClose />
                </DialogHeader>

                <DialogDescription className="space-y-4">
                  <motion.form
                    onSubmit={handleSearch}
                    variants={itemVariants}
                    className="relative"
                  >
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="搜索文件、标签或内容..."
                      className="w-full py-2 px-3 pr-10 rounded bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors text-sm"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400 hover:text-white" />
                    </Button>
                  </motion.form>

                  <motion.div variants={itemVariants}>
                    <h3 className="font-medium text-gray-400 mb-2">常用筛选</h3>
                    <div className="grid grid-cols-3 gap-2">
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
                          className="flex items-center justify-start space-x-1 hover:bg-gray-800 text-xs"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="font-medium text-gray-400 mb-2">搜索建议</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-700 transition-colors py-1 px-2 text-xs"
                          onClick={() => setSearchTerm(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        variants={containerVariants}
                        className="space-y-2 mt-2"
                      >
                        <h3 className="font-medium text-gray-400">搜索结果</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.map((result, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              className="p-2 bg-gray-800/50 rounded hover:bg-gray-700/50 cursor-pointer transition-colors text-sm"
                            >
                              <div className="flex items-center space-x-2">
                                <FileType className="w-4 h-4 text-blue-400" />
                                <span>{result}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DialogDescription>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
