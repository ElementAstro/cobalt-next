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

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [shareLink, setShareLink] = useState("https://example.com/shared-file");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
                    Share File
                  </DialogTitle>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <DialogDescription className="space-y-4">
                  <div>
                    <Label className="block mb-2">Share Link</Label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={shareLink}
                        readOnly
                        className={`flex-grow rounded-l ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />
                      <Button
                        onClick={handleCopy}
                        className={`rounded-r ${
                          theme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
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
                    <Label className="block mb-2">Permissions</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View only</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="full">Full access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogDescription>
                <Button
                  onClick={onClose}
                  className={`w-full mt-4 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Done
                </Button>
              </DialogContent>
            </motion.div>
          </DialogOverlay>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
