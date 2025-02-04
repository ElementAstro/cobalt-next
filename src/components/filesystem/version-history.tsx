"use client";

import React from "react";
import {
  X,
  ArrowDownToLine,
  GitCompare,
  User,
  Calendar,
  HardDrive,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Span } from "@/components/custom/span";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Version as BaseVersion } from "@/types/filesystem";

// Extend the base Version interface with UI-specific fields
interface UIVersion extends BaseVersion {
  id: number; // Enforce number type for id
  description?: string;
  thumbnail?: string;
  type?: string;
  user?: string;
  date?: string;
  comments?: string[];
}

// Update component props interface
interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  theme?: "light" | "dark" | "system";
  showThumbnails?: boolean;
  showFilters?: boolean;
  pageSize?: number;
  onVersionSelect?: (version: UIVersion) => void;
  onBulkAction?: (versions: UIVersion[]) => void;
}

// Initialize mock data with correct types
const mockVersions: UIVersion[] = [
  {
    id: 1,
    fileId: "file-1",
    number: 1,
    createdAt: new Date("2023-06-01 14:30"),
    author: "John Doe",
    comment: "更新了图像处理算法",
    size: 1200000, // 1.2MB in bytes
    hash: "abc123",
    changes: {
      additions: 15,
      deletions: 5,
    },
    // UI specific fields
    date: "2023-06-01 14:30",
    user: "John Doe",
    type: "修改",
    description: "更新了图像处理算法",
    thumbnail: "/images/version1-thumb.jpg",
    tags: ["algorithm", "image-processing"],
    status: "active",
    comments: ["Improved performance by 20%"],
  },
  // ... other versions with proper typing
];

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  maxWidth,
  theme = "dark",
  showThumbnails = true,
  showFilters = true,
  pageSize = 10,
  onVersionSelect,
  onBulkAction,
}) => {
  // Update state types
  const [versions, setVersions] = React.useState<UIVersion[]>(mockVersions);
  const [selectedVersions, setSelectedVersions] = React.useState<number[]>([]);
  const [selectedVersion, setSelectedVersion] = React.useState<UIVersion | null>(
    null
  );

  // Update compare versions state
  const [compareVersions, setCompareVersions] = React.useState<UIVersion[]>([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "user" | "size">("date");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );
  const [showComments, setShowComments] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [exportFormat, setExportFormat] = React.useState<
    "json" | "csv" | "pdf"
  >("json");

  // Update version comparison function
  const compareTwoVersions = async (v1: UIVersion, v2: UIVersion) => {
    const comparisonResult = {
      added: v1.changes.additions - v2.changes.additions,
      removed: v1.changes.deletions - v2.changes.deletions,
      modified: Math.abs(v1.changes.additions - v2.changes.additions),
      differences: [],
    };
    return comparisonResult;
  };

  // Update restore version function
  const restoreVersion = async (version: UIVersion) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVersions((prev) =>
      prev.map((v) => (v.id === version.id ? { ...v, status: "active" } : v))
    );
    return true;
  };

  const addComment = async (versionId: number, comment: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVersions((prev) =>
      prev.map((v) =>
        v.id === versionId
          ? {
            ...v,
            comments: [...(v.comments || []), comment],
          }
          : v
      )
    );
    return true;
  };

  const exportVersionHistory = async (
    versionsToExport: UIVersion[],
    format: string
  ) => {
    switch (format) {
      case "json":
        return JSON.stringify(versionsToExport, null, 2);
      case "csv":
        // Generate CSV content
        return versionsToExport
          .map((v) => `${v.id},${v.date},${v.user}`)
          .join("\n");
      case "pdf":
        // Mock PDF generation
        return new Blob(["PDF content"], { type: "application/pdf" });
      default:
        throw new Error("Unsupported format");
    }
  };

  const downloadFile = (data: BlobPart, filename: string) => {
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCompare = async (v1: UIVersion, v2: UIVersion) => {
    try {
      const comparisonResult = await compareTwoVersions(v1, v2);
      setCompareVersions([v1, v2]);
      // Use the comparison result
      toast({
        title: "比较成功",
        description: `新增: ${comparisonResult.added}, 删除: ${comparisonResult.removed}, 修改: ${comparisonResult.modified}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "比较失败",
        description: error instanceof Error ? error.message : "版本比较出错",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (version: UIVersion) => {
    try {
      await restoreVersion(version);
      toast({
        title: "还原成功",
        description: "已还原到选中版本",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "还原失败",
        description: error instanceof Error ? error.message : "版本还原出错",
        variant: "destructive",
      });
    }
  };

  const isVersion = (value: any): value is UIVersion => {
    return value && typeof value === "object" && "id" in value;
  };

  const handleExport = async (format: "json" | "csv" | "pdf" | UIVersion) => {
    try {
      let data;
      if (isVersion(format)) {
        // Single version export
        data = await exportVersionHistory([format], "json");
      } else {
        // Bulk export
        const versionsToExport = versions.filter((v) =>
          selectedVersions.includes(v.id)
        );
        data = await exportVersionHistory(versionsToExport, format);
      }

      downloadFile(
        data,
        `version-history.${isVersion(format) ? "json" : format}`
      );
      toast({
        title: "导出成功",
        description: "历史记录已导出",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "文件导出出错",
        variant: "destructive",
      });
    }
  };

  const handleSelectVersion = (versionId: number) => {
    const version = versions.find((v) => v.id === versionId);
    setSelectedVersions((prev) =>
      prev.includes(versionId)
        ? prev.filter((id) => id !== versionId)
        : [...prev, versionId]
    );
    if (version) {
      setSelectedVersion(version);
      onVersionSelect?.(version);
    }
  };

  const handleBulkAction = (action: "export" | "compare" | "delete") => {
    const selectedItems = versions.filter((v) => selectedVersions.includes(v.id));
    switch (action) {
      case "export":
        handleExport("json");
        break;
      case "compare":
        if (selectedItems.length === 2) {
          handleCompare(selectedItems[0], selectedItems[1]);
        }
        break;
      case "delete":
        setVersions((prev) => prev.filter((v) => !selectedVersions.includes(v.id)));
        onBulkAction?.(selectedItems);
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleAddComment = async () => {
    if (!selectedVersion?.id) return;
    try {
      await addComment(Number(selectedVersion.id), newComment);
      setNewComment("");
      toast({
        title: "评论成功",
        description: "已添加新评论",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "评论失败",
        description: error instanceof Error ? error.message : "评论添加出错",
        variant: "destructive",
      });
    }
  };

  // Update filteredVersions memo with correct type checking
  const filteredVersions = React.useMemo(() => {
    return versions
      .filter((version) =>
        (version.user || version.author || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (version.description || version.comment || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (version.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortDirection === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "user") {
          return sortDirection === "asc"
            ? (a.author || "").localeCompare(b.author || "")
            : (b.author || "").localeCompare(a.author || "");
        }
        if (sortBy === "size") {
          return sortDirection === "asc" ? a.size - b.size : b.size - a.size;
        }
        return 0;
      });
  }, [versions, searchQuery, sortBy, sortDirection]);

  const paginatedVersions = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVersions.slice(start, start + pageSize);
  }, [filteredVersions, currentPage, pageSize]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className={`${theme === "light"
                ? "bg-white/95 text-gray-900"
                : "bg-gray-800/95 text-white"
                } p-3 rounded-xl ${maxWidth || "max-w-4xl"
                } w-[95%] max-h-[90vh] overflow-hidden flex flex-col`}
            >
              <DialogContent className="h-full p-0">
                <div
                  className="flex justify-between items-center mb-2 border-b pb-2"
                  style={{
                    borderColor: theme === "light" ? "#e5e7eb" : "#374151",
                  }}
                >
                  {showFilters && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="搜索版本..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-2 py-1 text-sm rounded border"
                        style={{
                          backgroundColor:
                            theme === "light" ? "#f3f4f6" : "#1f2937",
                          borderColor:
                            theme === "light" ? "#e5e7eb" : "#374151",
                        }}
                      />
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as "date" | "user" | "size")
                        }
                        className="px-2 py-1 text-sm rounded border"
                        style={{
                          backgroundColor:
                            theme === "light" ? "#f3f4f6" : "#1f2937",
                          borderColor:
                            theme === "light" ? "#e5e7eb" : "#374151",
                        }}
                      >
                        <option value="date">按日期排序</option>
                        <option value="user">按用户排序</option>
                        <option value="size">按大小排序</option>
                      </select>
                      <button
                        onClick={() =>
                          setSortDirection((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          )
                        }
                        className="px-2 py-1 text-sm rounded border"
                        style={{
                          backgroundColor:
                            theme === "light" ? "#f3f4f6" : "#1f2937",
                          borderColor:
                            theme === "light" ? "#e5e7eb" : "#374151",
                        }}
                      >
                        {sortDirection === "asc" ? "升序" : "降序"}
                      </button>
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      版本历史
                    </DialogTitle>
                    <Span className="text-gray-400 text-xs mt-1">
                      共 {versions.length} 个版本
                    </Span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <DialogDescription className="overflow-y-auto flex-grow p-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {paginatedVersions.map((version, index) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-2 rounded-lg backdrop-blur-sm border transition-all ${theme === "light"
                          ? "bg-gray-100/50 border-gray-200 hover:border-gray-300"
                          : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                          }`}
                      >
                        <div
                          className="flex items-start gap-2 cursor-pointer"
                          onClick={() => handleSelectVersion(version.id)}
                        >
                          {showThumbnails && version.thumbnail && (
                            <div
                              className={`w-12 h-12 rounded-lg overflow-hidden ${selectedVersions.includes(version.id)
                                ? "ring-2 ring-blue-500"
                                : ""
                                }`}
                            >
                              <img
                                src={version.thumbnail}
                                alt="Version preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <div className="flex gap-1 flex-wrap">
                                {version.type && (
                                  <Badge
                                    variant="outline"
                                    className={`${theme === "light"
                                      ? "bg-blue-500/10 text-blue-700"
                                      : "bg-blue-500/20 text-blue-300"
                                      } text-xs`}
                                  >
                                    {version.type}
                                  </Badge>
                                )}
                                {version.tags?.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className={`${theme === "light"
                                      ? "bg-gray-500/10 text-gray-700"
                                      : "bg-gray-500/20 text-gray-300"
                                      } text-xs`}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Span
                                className="text-xs text-gray-400 flex items-center gap-1"
                                icon={HardDrive}
                              >
                                {version.size}
                              </Span>
                            </div>

                            <Span className="text-xs text-gray-300 mb-1">
                              {version.description}
                            </Span>

                            <div
                              className="grid grid-cols-2 gap-1 text-xs mb-2"
                              style={{
                                color:
                                  theme === "light" ? "#6b7280" : "#9ca3af",
                              }}
                            >
                              <Span
                                className="flex items-center gap-1"
                                icon={Calendar}
                              >
                                {version.date}
                              </Span>
                              <Span
                                className="flex items-center gap-1"
                                icon={User}
                              >
                                {version.user}
                              </Span>
                            </div>

                            <div className="flex gap-1 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={`flex-1 text-xs ${theme === "light"
                                  ? "bg-gray-100/50 hover:bg-gray-200"
                                  : "bg-gray-700/50 hover:bg-gray-600"
                                  }`}
                                onClick={() =>
                                  handleCompare(version, versions[0])
                                }
                              >
                                <GitCompare className="w-4 h-4 mr-1" />
                                比较
                              </Button>
                              <Button
                                size="sm"
                                className={`flex-1 text-xs ${theme === "light"
                                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                                  : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                onClick={() => handleExport(version)}
                              >
                                <ArrowDownToLine className="w-4 h-4 mr-1" />
                                导出
                              </Button>
                              {version.comments &&
                                version.comments.length > 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={`flex-1 text-xs ${theme === "light"
                                      ? "bg-gray-100/50 hover:bg-gray-200"
                                      : "bg-gray-700/50 hover:bg-gray-600"
                                      }`}
                                    onClick={() => {
                                      // 显示评论
                                    }}
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    评论 ({version.comments.length})
                                  </Button>
                                )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 工具栏 */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={exportFormat}
                        onValueChange={(value: "json" | "csv" | "pdf") =>
                          setExportFormat(value)
                        }
                      >
                        <SelectTrigger>导出格式</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => handleExport(exportFormat)}>
                        导出历史记录
                      </Button>
                    </div>
                  </div>

                  {/* 比较视图 */}
                  {compareVersions.length === 2 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">版本比较</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* 实现版本比较UI */}
                      </div>
                    </div>
                  )}

                  {/* 评论系统 */}
                  {showComments && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">评论</h3>
                      <div className="space-y-4">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="添加评论..."
                        />
                        <Button
                          onClick={() => toggleComments()}
                          variant="outline"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          评论
                        </Button>
                        // And change the comment button handler:
                        <Button onClick={handleAddComment}>发表评论</Button>
                        <div className="space-y-2">{/* 显示评论列表 */}</div>
                      </div>
                    </div>
                  )}
                </DialogDescription>
                <div className="flex justify-center mt-4">
                  {Array.from({
                    length: Math.ceil(filteredVersions.length / pageSize),
                  }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
