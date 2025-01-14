"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag, X, Save, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLogStore } from "@/store/useLogStore";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LogUploadDialog: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openTagSuggestions, setOpenTagSuggestions] = useState(false);

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

  const allTags = Array.from(
    new Set(logs.flatMap((log) => log.tags || []).filter(Boolean))
  );

  const handleSave = async () => {
    if (!selectedLogForNote) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedLogs = logs.map((log) =>
        log.id === selectedLogForNote.id
          ? {
              ...log,
              note: newNote || log.note,
              tags: [...new Set([...(log.tags || []), newTag])].filter(Boolean),
            }
          : log
      );

      // Simulate async operation with progress
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          toast({
            title: "保存中...",
            description: "正在保存您的更改",
            duration: 1000,
          });
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
          resolve(null);
        }, 1500);
      });

      setLogs(updatedLogs);
      setFilteredLogs(updatedLogs);
      setNewNote("");
      setNewTag("");
      setSelectedLogForNote(null);

      toast({
        title: "保存成功",
        description: "您的备注和标签已成功保存",
        duration: 2000,
      });
    } catch (error) {
      setError("保存备注和标签时出错");
      toast({
        title: "错误",
        description: "保存备注和标签时出错",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const existingTags = selectedLogForNote?.tags || [];

  const dialogVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };

  return (
    <AnimatePresence mode="wait">
      {selectedLogForNote && (
        <Dialog open={true} onOpenChange={() => setSelectedLogForNote(null)}>
          <DialogContent className="dark:bg-gray-800/95 backdrop-blur-sm">
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader>
                <div className="flex items-center space-x-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Tag className="h-5 w-5 text-blue-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DialogTitle>添加备注和标签</DialogTitle>
                  </motion.div>
                </div>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid gap-4 py-4"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-md"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium dark:text-gray-300">
                    现有标签
                  </Label>
                  <motion.div className="flex flex-wrap gap-2" layout>
                    {existingTags.map((tag, index) => (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Badge variant="secondary" className="relative">
                          {tag}
                          <Button
                            onClick={() => {
                              const updatedTags = existingTags.filter(
                                (t) => t !== tag
                              );
                              const updatedLogs = logs.map((log) =>
                                log.id === selectedLogForNote.id
                                  ? { ...log, tags: updatedTags }
                                  : log
                              );
                              setLogs(updatedLogs);
                              setFilteredLogs(updatedLogs);
                            }}
                            className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500/20 hover:bg-red-500/30"
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="note"
                    className="text-sm font-medium dark:text-gray-300"
                  >
                    备注
                  </Label>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Textarea
                      id="note"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="dark:bg-gray-700/50 dark:text-gray-200 min-h-[150px] resize-y"
                      placeholder="添加备注..."
                    />
                  </motion.div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="tag"
                    className="text-sm font-medium dark:text-gray-300"
                  >
                    新标签
                  </Label>
                  <Popover
                    open={openTagSuggestions}
                    onOpenChange={setOpenTagSuggestions}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTagSuggestions}
                        className="w-full justify-between dark:bg-gray-700/50 dark:text-gray-200"
                      >
                        {newTag || "选择或输入新标签..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandGroup>
                          {allTags.map((tag) => (
                            <CommandItem
                              key={tag}
                              value={tag}
                              onSelect={(currentValue) => {
                                setNewTag(currentValue);
                                setOpenTagSuggestions(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newTag === tag ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {tag}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>

              <DialogFooter className="gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedLogForNote(null)}
                  className="dark:text-gray-300"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  取消
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 dark:bg-blue-500 dark:text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  {isLoading ? "保存中..." : "保存"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LogUploadDialog;
