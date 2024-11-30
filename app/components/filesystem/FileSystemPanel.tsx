"use client";

import { useState, useEffect } from "react";
import { FileItem } from "./FileItem";
import { NewItemForm } from "./NewItemForm";
import { FilePreview } from "./FilePreview";
import { FileUpload } from "./FileUpload";
import { SearchBar } from "./SearchBar";
import { BreadcrumbComponent as Breadcrumb } from "./Breadcrumb";
import { BatchOperations } from "./BatchOperations";

interface FileSystemItem {
  name: string;
  isDirectory: boolean;
}

export default function FileSystemPanel({
  initialPath = "/",
}: {
  initialPath?: string;
}) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [contents, setContents] = useState<FileSystemItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchDirectoryContents(currentPath);
  }, [currentPath]);

  const fetchDirectoryContents = async (path: string) => {
    try {
      const response = await fetch(
        `/api/directory?path=${encodeURIComponent(path)}`
      );
      if (!response.ok) throw new Error("Failed to fetch directory contents");
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Error fetching directory contents:", error);
    }
  };

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const handleNavigate = (newPath: string) => {
    setCurrentPath(newPath);
    setSelectedFile(null);
    setSelectedItems([]);
  };

  const handleItemSelect = (itemName: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems([...selectedItems, itemName]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== itemName));
    }
  };

  const handleMove = async (
    item: { name: string; isDirectory: boolean },
    targetPath: string
  ) => {
    //This function is not used in the updated code, but keeping it here for potential future use.
    // await moveItem(currentPath, item.name, targetPath)
    // Refresh the directory contents after move
    await fetchDirectoryContents(currentPath);
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-4">File System Panel</h1>
      <div className="mb-4 flex justify-between items-center">
        <Breadcrumb path={currentPath} onNavigate={handleNavigate} />
        <SearchBar onSearch={() => {}} />{" "}
        {/* TODO: Implement search functionality */}
      </div>
      <div className="mb-4 flex space-x-4">
        <NewItemForm
          path={currentPath}
          onComplete={() => fetchDirectoryContents(currentPath)}
        />
        <FileUpload
          path={currentPath}
          onComplete={() => fetchDirectoryContents(currentPath)}
        />
      </div>
      <BatchOperations
        selectedItems={selectedItems}
        path={currentPath}
        onOperationComplete={() => {
          setSelectedItems([]);
          fetchDirectoryContents(currentPath);
        }}
      />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/2 overflow-y-auto pr-2 space-y-2">
          {contents.map((item) => (
            <FileItem
              key={item.name}
              item={item}
              path={currentPath}
              onSelect={() => handleFileSelect(item.name)}
              onNavigate={handleNavigate}
              isSelected={selectedItems.includes(item.name)}
              onSelectedChange={(isSelected) =>
                handleItemSelect(item.name, isSelected)
              }
              onComplete={() => fetchDirectoryContents(currentPath)}
              onMove={handleMove}
            />
          ))}
        </div>
        <div className="w-1/2 pl-2">
          {selectedFile && (
            <FilePreview path={currentPath} fileName={selectedFile} />
          )}
        </div>
      </div>
    </div>
  );
}
