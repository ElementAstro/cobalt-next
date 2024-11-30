"use client";

import { Button } from "@/components/ui/button";
import { compressItems, deleteItems } from "@/app/actions/fileSystemActions";

interface BatchOperationsProps {
  selectedItems: string[];
  path: string;
  onOperationComplete: () => void;
}

export function BatchOperations({
  selectedItems,
  path,
  onOperationComplete,
}: BatchOperationsProps) {
  const handleCompress = async () => {
    await compressItems(path, selectedItems);
    onOperationComplete();
  };

  const handleDelete = async () => {
    await deleteItems(path, selectedItems);
    onOperationComplete();
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-2 bg-gray-100 rounded flex items-center space-x-2">
      <span>{selectedItems.length} item(s) selected</span>
      <Button onClick={handleCompress}>Compress</Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
