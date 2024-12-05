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

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const TagManager: React.FC<TagManagerProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [tags, setTags] = useState(["Important", "Work", "Personal"]);
  const [newTag, setNewTag] = useState("");

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } p-6 rounded-lg max-w-md w-full mx-4 md:mx-0`}
            >
              <DialogContent>
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle className="text-2xl font-bold">
                    Manage Tags
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <DialogDescription className="space-y-4">
                  <div>
                    <Label className="block mb-2">Add New Tag</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add new tag"
                        className={`flex-grow ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />
                      <Button
                        onClick={handleAddTag}
                        className={`${
                          theme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className={`flex items-center justify-between p-2 rounded ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <TagIcon className="w-4 h-4" />
                          <span>{tag}</span>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveTag(tag)}
                          className={`p-1 rounded ${
                            theme === "dark"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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
