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
import { Upload, Save, FileText, XCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const configSchema = z.object({
  connectionTimeout: z.number().min(1).max(300),
  maxRetries: z.number().min(1).max(10),
  debugMode: z.boolean(),
  // 添加更多配置项验证规则
});

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
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);
    setImportStatus("idle");
    setError(null);

    try {
      const fileContent = await readFileAsText(file);
      const config = JSON.parse(fileContent);
      
      // 验证配置文件
      const validatedConfig = configSchema.parse(config);
      
      onImport(validatedConfig);
      setImportStatus("success");
      toast({
        title: "配置导入成功",
        description: "配置文件已成功导入并验证",
        variant: "default",
      });
      onClose();
    } catch (error) {
      setImportStatus("error");
      if (error instanceof z.ZodError) {
        setError("配置文件格式无效: " + error.errors.map(e => e.message).join(", "));
      } else {
        setError("无法读取或解析配置文件");
      }
      toast({
        title: "配置导入失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("无法读取文件"));
      reader.readAsText(file);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            配置管理器
          </DialogTitle>
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
                disabled={isLoading}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("config-file-input")?.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : importStatus === "success" ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                导入
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-green-500" />
              <span className="text-sm">{selectedFile.name}</span>
              <Button
                variant="ghost"
                onClick={() => setSelectedFile(null)}
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
