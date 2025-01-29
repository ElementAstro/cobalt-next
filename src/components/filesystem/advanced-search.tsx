"use client";

import React, { useEffect } from "react";
import {
  X,
  Search,
  FileText,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Tag,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { ExtendedFile } from "@/types/filesystem";
import { debounce } from "lodash";
import { toast } from "@/hooks/use-toast";
import { filesystemApi } from "@/services/api/filesystem";
import { mockFilesystemApi } from "@/services/mock/filesystem";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  customFilters?: {
    sizeRange?: boolean;
    ownerFilter?: boolean;
    tagFilter?: boolean;
  };
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  customFilters = {
    sizeRange: true,
    ownerFilter: true,
    tagFilter: true,
  },
}) => {
  const {
    searchTerm,
    setSearchTerm,
    fileType,
    setFileType,
    dateRange,
    setDateRange,
    includeArchived,
    setIncludeArchived,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    owner,
    setOwner,
    searchTags,
    setSearchTags,
  } = useFilesystemStore();

  const api = process.env.NEXT_PUBLIC_API_MOCK === "enabled" ? mockFilesystemApi : filesystemApi;

  const handleSearch = async () => {    
    try {
      setIsLoading(true);
  
      // 构造搜索参数
      const searchParams = {
        term: searchTerm,
        type: fileType,
        dateRange: dateRange,
        includeArchived: includeArchived,
        sizeRange: {
          min: minSize,
          max: maxSize
        },
        owner: owner,
        tags: searchTags.split(",").map(tag => tag.trim()).filter(Boolean)
      };
  
      // 调用搜索 API
      const response = await api.search(searchParams);
      
      if (response.status === "success") {
        setSearchResults(response.data);
        if (response.data.length === 0) {
          toast({
            title: "搜索完成",
            description: "未找到匹配的文件",
            variant: "default"
          });
        } else {
          toast({
            title: "搜索完成",
            description: `找到 ${response.data.length} 个匹配文件`,
            variant: "default"
          });
        }
      } else {
        throw new Error("Search failed");
      }
  
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "搜索失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 添加防抖搜索
  const debouncedSearch = debounce(handleSearch, 300);
  
  // 搜索条件变化时自动触发搜索
  useEffect(() => {
    if (searchTerm || fileType !== 'all' || dateRange !== 'any') {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [
    searchTerm,
    fileType,
    dateRange,
    includeArchived,
    minSize,
    maxSize,
    owner,
    searchTags
  ]);
  

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-green-500" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay asChild>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </DialogOverlay>
          <DialogContent asChild>
            <motion.div
              className="bg-gray-800 text-white p-6 rounded-lg max-w-lg w-full mx-4 relative"
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Advanced Search</span>
                  <DialogClose asChild>
                    <button className="p-2 rounded-full hover:bg-gray-700 transition duration-200 text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="space-y-4"
              >
                {/* Search Term */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="searchTerm"
                    className="block mb-2 font-medium"
                  >
                    Search Term
                  </Label>
                  <Input
                    id="searchTerm"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="Enter search term..."
                    required
                  />
                </motion.div>

                {/* File Type */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="block mb-2 font-medium">File Type</Label>
                  <Select
                    value={fileType}
                    onValueChange={(value) => setFileType(value as any)}
                  >
                    <SelectTrigger className="w-full p-2 rounded bg-gray-700">
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Date Range */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="block mb-2 font-medium">Date Range</Label>
                  <Select
                    value={dateRange}
                    onValueChange={(value) => setDateRange(value as any)}
                  >
                    <SelectTrigger className="w-full p-2 rounded bg-gray-700">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="past-week">Past Week</SelectItem>
                      <SelectItem value="past-month">Past Month</SelectItem>
                      <SelectItem value="past-year">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Include Archived */}
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Checkbox
                    id="includeArchived"
                    checked={includeArchived}
                    onCheckedChange={(checked) =>
                      setIncludeArchived(checked === true)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="includeArchived" className="font-medium">
                    Include Archived
                  </Label>
                </motion.div>

                {/* Size Range Filter */}
                {customFilters.sizeRange && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <Label className="block mb-2 font-medium">Size Range</Label>
                    <div className="px-2">
                      <Slider
                        defaultValue={[minSize, maxSize]}
                        max={100000}
                        step={100}
                        onValueChange={(value) => {
                          setMinSize(value[0]);
                          setMaxSize(value[1]);
                        }}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-400">
                        <span>{formatFileSize(minSize)}</span>
                        <span>{formatFileSize(maxSize)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Owner Filter */}
                {customFilters.ownerFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label className="block mb-2 font-medium">Owner</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="pl-9 bg-gray-700"
                        placeholder="Filter by owner..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Tags Filter */}
                {customFilters.tagFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <Label className="block mb-2 font-medium">Tags</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        value={searchTags}
                        onChange={(e) => setSearchTags(e.target.value)}
                        className="pl-9 bg-gray-700"
                        placeholder="Filter by tags..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Search Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </motion.div>
              </form>

              {/* Search Results */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: searchResults.length > 0 ? 1 : 0,
                  scale: searchResults.length > 0 ? 1 : 0.95,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                className="mt-6 bg-gray-700/50 p-4 rounded-lg"
              >
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">搜索结果：</h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {searchResults.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 100,
                          }}
                          className="p-3 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-white">
                                {file.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {formatFileSize(file.size)} ·{" "}
                                {new Date(
                                  file.lastModified
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-500/50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
