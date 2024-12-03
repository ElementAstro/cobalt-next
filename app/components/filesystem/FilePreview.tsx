"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

interface FileItem {
  name: string;
  // Add other properties as needed
}

interface FilePreviewProps {
  file: FileItem;
  path: string;
  onFileOperation: (
    operation: string,
    file: FileItem,
    content?: string
  ) => Promise<void>;
}

export function FilePreview({ file, path, onFileOperation }: FilePreviewProps) {
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("current");

  useEffect(() => {
    fetchFileContent();
    fetchVersions();
  }, [file, selectedVersion]);

  const fetchFileContent = async () => {
    try {
      const response = await fetch(
        `/api/fs?action=read&path=${encodeURIComponent(
          `${path}${file.name}`
        )}&version=${selectedVersion}`
      );
      if (!response.ok) throw new Error("Failed to fetch file content");
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await fetch(
        `/api/fs?action=versions&path=${encodeURIComponent(
          `${path}${file.name}`
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch file versions");
      const data = await response.json();
      setVersions(data.versions);
    } catch (error) {
      console.error("Error fetching file versions:", error);
    }
  };

  const handleSave = async () => {
    await onFileOperation("update", file, content);
    setIsEditing(false);
  };

  const getLanguage = () => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col p-4 bg-gray-900 text-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-2">{file.name}</h2>
      <div className="mb-2 flex justify-between items-center">
        <Select value={selectedVersion} onValueChange={setSelectedVersion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current</SelectItem>
            {versions.map((version) => (
              <SelectItem key={version} value={version}>
                {new Date(parseInt(version)).toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            disabled={selectedVersion !== "current"}
          >
            Edit
          </Button>
        )}
      </div>
      <Editor
        height="70vh"
        defaultLanguage={getLanguage()}
        value={content}
        onChange={(value) => setContent(value || "")}
        options={{
          readOnly: !isEditing || selectedVersion !== "current",
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          theme: "vs-dark",
        }}
      />
    </motion.div>
  );
}
