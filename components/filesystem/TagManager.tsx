// tag-manager.tsx
import React, { useState } from "react";
import { X, Plus, TagIcon } from "lucide-react";
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

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ isOpen, onClose }) => {
  const { tags, addTag, removeTag } = useTagManagerStore();
  const [newTag, setNewTag] = useState("");

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
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 text-white rounded-lg shadow-lg max-w-md w-full mx-4"
            >
              <DialogContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle className="text-xl font-semibold">
                    管理标签
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <DialogDescription className="space-y-4">
                  <div>
                    <Label className="block mb-2">添加新标签</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="输入标签名称"
                        className="flex-grow bg-gray-700 text-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddTag}
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {tags.map((tag) => (
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
                    ))}
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