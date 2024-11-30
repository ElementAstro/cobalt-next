"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItem } from "@/app/actions/fileSystemActions";

export function NewItemForm({ path }: { path: string }) {
  const [name, setName] = useState("");
  const [isDirectory, setIsDirectory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createItem(path, name, isDirectory);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New item name"
        className="flex-grow"
      />
      <Button type="button" onClick={() => setIsDirectory(!isDirectory)}>
        {isDirectory ? "Folder" : "File"}
      </Button>
      <Button type="submit">Create</Button>
    </form>
  );
}
