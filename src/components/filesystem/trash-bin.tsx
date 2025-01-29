import React, { useState, useEffect } from "react";
import {
  Trash2,
  RefreshCw,
  Filter,
  CheckSquare,
  List,
  Grid,
  FileText,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Trash,
  Clock,
  ArrowUpDown,
  Eye,
  Tag,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { ExtendedFile } from "@/types/filesystem";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export const TrashBin: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const {
    deletedFiles,
    theme,
    restoreFile,
    emptyTrash,
    permanentlyDeleteFile,
  } = useFilesystemStore();

  // 状态管理
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "size" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 100000]);
  const [previewFile, setPreviewFile] = useState<ExtendedFile | null>(null);

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleSelectAll();
      }
      if (e.key === "Escape") {
        setSelectedFiles([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deletedFiles]);

  // 文件过滤和排序
  const filteredFiles = deletedFiles
    .filter((file: ExtendedFile) => {
      const matchesType = filterType === "all" || file.type === filterType;
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDate =
        !dateRange.from ||
        !dateRange.to ||
        (new Date(file.lastModified) >= dateRange.from &&
          new Date(file.lastModified) <= dateRange.to);
      const matchesSize =
        file.size >= sizeRange[0] && file.size <= sizeRange[1];
      return matchesType && matchesSearch && matchesDate && matchesSize;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "name":
          return order * a.name.localeCompare(b.name);
        case "size":
          return order * (a.size - b.size);
        case "date":
          return (
            order *
            (new Date(b.lastModified).getTime() -
              new Date(a.lastModified).getTime())
          );
        default:
          return 0;
      }
    });

  // 文件操作处理函数
  const handleBatchRestore = () => {
    selectedFiles.forEach((id) => restoreFile(id));
    setSelectedFiles([]);
  };

  const handleBatchDelete = () => {
    selectedFiles.forEach((id) => permanentlyDeleteFile(id));
    setSelectedFiles([]);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id.toString()));
    }
  };

  const getSelectedFilesStats = () => {
    const count = selectedFiles.length;
    const totalSize = filteredFiles
      .filter((file) => selectedFiles.includes(file.id.toString()))
      .reduce((acc, file) => acc + file.size, 0);
    return { count, totalSize };
  };

  // 渲染函数
  const renderFilePreview = (file: ExtendedFile) => {
    switch (file.type) {
      case "image":
        return (
          <img
            src={file.thumbnailUrl || file.url}
            alt={file.name}
            className="w-full h-32 object-cover rounded"
          />
        );
      case "video":
        return (
          <div className="relative">
            {file.thumbnailUrl ? (
              <img
                src={file.thumbnailUrl}
                alt={file.name}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <Video className="w-16 h-16 text-gray-400" />
            )}
            <Badge className="absolute bottom-2 right-2">视频</Badge>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 flex items-center justify-center">
            {file.type === "document" ? (
              <FileText className="w-8 h-8 text-gray-400" />
            ) : (
              <FileIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5" />
                <span>回收站</span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col space-y-4">
              {/* 工具栏 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-sm relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="搜索文件..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setViewMode(viewMode === "list" ? "grid" : "list")
                          }
                        >
                          {viewMode === "list" ? (
                            <Grid className="w-4 h-4" />
                          ) : (
                            <List className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>切换视图模式</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSortBy("name")}>
                        按名称排序
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("size")}>
                        按大小排序
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("date")}>
                        按日期排序
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                      >
                        {sortOrder === "asc" ? "降序" : "升序"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* 过滤器 */}
              <div className="flex items-center space-x-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="文件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="document">文档</SelectItem>
                    <SelectItem value="image">图片</SelectItem>
                    <SelectItem value="video">视频</SelectItem>
                  </SelectContent>
                </Select>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Clock className="w-4 h-4 mr-2" />
                        日期范围
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => {
                          if (range) {
                            setDateRange({
                              from: range.from || undefined,
                              to: range.to || undefined,
                            });
                          } else {
                            setDateRange({ from: undefined, to: undefined });
                          }
                        }}
                        locale={zhCN}
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex-1">
                  <Slider
                    defaultValue={[sizeRange[0], sizeRange[1]]}
                    max={100000}
                    step={100}
                    onValueChange={(value) =>
                      setSizeRange(value as [number, number])
                    }
                  />
                </div>
              </div>

              {/* 批量操作栏 */}
              {selectedFiles.length > 0 && (
                <div className="flex items-center justify-between bg-primary/10 p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFiles.length === filteredFiles.length}
                      onClick={toggleSelectAll}
                    />
                    <span>
                      已选择 {getSelectedFilesStats().count} 个文件 (
                      {(getSelectedFilesStats().totalSize / 1024).toFixed(2)}{" "}
                      MB)
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleBatchRestore} variant="secondary">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      恢复选中项
                    </Button>
                    <Button onClick={handleBatchDelete} variant="destructive">
                      <Trash className="w-4 h-4 mr-2" />
                      永久删除
                    </Button>
                  </div>
                </div>
              )}

              {/* 文件列表 */}
              <ScrollArea className="h-[400px]">
                {filteredFiles.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "space-y-2"
                    }
                  >
                    {filteredFiles.map((file) =>
                      viewMode === "grid" ? (
                        <motion.div
                          key={file.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative group p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20"
                        >
                          <Checkbox
                            checked={selectedFiles.includes(file.id.toString())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFiles([
                                  ...selectedFiles,
                                  file.id.toString(),
                                ]);
                              } else {
                                setSelectedFiles(
                                  selectedFiles.filter(
                                    (id) => id !== file.id.toString()
                                  )
                                );
                              }
                            }}
                            className="absolute top-2 left-2 z-10"
                          />

                          <div className="flex flex-col items-center">
                            {renderFilePreview(file)}
                            <div className="mt-2 text-center w-full">
                              <p className="font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} MB
                              </p>
                              <p className="text-xs text-gray-400">
                                {format(
                                  new Date(file.lastModified),
                                  "yyyy-MM-dd",
                                  { locale: zhCN }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => restoreFile(file.id.toString())}
                              className="flex items-center"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              恢复
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.li
                          key={file.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center p-2 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <Checkbox
                            checked={selectedFiles.includes(file.id.toString())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFiles([
                                  ...selectedFiles,
                                  file.id.toString(),
                                ]);
                              } else {
                                setSelectedFiles(
                                  selectedFiles.filter(
                                    (id) => id !== file.id.toString()
                                  )
                                );
                              }
                            }}
                            className="mr-2"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {(file.size / 1024).toFixed(2)} MB
                            </p>
                            <p className="text-xs text-gray-400">
                              {format(
                                new Date(file.lastModified),
                                "yyyy-MM-dd",
                                { locale: zhCN }
                              )}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => restoreFile(file.id.toString())}
                            className="p-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </motion.li>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-center">垃圾箱为空</p>
                )}
              </ScrollArea>

              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={emptyTrash}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 flex items-center"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  清空垃圾箱
                </Button>
                <p className="text-sm text-gray-500">
                  共 {filteredFiles.length} 个文件
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
