import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { File } from "./types";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FilePropertiesProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const FileProperties: React.FC<FilePropertiesProps> = ({
  file,
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full mx-4 sm:mx-0`}
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <Label className="text-2xl font-bold">File Properties</Label>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-700 transition duration-200"
                >
                  <X className="w-6 h-6" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>
                  <strong>Name:</strong> {file.name}
                </Label>
                <Label>
                  <strong>Type:</strong> {file.type}
                </Label>
                <Label>
                  <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                </Label>
                <Label>
                  <strong>Created:</strong>{" "}
                  {format(file.createdAt, "yyyy-MM-dd HH:mm:ss")}
                </Label>
                <Label>
                  <strong>Modified:</strong>{" "}
                  {format(file.lastModified, "yyyy-MM-dd HH:mm:ss")}
                </Label>
                <Label>
                  <strong>Owner:</strong> {file.owner}
                </Label>
                <Label>
                  <strong>Permissions:</strong> {file.permissions}
                </Label>
                <Label>
                  <strong>Path:</strong> {file.path}
                </Label>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="default" onClick={onClose}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
