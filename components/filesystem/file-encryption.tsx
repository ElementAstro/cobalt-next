import React, { useState } from "react";
import { X, Lock, Unlock, FileUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FileEncryptionProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const FileEncryption: React.FC<FileEncryptionProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleEncryptDecrypt = () => {
    if (!selectedFile || !password) return;

    setIsProcessing(true);
    // Implement actual encryption/decryption logic here
    setTimeout(() => {
      console.log(
        `${isEncrypting ? "Encrypting" : "Decrypting"} file: ${
          selectedFile.name
        } with password: ${password}`
      );
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <DialogContent
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full mx-4`}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">
                    {isEncrypting ? "Encrypt" : "Decrypt"} File
                  </span>
                  <DialogClose asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <Label className="block mb-2 font-medium">Select File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                      theme === "dark"
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
              {selectedFile && (
                <p className="mb-4">Selected file: {selectedFile.name}</p>
              )}
              <div className="mb-4">
                <Label className="block mb-2 font-medium" htmlFor="password">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 rounded ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-4">
                <Label className="inline-flex items-center">
                  <Checkbox
                    checked={isEncrypting}
                    onCheckedChange={() => setIsEncrypting(!isEncrypting)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">Encrypt</span>
                </Label>
              </div>
              <Button
                onClick={handleEncryptDecrypt}
                disabled={!selectedFile || !password || isProcessing}
                className={`w-full py-2 px-4 ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-lg transition duration-200 ${
                  !selectedFile || !password || isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    {isEncrypting ? (
                      <Lock className="w-5 h-5 inline-block mr-2" />
                    ) : (
                      <Unlock className="w-5 h-5 inline-block mr-2" />
                    )}
                    {isEncrypting ? "Encrypt File" : "Decrypt File"}
                  </>
                )}
              </Button>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
