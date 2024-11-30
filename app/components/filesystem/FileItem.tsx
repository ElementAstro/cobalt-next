import React from "react";
import { File, Folder } from "lucide-react";

export interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number | null;
  modifiedAt: string;
}

interface FileItemProps {
  file: FileItem;
  onClick: () => void;
}

function formatDistanceToNow(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} 年前`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} 个月前`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} 天前`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} 小时前`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} 分钟前`;

  return `${Math.floor(seconds)} 秒前`;
}

export function FileItem({ file, onClick }: FileItemProps) {
  return (
    <div
      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded"
      onClick={onClick}
    >
      {file.isDirectory ? (
        <Folder className="w-6 h-6 mr-2 text-yellow-500" />
      ) : (
        <File className="w-6 h-6 mr-2 text-blue-500" />
      )}
      <span className="flex-grow">{file.name}</span>
      {!file.isDirectory && (
        <span className="text-sm text-gray-500 mr-4">
          {file.size !== null ? `${file.size} bytes` : "N/A"}
        </span>
      )}
      <span className="text-sm text-gray-500">
        {formatDistanceToNow(new Date(file.modifiedAt))}
      </span>
    </div>
  );
}
