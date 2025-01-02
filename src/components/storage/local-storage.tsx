"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useLocalStorageStore } from "@/store/useStorageStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StorageItem {
  key: string;
  value: string;
  selected?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  type?: "string" | "number" | "boolean" | "object" | "array";
  size?: number;
  expiration?: string;
  encrypted?: boolean;
}

interface LocalStorageManagerProps {
  isLandscape: boolean;
}

export function LocalStorageManager({ isLandscape }: LocalStorageManagerProps) {
  const {
    items,
    loadItems,
    addItem,
    updateItem,
    deleteItem,
    selectAll,
    toggleSelect,
    deleteSelected,
    exportItems,
    importItems,
    searchTerm,
    setSearchTerm,
  } = useLocalStorageStore();

  const [newItem, setNewItem] = useState<StorageItem>({
    key: "",
    value: "",
    tags: [],
    description: "",
    type: "string",
    encrypted: false,
  });
  const [editItem, setEditItem] = useState<StorageItem | null>(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditValue, setBulkEditValue] = useState("");

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddItem = () => {
    if (!newItem.key || !newItem.value) {
      toast({
        title: "添加失败",
        description: `请填写项的键和值。`,
      });
      return;
    }
    addItem(newItem);
    setNewItem({
      key: "",
      value: "",
      tags: [],
      description: "",
      type: "string",
      encrypted: false,
    });
    toast({
      title: "添加成功",
      description: `项 "${newItem.key}" 已成功添加。`,
    });
  };

  const handleUpdateItem = () => {
    if (editItem) {
      updateItem(editItem);
      setEditItem(null);
      toast({
        title: "更新成功",
        description: `项 "${editItem.key}" 已成功更新。`,
      });
    }
  };

  const handleDeleteSelected = () => {
    deleteSelected();
    toast({
      title: "批量删除成功",
      description: "选中的项已成功删除。",
    });
  };

  const handleExport = () => {
    exportItems();
    toast({
      title: "导出成功",
      description: "选中的项已成功导出。",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (typeof contents === "string") {
        try {
          const importedItems: StorageItem[] = JSON.parse(contents);
          importItems(importedItems);
          toast({
            title: "导入成功",
            description: `${importedItems.length} 个项已成功导入。`,
          });
        } catch (error) {
          console.error("解析 JSON 时出错:", error);
          toast({
            title: "导入错误",
            description: "导入项时出现错误，请检查文件格式。",
            variant: "destructive",
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAllChecked(checked);
    selectAll(checked);
  };

  const handleSelect = (key: string, checked: boolean) => {
    toggleSelect(key, checked);
  };

  const handleBulkEdit = () => {
    const selectedItems = items.filter((item: StorageItem) => item.selected);
    if (selectedItems.length === 0) {
      toast({
        title: "批量编辑失败",
        description: "请先选择要编辑的项",
        variant: "destructive",
      });
      return;
    }

    const updatedItems = items.map((item: StorageItem) =>
      item.selected ? { ...item, value: bulkEditValue } : item
    );

    updatedItems.forEach((item: StorageItem) => {
      if (item.selected) {
        updateItem(item);
      }
    });

    toast({
      title: "批量编辑成功",
      description: `${selectedItems.length} 个项已更新`,
    });

    setBulkEditMode(false);
    setBulkEditValue("");
  };

  const filteredItems = items.filter(
    (item: StorageItem) =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags &&
        item.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`dark:bg-gray-900 min-h-screen ${
          isLandscape ? "p-2" : "p-6"
        }`}
      >
        <Card className={`${isLandscape ? "p-3" : "p-6"} space-y-4`}>
          <motion.div className="flex justify-between items-center">
            <motion.h2
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className={`${
                isLandscape ? "text-xl" : "text-3xl"
              } font-bold text-white`}
            >
              LocalStorage 管理器
            </motion.h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => loadItems()}>
                刷新
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.localStorage.clear()}
              >
                清空全部
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid ${
              isLandscape ? "grid-cols-1 gap-2" : "grid-cols-3 gap-4"
            }`}
          >
            <div className="grid gap-2 w-full">
              <Input
                placeholder="项键名"
                value={newItem.key}
                onChange={(e) =>
                  setNewItem({ ...newItem, key: e.target.value })
                }
                aria-label="项键名输入"
              />
              <div className="flex flex-col md:flex-row gap-2">
                <Select
                  value={newItem.type}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, type: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">字符串</SelectItem>
                    <SelectItem value="number">数字</SelectItem>
                    <SelectItem value="boolean">布尔值</SelectItem>
                    <SelectItem value="object">对象</SelectItem>
                    <SelectItem value="array">数组</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={newItem.encrypted ? "default" : "outline"}
                  onClick={() =>
                    setNewItem({ ...newItem, encrypted: !newItem.encrypted })
                  }
                >
                  {newItem.encrypted ? "已加密" : "未加密"}
                </Button>
              </div>
              <Input
                placeholder="项值"
                value={newItem.value}
                onChange={(e) =>
                  setNewItem({ ...newItem, value: e.target.value })
                }
                aria-label="项值输入"
              />
              <Input
                placeholder="描述"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                aria-label="描述输入"
              />
              <Button onClick={handleAddItem} className="w-full">
                添加项
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0"
          >
            <Input
              placeholder="搜索项..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="搜索项"
              className="w-full md:w-1/2"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAllChecked}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-white">
                全选
              </Label>
              <Button
                onClick={() => setBulkEditMode(!bulkEditMode)}
                variant="outline"
                disabled={!items.some((i: StorageItem) => i.selected)}
              >
                批量编辑
              </Button>
            </div>
          </motion.div>
          {bulkEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center space-x-2 mb-4"
            >
              <Input
                placeholder="输入批量编辑的值"
                value={bulkEditValue}
                onChange={(e) => setBulkEditValue(e.target.value)}
                className="flex-1"
                aria-label="批量编辑输入"
              />
              <Button onClick={handleBulkEdit}>应用</Button>
              <Button variant="outline" onClick={() => setBulkEditMode(false)}>
                取消
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Table className="text-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">选择</TableHead>
                  <TableHead>键</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>值</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>加密</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item: StorageItem, index: number) => (
                  <motion.tr
                    key={item.key}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-700"
                  >
                    <TableCell>
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={(checked) =>
                          handleSelect(item.key, checked as boolean)
                        }
                        aria-label={`选择项 ${item.key}`}
                      />
                    </TableCell>
                    <TableCell>{item.key}</TableCell>
                    <TableCell>{item.type || "string"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.value}
                    </TableCell>
                    <TableCell>
                      {item.size ? `${item.size} bytes` : "-"}
                    </TableCell>
                    <TableCell>{item.encrypted ? "是" : "否"}</TableCell>
                    <TableCell>
                      {item.description ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer text-blue-400 hover:underline">
                              查看描述
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog
                          onOpenChange={(open) => {
                            if (!open) setEditItem(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setEditItem(item)}
                            >
                              编辑
                            </Button>
                          </DialogTrigger>
                          {editItem && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>编辑项</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-key"
                                    className="text-right text-white"
                                  >
                                    键
                                  </Label>
                                  <Input
                                    id="edit-key"
                                    value={editItem.key}
                                    className="col-span-3 bg-gray-700 text-white"
                                    onChange={(e) =>
                                      setEditItem({
                                        ...editItem,
                                        key: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-value"
                                    className="text-right text-white"
                                  >
                                    值
                                  </Label>
                                  <Input
                                    id="edit-value"
                                    value={editItem.value}
                                    className="col-span-3 bg-gray-700 text-white"
                                    onChange={(e) =>
                                      setEditItem({
                                        ...editItem,
                                        value: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-description"
                                    className="text-right text-white"
                                  >
                                    描述
                                  </Label>
                                  <Input
                                    id="edit-description"
                                    value={editItem.description || ""}
                                    className="col-span-3 bg-gray-700 text-white"
                                    onChange={(e) =>
                                      setEditItem({
                                        ...editItem,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-tags"
                                    className="text-right text-white"
                                  >
                                    标签
                                  </Label>
                                  <Input
                                    id="edit-tags"
                                    value={editItem.tags?.join(", ") || ""}
                                    className="col-span-3 bg-gray-700 text-white"
                                    onChange={(e) =>
                                      setEditItem({
                                        ...editItem,
                                        tags: e.target.value
                                          .split(",")
                                          .map((tag) => tag.trim()),
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-encrypted"
                                    className="text-right text-white"
                                  >
                                    加密
                                  </Label>
                                  <Checkbox
                                    id="edit-encrypted"
                                    checked={editItem.encrypted}
                                    onCheckedChange={(checked) =>
                                      setEditItem({
                                        ...editItem,
                                        encrypted: checked as boolean,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button onClick={handleUpdateItem}>
                                  更新项
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditItem(null)}
                                >
                                  取消
                                </Button>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button
                          variant="destructive"
                          onClick={() => deleteItem(item.key)}
                        >
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex space-x-2">
              <Button
                onClick={handleDeleteSelected}
                variant="destructive"
                disabled={!items.some((i: StorageItem) => i.selected)}
              >
                删除选中项
              </Button>
              <Button
                onClick={handleExport}
                disabled={!items.some((i: StorageItem) => i.selected)}
              >
                导出选中项
              </Button>
              <Button onClick={() => fileInputRef.current?.click()}>
                导入项
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                style={{ display: "none" }}
              />
            </div>
            <Button
              onClick={() => setBulkEditMode(!bulkEditMode)}
              variant="outline"
              disabled={!items.some((i: StorageItem) => i.selected)}
            >
              批量编辑
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
