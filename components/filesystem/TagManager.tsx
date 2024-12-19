// tag-manager.tsx
import React, { useState } from "react";
import { X, Plus, TagIcon, Search, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTagManagerStore } from "@/lib/store/filesystem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ isOpen, onClose }) => {
  const { tags, addTag, removeTag } = useTagManagerStore();
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const colors = [
    { value: "#3B82F6", label: "蓝色" },
    { value: "#10B981", label: "绿色" },
    { value: "#F59E0B", label: "黄色" },
    { value: "#EF4444", label: "红色" },
    { value: "#8B5CF6", label: "紫色" },
  ];

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/95 text-white rounded-xl shadow-lg max-w-md w-[95%] mx-4"
            >
              <DialogContent className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                  <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    标签管理
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <DialogDescription className="space-y-6">
                  <div className="space-y-4">
                    <Label>新建标签</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="输入标签名称"
                        className="flex-grow bg-gray-700/50"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddTag();
                          }
                        }}
                      />
                      <Select
                        value={selectedColor}
                        onValueChange={setSelectedColor}
                      >
                        <SelectTrigger className="w-24 bg-gray-700/50">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: selectedColor }}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color.value }}
                                />
                                <span>{color.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAddTag}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>搜索标签</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索标签..."
                        className="pl-10 bg-gray-700/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredTags.length === 0 ? (
                      <div className="text-center text-gray-400 py-4">
                        没有找到标签
                      </div>
                    ) : (
                      filteredTags.map((tag) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-2 rounded bg-gray-700"
                        >
                          <div className="flex items-center space-x-2">
                            <TagIcon className="w-4 h-4" />
                            <span>{tag}</span>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() => removeTag(tag)}
                            className="p-1 rounded bg-red-600 hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </DialogDescription>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
