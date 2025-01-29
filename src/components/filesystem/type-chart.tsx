import React, { useMemo } from "react";
import {
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  Folder,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File as FileType, FileSystemItem } from "@/types/filesystem";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TypeChartProps {
  files: FileSystemItem[];
  onTypeSelect: (types: string[]) => void; // 修改为数组
  selectedTypes: string[]; // 修改为数组
}

type TypeCount = {
  type: string;
  count: number;
  icon: React.ReactNode;
  color: string;
};

export const TypeChart: React.FC<TypeChartProps> = ({ 
  files, 
  onTypeSelect,
  selectedTypes 
}) => {
  const typeStats = useMemo(() => {
    const stats = files.reduce((acc, file) => {
      const type = 'files' in file ? 'folder' : (file as FileType).type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeConfigs: TypeCount[] = [
      {
        type: "folder",
        count: stats.folder || 0,
        icon: <Folder className="w-4 h-4" />,
        color: "text-blue-500",
      },
      {
        type: "image",
        count: stats.image || 0,
        icon: <Image className="w-4 h-4" />,
        color: "text-green-500",
      },
      {
        type: "video",
        count: stats.video || 0,
        icon: <Video className="w-4 h-4" />,
        color: "text-red-500",
      },
      {
        type: "document",
        count: stats.document || 0,
        icon: <FileText className="w-4 h-4" />,
        color: "text-yellow-500",
      },
      {
        type: "audio",
        count: stats.audio || 0,
        icon: <Music className="w-4 h-4" />,
        color: "text-purple-500",
      },
      {
        type: "code",
        count: stats.code || 0,
        icon: <Code className="w-4 h-4" />,
        color: "text-pink-500",
      },
      {
        type: "archive",
        count: stats.archive || 0,
        icon: <Archive className="w-4 h-4" />,
        color: "text-indigo-500",
      },
      {
        type: "unknown",
        count: stats.unknown || 0,
        icon: <File className="w-4 h-4" />,
        color: "text-gray-500",
      },
    ];

    return typeConfigs.filter((type) => type.count > 0);
  }, [files]);

  const totalFiles = useMemo(() => {
    return typeStats.reduce((sum, type) => sum + type.count, 0);
  }, [typeStats]);

  const handleTypeClick = (type: string) => {
    if (selectedTypes.includes(type)) {
      // 如果已选中则移除
      onTypeSelect(selectedTypes.filter(t => t !== type));
    } else {
      // 如果未选中则添加
      onTypeSelect([...selectedTypes, type]);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTypeSelect([]);
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-100">文件类型统计</CardTitle>
          {selectedTypes.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                已选择 {selectedTypes.length} 种类型
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-100"
              >
                清除选择
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-gray-400">
          共 {totalFiles} 个项目
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {typeStats.map(({ type, count, icon, color }) => (
            <div
              key={type}
              onClick={() => handleTypeClick(type)}
              className={cn(
                "flex items-center justify-between p-2 rounded transition-colors cursor-pointer",
                selectedTypes.includes(type)
                  ? "bg-gray-700/70 ring-2 ring-blue-500/50" 
                  : "bg-gray-800/50 hover:bg-gray-700/50",
                "group"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  color,
                  "transition-transform group-hover:scale-110"
                )}>
                  {icon}
                </div>
                <span className="text-sm text-gray-300 capitalize">
                  {type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">
                  {count}
                </span>
                {selectedTypes.includes(type) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-2 h-2 rounded-full bg-blue-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
