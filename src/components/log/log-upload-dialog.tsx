"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag, X, Save, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLogStore } from "@/store/useLogStore";

const LogUploadDialog: React.FC = () => {
  const {
    selectedLogForNote,
    setSelectedLogForNote,
    logs,
    setLogs,
    setFilteredLogs,
    newNote,
    setNewNote,
    newTag,
    setNewTag,
  } = useLogStore();

  const handleSave = async () => {
    if (selectedLogForNote) {
      try {
        const updatedLogs = logs.map((log) =>
          log.id === selectedLogForNote.id
            ? {
                ...log,
                note: newNote || log.note,
                tags: [...new Set([...(log.tags || []), newTag])].filter(
                  Boolean
                ),
              }
            : log
        );

        // Add animation effect when saving
        await new Promise((resolve) => setTimeout(resolve, 300));

        setLogs(updatedLogs);
        setFilteredLogs(updatedLogs);
        setNewNote("");
        setNewTag("");
        setSelectedLogForNote(null);
      } catch (error) {
        console.error("保存备注和标签时出错:", error);
      }
    }
  };

  const existingTags = selectedLogForNote?.tags || [];

  return (
    <AnimatePresence>
      {selectedLogForNote && (
        <Dialog open={true} onOpenChange={() => setSelectedLogForNote(null)}>
          <DialogContent className="dark:bg-gray-800/95 backdrop-blur-sm">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2"
              >
                <Tag className="h-5 w-5 text-blue-500" />
                <DialogTitle>添加备注和标签</DialogTitle>
              </motion.div>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 py-4"
            >
              <div className="grid gap-2">
                <Label className="text-sm font-medium dark:text-gray-300">
                  现有标签
                </Label>
                <div className="flex flex-wrap gap-2">
                  {existingTags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="note"
                  className="text-sm font-medium dark:text-gray-300"
                >
                  备注
                </Label>
                <Textarea
                  id="note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="dark:bg-gray-700/50 dark:text-gray-200 min-h-[100px]"
                  placeholder="添加备注..."
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="tag"
                  className="text-sm font-medium dark:text-gray-300"
                >
                  新标签
                </Label>
                <Input
                  id="tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="dark:bg-gray-700/50 dark:text-gray-200"
                  placeholder="输入新标签..."
                />
              </div>
            </motion.div>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedLogForNote(null)}
                className="dark:text-gray-300"
              >
                <X className="h-4 w-4 mr-1" />
                取消
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 dark:bg-blue-500 dark:text-white"
              >
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LogUploadDialog;
