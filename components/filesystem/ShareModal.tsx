// share-modal.tsx
import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useShareModalStore } from "@/lib/store/filesystem";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { permissions, setPermissions } = useShareModalStore();
  const [shareLink, setShareLink] = useState("https://example.com/shared-file");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-gray-800 text-white p-6 rounded-lg max-w-md w-full mx-4 sm:mx-0`}
            >
              <DialogContent>
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle className="text-2xl font-bold">
                    分享文件
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <DialogDescription className="space-y-4">
                  <div>
                    <Label className="block mb-2">分享链接</Label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={shareLink}
                        readOnly
                        className={`flex-grow rounded-l bg-gray-700`}
                      />
                      <Button
                        onClick={handleCopy}
                        className={`rounded-r bg-blue-600 hover:bg-blue-700`}
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="block mb-2">权限</Label>
                    <Select
                      value={permissions}
                      onValueChange={(value) =>
                        setPermissions(value as "view" | "edit" | "full")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择权限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">仅查看</SelectItem>
                        <SelectItem value="edit">编辑</SelectItem>
                        <SelectItem value="full">完全访问</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogDescription>
                <Button
                  onClick={onClose}
                  className={`w-full mt-4 bg-blue-600 hover:bg-blue-700`}
                >
                  完成
                </Button>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
