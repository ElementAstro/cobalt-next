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
import { toast } from "@/hooks/use-toast";
import { useLocalStorageStore } from "@/lib/store/storage/localstorage";

interface StorageItem {
  key: string;
  value: string;
  selected?: boolean;
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

  const [newItem, setNewItem] = useState<StorageItem>({ key: "", value: "" });
  const [editItem, setEditItem] = useState<StorageItem | null>(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setNewItem({ key: "", value: "" });
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

  const filteredItems = items.filter(
    (item) =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`dark bg-gray-900 min-h-screen ${isLandscape ? "p-2" : "p-6"}`}
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
          <Input
            placeholder="项键名"
            value={newItem.key}
            onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="项值"
            value={newItem.value}
            onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
            className="w-full"
          />
          <Button onClick={handleAddItem} className="w-full">
            添加项
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center"
        >
          <Input
            placeholder="搜索项..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search items"
            className="w-1/2"
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
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end space-x-2"
        >
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            disabled={!items.some((i) => i.selected)}
          >
            删除选中项
          </Button>
          <Button
            onClick={handleExport}
            disabled={!items.some((i) => i.selected)}
          >
            导出选中项
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>导入项</Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            style={{ display: "none" }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Table className="text-white">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">选择</TableHead>
                <TableHead>键</TableHead>
                <TableHead>值</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item, index) => (
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
                    />
                  </TableCell>
                  <TableCell>{item.key}</TableCell>
                  <TableCell>{item.value}</TableCell>
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
                            </div>
                            <Button onClick={handleUpdateItem}>更新项</Button>
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
      </Card>
    </motion.div>
  );
}
