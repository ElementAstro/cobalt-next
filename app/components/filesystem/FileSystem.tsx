"use client";

import React, { useState, useEffect } from "react";
import { FileItem } from "./FileItem";
import { FileOperations } from "./FileOperations";
import { useMockMode } from "@/hooks/use-mock-mode";
import { BreadcrumbComponent as Breadcrumb } from "./Breadcrumb";
import { FilePreview } from "./FilePreview";
import { ContextMenu } from "./ContextMenu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortAsc, SortDesc } from "lucide-react";
import { toast } from "react-hot-toast";
import { FileUpload } from "./FileUpload";
import { SearchBar } from "./SearchBar";

interface FileSystemProps {
  initialPath?: string;
}

export function FileSystem({ initialPath = "/" }: FileSystemProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "size" | "modifiedAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const { isMockMode, toggleMockMode, mockFileSystem } = useMockMode();

  useEffect(() => {
    fetchFiles();
  }, [currentPath, isMockMode, sortBy, sortOrder]);

  const fetchFiles = async () => {
    let fetchedFiles: FileItem[] = [];
    if (isMockMode) {
      fetchedFiles = mockFileSystem.listFiles(currentPath);
    } else {
      try {
        const response = await fetch(
          `/api/fs?action=list&path=${encodeURIComponent(currentPath)}`
        );
        if (!response.ok) throw new Error("Failed to fetch files");
        fetchedFiles = await response.json();
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to fetch files");
      }
    }

    // Sort files
    fetchedFiles.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * (sortOrder === "asc" ? 1 : -1);
      }
      if (sortBy === "size") {
        return ((a.size || 0) - (b.size || 0)) * (sortOrder === "asc" ? 1 : -1);
      }
      return (
        (new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime()) *
        (sortOrder === "asc" ? 1 : -1)
      );
    });

    setFiles(fetchedFiles);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentPath(`${currentPath}${file.name}/`);
    } else {
      setSelectedFile(file);
    }
  };

  const handleFileOperation = async (
    operation: string,
    file: FileItem,
    content?: string
  ) => {
    if (isMockMode) {
      switch (operation) {
        case "create":
          if (mockFileSystem.fileExists(currentPath, file.name)) {
            toast.error("A file or folder with this name already exists");
            return;
          }
          mockFileSystem.createFile(
            currentPath,
            file.name,
            content || "",
            file.isDirectory
          );
          break;
        case "update":
          mockFileSystem.updateFile(currentPath, file.name, content || "");
          break;
        case "delete":
          mockFileSystem.deleteFile(currentPath, file.name);
          break;
        case "rename":
          if (mockFileSystem.fileExists(currentPath, content || "")) {
            toast.error("A file or folder with this name already exists");
            return;
          }
          mockFileSystem.renameFile(currentPath, file.name, content || "");
          break;
      }
    } else {
      try {
        const response = await fetch("/api/fs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: operation,
            path: `${currentPath}${file.name}`,
            content,
            newName: content, // for rename operation
            isDirectory: file.isDirectory,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to ${operation} file`);
        }
      } catch (error) {
        console.error(`Error ${operation} file:`, error);
        toast.error(`Failed to ${operation} file`);
        return;
      }
    }
    fetchFiles();
    if (operation === "delete" && selectedFile?.name === file.name) {
      setSelectedFile(null);
    }
    toast.success(`File ${operation} successful`);
  };

  const handleSearch = async (query: string) => {
    if (isMockMode) {
      const results = mockFileSystem.searchFiles(currentPath, query);
      setSearchResults(results);
    } else {
      try {
        const response = await fetch(
          `/api/fs?action=search&path=${encodeURIComponent(
            currentPath
          )}&query=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to search files");
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching files:", error);
        toast.error("Failed to search files");
      }
    }
  };

  const handleUpload = async (file: File) => {
    if (isMockMode) {
      mockFileSystem.uploadFile(currentPath, file);
      fetchFiles();
      toast.success("File uploaded successfully");
    } else {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", currentPath);
        const response = await fetch("/api/fs", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to upload file");
        fetchFiles();
        toast.success("File uploaded successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
      }
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Virtual File System</h1>
      <div className="mb-4 flex justify-between items-center">
        <Breadcrumb path={currentPath} onNavigate={setCurrentPath} />
        <Button onClick={toggleMockMode} variant="outline">
          {isMockMode ? "Disable" : "Enable"} Mock Mode
        </Button>
      </div>
      <div className="flex space-x-4 mb-4">
        <SearchBar onSearch={handleSearch} />
        <FileUpload onUpload={handleUpload} />
        <Select
          value={sortBy}
          onValueChange={(value: "name" | "size" | "modifiedAt") =>
            setSortBy(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="size">Size</SelectItem>
            <SelectItem value="modifiedAt">Modified Date</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          variant="outline"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="mr-2 h-4 w-4" />
          ) : (
            <SortDesc className="mr-2 h-4 w-4" />
          )}
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>
      <div className="flex-grow flex overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="file-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-2/3 overflow-y-auto pr-4"
              >
                {(searchResults.length > 0 ? searchResults : files).map(
                  (file, index) => (
                    <Draggable
                      key={file.name}
                      draggableId={file.name}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ContextMenu
                            file={file}
                            onFileOperation={handleFileOperation}
                          >
                            <FileItem
                              file={file}
                              onClick={() => handleFileClick(file)}
                            />
                          </ContextMenu>
                        </div>
                      )}
                    </Draggable>
                  )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="w-1/3 pl-4 border-l">
          {selectedFile ? (
            <FilePreview
              file={selectedFile}
              path={currentPath}
              onFileOperation={handleFileOperation}
            />
          ) : (
            <FileOperations
              onFileOperation={handleFileOperation}
              currentPath={currentPath}
              files={files}
            />
          )}
        </div>
      </div>
    </div>
  );
}
