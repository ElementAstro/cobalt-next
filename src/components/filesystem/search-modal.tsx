import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  FileType,
  Clock,
  Filter,
  Image,
  Video,
  FileText,
  Music,
  Archive,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { formatFileSize } from "@/lib/utils";
import type { File, FileType as FileTypeEnum } from "@/types/filesystem";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    searchTerm,
    searchResults,
    setSearchTerm,
    setSearchResults,
    fileType,
    setFileType,
    dateRange,
    setDateRange,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    includeArchived,
    setIncludeArchived,
    isLoading,
    searchFiles,
    reset,
  } = useFilesystemStore();

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!searchTerm.trim()) return;

    // 添加到搜索历史
    const newHistory = [
      searchTerm,
      ...searchHistory.filter((h) => h !== searchTerm),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // 执行搜索
    const searchParams = {
      term: searchTerm,
      type: fileType,
      dateRange,
      minSize,
      maxSize,
      includeArchived,
    };

    await searchFiles(searchParams);
  };

  const fileTypeIcons: Record<FileTypeEnum, React.ReactNode> = {
    document: <FileText className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    audio: <Music className="w-4 h-4" />,
    archive: <Archive className="w-4 h-4" />,
    folder: <FileType className="w-4 h-4" />,
    code: <FileText className="w-4 h-4" />,
    unknown: <FileType className="w-4 h-4" />,
  };

  const dateRangeOptions = [
    { value: "any", label: "任何时间" },
    { value: "past-day", label: "过去24小时" },
    { value: "past-week", label: "过去一周" },
    { value: "past-month", label: "过去一月" },
    { value: "past-year", label: "过去一年" },
  ];

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
              className="w-full max-w-2xl bg-gray-900/95 text-white p-4 rounded-lg shadow-xl border border-gray-800"
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
                      disabled={isLoading}
                    >
                      <Search className="w-4 h-4 text-gray-400 hover:text-white" />
                    </Button>
                  </motion.form>

                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-400">搜索过滤</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-xs"
                      >
                        <Filter className="w-4 h-4 mr-1" />
                        {showAdvanced ? "隐藏" : "显示"}高级选项
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Select value={fileType} onValueChange={setFileType}>
                        <SelectTrigger>
                          <SelectValue placeholder="文件类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部类型</SelectItem>
                          <SelectItem value="document">文档</SelectItem>
                          <SelectItem value="image">图片</SelectItem>
                          <SelectItem value="video">视频</SelectItem>
                          <SelectItem value="audio">音频</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="时间范围" />
                        </SelectTrigger>
                        <SelectContent>
                          {dateRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {showAdvanced && (
                        <>
                          <div className="col-span-2 space-y-2">
                            <label className="text-sm text-gray-400">
                              文件大小范围
                            </label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={minSize}
                                onChange={(e) =>
                                  setMinSize(Number(e.target.value))
                                }
                                placeholder="最小"
                                className="w-24"
                              />
                              <span>-</span>
                              <Input
                                type="number"
                                value={maxSize}
                                onChange={(e) =>
                                  setMaxSize(Number(e.target.value))
                                }
                                placeholder="最大"
                                className="w-24"
                              />
                              <span className="text-sm text-gray-400">MB</span>
                            </div>
                          </div>

                          <div className="col-span-2 flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                              包含已归档
                            </span>
                            <Switch
                              checked={includeArchived}
                              onCheckedChange={setIncludeArchived}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {searchHistory.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <h3 className="font-medium text-gray-400 mb-2">
                        搜索历史
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((term, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-gray-700 transition-colors"
                            onClick={() => {
                              setSearchTerm(term);
                              handleSearch();
                            }}
                          >
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        variants={containerVariants}
                        className="space-y-2 mt-2"
                      >
                        <h3 className="font-medium text-gray-400">
                          搜索结果 ({searchResults.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {searchResults.map((result) => (
                            <motion.div
                              key={result.id}
                              variants={itemVariants}
                              className="p-3 bg-gray-800/50 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {fileTypeIcons[result.type]}
                                  <div>
                                    <div className="font-medium">
                                      {result.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {result.path}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {formatFileSize(result.size)}
                                </div>
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
