"use client";

import { useState, useEffect } from "react";
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
import { Settings } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "../modal/ConfirmDialog";
import { useSessionStorageStore } from "@/lib/store/storage/session";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSessionStorageStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-2">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="theme" className="text-right text-sm">
                Theme
              </Label>
              <Select
                value={localSettings.theme}
                onValueChange={(value: "light" | "dark") =>
                  setLocalSettings({ ...localSettings, theme: value })
                }
              >
                <SelectTrigger className="col-span-3 h-8">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="itemsPerPage" className="text-right text-sm">
                Items Per Page
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="showValuePreview" className="text-right text-sm">
                Show Preview
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
            <Button type="submit" size="sm">
              Save changes
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-2 py-2">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="key" className="text-right text-sm">
                Key
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
                Value
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
              Save
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
  const [currentItem, setCurrentItem] = useState<{
    key: string;
    value: string;
  } | null>(null);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const newItems = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        newItems.push({ key, value: sessionStorage.getItem(key) || "" });
      }
    }
    setItems(newItems);
  }, [setItems]);

  const paginatedItems = items.slice(
    (currentPage - 1) * settings.itemsPerPage,
    currentPage * settings.itemsPerPage
  );

  const totalPages = Math.ceil(items.length / settings.itemsPerPage);

  return (
    <div
      className={`container mx-auto p-2 ${
        settings.theme === "light" ? "" : "dark"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">SessionStorage Editor</h1>
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            Add Item
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>
        </div>
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {paginatedItems.map(({ key, value }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCurrentItem({ key, value });
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
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
              <TableHead>Key</TableHead>
              {settings.showValuePreview && (
                <TableHead>Value Preview</TableHead>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedItems.map(({ key, value }) => (
                <motion.tr
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
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
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setCurrentItem({ key, value });
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      )}
      <div className="mt-2 flex justify-center space-x-1">
        <Button
          size="sm"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-1 px-2 bg-secondary text-secondary-foreground rounded text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <StorageItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addItem}
        title="Add Item"
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
        title="Edit Item"
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
        title="Delete Item"
        message="Are you sure you want to delete this item?"
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
