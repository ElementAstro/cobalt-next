import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const FileUpload: React.FC<FileUploadProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const methods = useForm();

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (data: any) => {
    // Handle file upload logic here
    console.log("Uploading files:", files);
    onClose();
  };

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
                <Label className="text-2xl font-bold">Upload Files</Label>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-700 transition duration-200"
                >
                  <X className="w-6 h-6" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <FormItem>
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center ${
                          dragActive
                            ? "border-blue-500"
                            : theme === "dark"
                            ? "border-gray-600"
                            : "border-gray-300"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Input
                          type="file"
                          multiple
                          onChange={handleChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-semibold">
                            Drag and drop files here, or click to select files
                          </p>
                        </label>
                      </div>
                    </FormItem>
                    {files.length > 0 && (
                      <FormItem>
                        <FormLabel>Selected Files:</FormLabel>
                        <ul className="list-disc pl-5">
                          {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </FormItem>
                    )}
                    <Button type="submit" variant="default" className="w-full">
                      Upload
                    </Button>
                  </form>
                </FormProvider>
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
