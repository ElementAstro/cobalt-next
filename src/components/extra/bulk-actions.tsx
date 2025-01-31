import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Download, FileJson } from 'lucide-react';

interface BulkActionsProps {
  onImport: (apps: any[]) => void;
  onExport: () => void;
}

export function BulkActions({ onImport, onExport }: BulkActionsProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const apps = JSON.parse(text);
      onImport(apps);
      setImportDialogOpen(false);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导入应用</DialogTitle>
            <DialogDescription>
              选择一个JSON文件导入应用配置
            </DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
          />
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        导出
      </Button>
    </div>
  );
}
