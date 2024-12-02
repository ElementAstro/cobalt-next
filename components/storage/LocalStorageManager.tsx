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

interface StorageItem {
  key: string;
  value: string;
  selected?: boolean;
}

interface LocalStorageManagerProps {
  isLandscape: boolean;
}

export function LocalStorageManager({ isLandscape }: LocalStorageManagerProps) {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [newItem, setNewItem] = useState<StorageItem>({ key: "", value: "" });
  const [editItem, setEditItem] = useState<StorageItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const allItems: StorageItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allItems.push({
          key,
          value: localStorage.getItem(key) || "",
          selected: false,
        });
      }
    }
    setItems(allItems);
  };

  const addItem = () => {
    localStorage.setItem(newItem.key, newItem.value);
    setNewItem({ key: "", value: "" });
    loadItems();
    toast({
      title: "添加成功",
      description: `项 "${newItem.key}" 已成功添加。`,
    });
  };

  const updateItem = () => {
    if (editItem) {
      localStorage.setItem(editItem.key, editItem.value);
      setEditItem(null);
      loadItems();
      toast({
        title: "更新成功",
        description: `项 "${editItem.key}" 已成功更新。`,
      });
    }
  };

  const deleteItem = (key: string) => {
    localStorage.removeItem(key);
    loadItems();
    toast({
      title: "删除成功",
      description: `项 "${key}" 已成功删除。`,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setItems(items.map((item) => ({ ...item, selected: checked })));
  };

  const handleSelect = (key: string, checked: boolean) => {
    setItems(
      items.map((item) =>
        item.key === key ? { ...item, selected: checked } : item
      )
    );
  };

  const deleteSelected = () => {
    items.forEach((item) => {
      if (item.selected) {
        localStorage.removeItem(item.key);
      }
    });
    loadItems();
    setSelectAll(false);
    toast({
      title: "批量删除成功",
      description: "选中的项已成功删除。",
    });
  };

  const exportItems = () => {
    const selectedItems = items.filter((item) => item.selected);
    const itemsData = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([itemsData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "localstorage_items.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "导出成功",
      description: `${selectedItems.length} 个项已成功导出。`,
    });
  };

  const importItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (typeof contents === "string") {
        try {
          const items = JSON.parse(contents);
          items.forEach((item: StorageItem) => {
            localStorage.setItem(item.key, item.value);
          });
          loadItems();
          toast({
            title: "导入成功",
            description: `${items.length} 个项已成功导入。`,
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

  const filteredItems = items.filter(
    (item) =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dark bg-gray-900 min-h-screen p-6"
    >
      <Card className="p-6 space-y-6">
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-white"
        >
          LocalStorage 管理器
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex space-x-4"
        >
          <Input
            placeholder="项键名"
            value={newItem.key}
            onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
            aria-label="Item Key"
          />
          <Input
            placeholder="项值"
            value={newItem.value}
            onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
            aria-label="Item Value"
          />
          <Button onClick={addItem}>添加项</Button>
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
              checked={selectAll}
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
            onClick={deleteSelected}
            variant="destructive"
            disabled={!items.some((i) => i.selected)}
          >
            删除选中项
          </Button>
          <Button
            onClick={exportItems}
            disabled={!items.some((i) => i.selected)}
          >
            导出选中项
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>导入项</Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importItems}
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
                                  className="text-right"
                                >
                                  键
                                </Label>
                                <Input
                                  id="edit-key"
                                  value={editItem.key}
                                  className="col-span-3"
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
                                  className="text-right"
                                >
                                  值
                                </Label>
                                <Input
                                  id="edit-value"
                                  value={editItem.value}
                                  className="col-span-3"
                                  onChange={(e) =>
                                    setEditItem({
                                      ...editItem,
                                      value: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <Button onClick={updateItem}>更新项</Button>
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
