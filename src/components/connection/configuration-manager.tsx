"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Save, FileText, XCircle } from "lucide-react";

interface ConfigurationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (config: any) => void;
}

export function ConfigurationManager({
  isOpen,
  onClose,
  onImport,
}: ConfigurationManagerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          onImport(config);
          onClose();
        } catch (error) {
          console.error("Invalid configuration file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>配置管理器</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2">
              导入配置文件
            </Label>
            <div className="flex space-x-2 items-center">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => selectedFile && handleFileChange}
              >
                <Upload className="w-4 h-4 mr-2" />
                导入
              </Button>
            </div>
          </div>
          {selectedFile && (
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-green-500" />
              <span className="text-sm">{selectedFile.name}</span>
              <Button variant="ghost" onClick={() => setSelectedFile(null)}>
                <XCircle className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
