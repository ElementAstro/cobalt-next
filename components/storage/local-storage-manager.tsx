"use client";

import { useState, useEffect, useRef } from "react";
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
      title: "Item Added",
      description: `Item "${newItem.key}" has been added successfully.`,
    });
  };

  const updateItem = () => {
    if (editItem) {
      localStorage.setItem(editItem.key, editItem.value);
      setEditItem(null);
      loadItems();
      toast({
        title: "Item Updated",
        description: `Item "${editItem.key}" has been updated successfully.`,
      });
    }
  };

  const deleteItem = (key: string) => {
    localStorage.removeItem(key);
    loadItems();
    toast({
      title: "Item Deleted",
      description: `Item "${key}" has been deleted successfully.`,
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
      title: "Items Deleted",
      description: "Selected items have been deleted successfully.",
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
      title: "Items Exported",
      description: `${selectedItems.length} items have been exported successfully.`,
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
            title: "Items Imported",
            description: `${items.length} items have been imported successfully.`,
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          toast({
            title: "Import Error",
            description:
              "There was an error importing the items. Please check the file format.",
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">LocalStorage Manager</h2>
      <div className="flex space-x-2">
        <Input
          placeholder="Item Key"
          value={newItem.key}
          onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
          aria-label="Item Key"
        />
        <Input
          placeholder="Item Value"
          value={newItem.value}
          onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
          aria-label="Item Value"
        />
        <Button onClick={addItem}>Add Item</Button>
      </div>
      <Input
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        aria-label="Search items"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all">Select All</label>
        </div>
        <div className="space-x-2">
          <Button
            onClick={deleteSelected}
            variant="destructive"
            disabled={!items.some((i) => i.selected)}
          >
            Delete Selected
          </Button>
          <Button
            onClick={exportItems}
            disabled={!items.some((i) => i.selected)}
          >
            Export Selected
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            Import Items
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importItems}
            accept=".json"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.key}>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setEditItem(item)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-key" className="text-right">
                            Key
                          </Label>
                          <Input
                            id="edit-key"
                            value={editItem?.key}
                            className="col-span-3"
                            onChange={(e) =>
                              setEditItem({ ...editItem!, key: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-value" className="text-right">
                            Value
                          </Label>
                          <Input
                            id="edit-value"
                            value={editItem?.value}
                            className="col-span-3"
                            onChange={(e) =>
                              setEditItem({
                                ...editItem!,
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button onClick={updateItem}>Update Item</Button>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => deleteItem(item.key)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
