export type FileType =
  | "folder"
  | "image"
  | "video"
  | "document"
  | "code"
  | "audio"
  | "archive"
  | "unknown";

export interface File {
  id: string | number;
  name: string;
  type: FileType;
  size: number;
  lastModified: Date;
  createdAt: Date;
  owner: string;
  permissions: string;
  content?: string; // For preview purposes
  language?: string; // For code files
  path: string;
  thumbnail?: string;
  modified: string;
  versions?: {
    id: string;
    createdAt: Date;
    size: number;
  }[];
  tags?: string[];
  isFavorite?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  files: (File | Folder)[];
  createdAt: Date;
  lastModified: Date;
  owner: string;
  permissions: string;
  path: string;
  modified: string;
  size?: number;
  itemCount?: number;
  parentId?: string;
}

export type CustomizationOptionsData = {
  gridSize: "small" | "medium" | "large";
  showHiddenFiles: boolean;
  listView: "comfortable";
  sortBy: "name" | "size" | "date";
  sortDirection: "asc" | "desc";
  thumbnailQuality: "low" | "medium" | "high";
  autoBackup: boolean;
  defaultView: "grid" | "list";
};

export type CustomizationOptions = {
  isOpen: boolean;
  onClose: () => void;
  options: CustomizationOptionsData;
  setOptions: (options: CustomizationOptionsData) => void;
};

export type FileOperation =
  | "open"
  | "preview"
  | "download"
  | "rename"
  | "delete"
  | "copy"
  | "cut"
  | "paste"
  | "share"
  | "properties"
  | "versionHistory"
  | "manageTags"
  | "compress"
  | "encrypt";

// 添加 API 响应类型
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}
