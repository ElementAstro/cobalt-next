// LogUploadDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLogStore } from "@/lib/store/log";
import { uploadLogs } from "@/utils/log-uploader";

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
        // Implement the logic to update the log with the new note and tag
        const updatedLogs = logs.map((log) =>
          log.id === selectedLogForNote.id
            ? {
                ...log,
                note: newNote || log.note,
                tags: [...(log.tags || []), newTag].filter(Boolean),
              }
            : log
        );
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

  return (
    <Dialog
      open={!!selectedLogForNote}
      onOpenChange={() => setSelectedLogForNote(null)}
    >
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>添加备注和标签</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right dark:text-gray-300">
              备注
            </Label>
            <Textarea
              id="note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-right dark:text-gray-300">
              标签
            </Label>
            <Input
              id="tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="dark:bg-blue-600 dark:text-white"
        >
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LogUploadDialog;
