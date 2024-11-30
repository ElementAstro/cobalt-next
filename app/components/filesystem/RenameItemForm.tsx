"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renameItem } from "@/app/actions/fileSystemActions";

interface RenameItemFormProps {
  item: { name: string; isDirectory: boolean };
  path: string;
  onCancel: () => void;
}

export function RenameItemForm({ item, path, onCancel }: RenameItemFormProps) {
  const [newName, setNewName] = useState(item.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await renameItem(path, item.name, newName);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">Rename</Button>
      <Button type="button" onClick={onCancel} variant="outline">
        Cancel
      </Button>
    </form>
  );
}
