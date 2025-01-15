"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Search,
  Filter,
  Trash2,
  Edit,
  Plus,
  Download,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { useSessionStorageStore } from "@/store/useStorageStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StorageItem {
  key: string;
  value: string;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSessionStorageStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await updateSettings(localSettings);
      setSubmitStatus("success");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-2">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="theme" className="text-right text-sm">
                主题
              </Label>
              <Select
                value={localSettings.theme}
                onValueChange={(value: "light" | "dark") =>
                  setLocalSettings({ ...localSettings, theme: value })
                }
              >
                <SelectTrigger className="col-span-3 h-8">
                  <div className="flex items-center gap-2">
                    <SelectValue placeholder="选择主题" />
                    {localSettings.theme === "light" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light" className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    浅色
                  </SelectItem>
                  <SelectItem value="dark" className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    深色
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="itemsPerPage" className="text-right text-sm">
                每页条目数
              </Label>
              <Input
                id="itemsPerPage"
                type="number"
                value={localSettings.itemsPerPage}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    itemsPerPage: parseInt(e.target.value),
                  })
                }
                className="col-span-3 h-8"
                min={1}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="showValuePreview" className="text-right text-sm">
                显示预览
              </Label>
              <Switch
                id="showValuePreview"
                checked={localSettings.showValuePreview}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showValuePreview: checked,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  保存成功
                </>
              ) : submitStatus === "error" ? (
                <>
                  <XCircle className="w-4 h-4" />
                  保存失败
                </>
              ) : (
                "保存更改"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface StorageItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (key: string, value: string) => void;
  title: string;
  initialKey?: string;
  initialValue?: string;
}

export function StorageItemModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialKey = "",
  initialValue = "",
}: StorageItemModalProps) {
  const [key, setKey] = useState(initialKey);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setKey(initialKey);
    setValue(initialValue);
  }, [initialKey, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(key, value);
    setKey("");
    setValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-2 py-2">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="key" className="text-right text-sm">
                键
              </Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="col-span-3 h-8 text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="value" className="text-right text-sm">
                值
              </Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="col-span-3 h-8 text-sm"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" size="sm">
              保存
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}

export function SessionStorageEditor() {
  const {
    items,
    settings,
    currentPage,
    setItems,
    addItem,
    editItem,
    deleteItem,
    updateSettings,
    setCurrentPage,
  } = useSessionStorageStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<StorageItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "recent" | "oldest">("all");

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const filteredItems = useMemo(() => {
    let filtered = items.filter((item: StorageItem) =>
      item.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filter === "recent") {
      filtered.sort((a: StorageItem, b: StorageItem) =>
        b.key.localeCompare(a.key)
      );
    } else if (filter === "oldest") {
      filtered.sort((a: StorageItem, b: StorageItem) =>
        a.key.localeCompare(b.key)
      );
    }

    return filtered;
  }, [items, searchQuery, filter]);

  useEffect(() => {
    const newItems: StorageItem[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        newItems.push({ key, value: sessionStorage.getItem(key) || "" });
      }
    }
    setItems(newItems);
  }, [setItems]);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * settings.itemsPerPage,
    currentPage * settings.itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / settings.itemsPerPage);

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sessionStorage.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedItems: StorageItem[] = JSON.parse(
          event.target?.result as string
        );
        importedItems.forEach(({ key, value }) => {
          sessionStorage.setItem(key, value);
        });
        setItems(importedItems);
      } catch (error) {
        // Handle error
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`container mx-auto p-2 ${
        settings.theme === "light" ? "" : "dark"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-primary/10 p-2 rounded-lg">
            <Settings className="w-5 h-5" />
          </span>
          SessionStorage 编辑器
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="搜索条目..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-2 top-2 w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              添加条目
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsSettingsModalOpen(true)}
              className="gap-1"
            >
              <Settings className="w-4 h-4" />
              设置
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleExport}
              className="gap-1"
            >
              <Download className="w-4 h-4" />
              导出
            </Button>
            <label className="flex items-center gap-1 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="text-sm">导入</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
        </div>
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {paginatedItems.map(({ key, value }: StorageItem) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hover:shadow-md transition-all"
            >
              <Card className="mb-2">
                <CardContent className="p-2">
                  <h3 className="font-bold mb-2">{key}</h3>
                  {settings.showValuePreview && (
                    <p className="text-sm text-gray-500 mb-2">
                      {value.substring(0, 50)}
                      {value.length > 50 ? "..." : ""}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentItem({ key, value });
                        setIsEditModalOpen(true);
                      }}
                      className="gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCurrentItem({ key, value });
                        setIsDeleteModalOpen(true);
                      }}
                      className="gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>键</TableHead>
              {settings.showValuePreview && <TableHead>值预览</TableHead>}
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedItems.map(({ key, value }: StorageItem) => (
                <motion.tr
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <TableCell>{key}</TableCell>
                  {settings.showValuePreview && (
                    <TableCell>
                      {value.substring(0, 50)}
                      {value.length > 50 ? "..." : ""}
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setCurrentItem({ key, value });
                        setIsEditModalOpen(true);
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setCurrentItem({ key, value });
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      删除
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      )}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {items.length} 条目
          </span>
          <Select
            value={filter}
            onValueChange={(value: "all" | "recent" | "oldest") => {
              setFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="recent">最近</SelectItem>
              <SelectItem value="oldest">最早</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          <span className="py-1 px-2 bg-secondary text-secondary-foreground rounded text-sm">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      </div>
      <StorageItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addItem}
        title="添加条目"
      />
      <StorageItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(key, value) => {
          if (currentItem) {
            editItem(currentItem.key, key, value);
          }
          setIsEditModalOpen(false);
        }}
        title="编辑条目"
        initialKey={currentItem?.key}
        initialValue={currentItem?.value}
      />
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (currentItem) {
            deleteItem(currentItem.key);
          }
          setIsDeleteModalOpen(false);
        }}
        title="删除条目"
        message="确定要删除此条目吗？"
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
