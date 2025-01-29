export type FileType =
  | "folder"
  | "image"
  | "video"
  | "document"
  | "code"
  | "audio"
  | "archive"
  | "unknown";

// 添加基础接口
export interface FileSystemItem {
  id: string | number;
  name: string;
  size: number;
  lastModified: Date;
  createdAt: Date;
  owner: string;
  permissions: string;
  path: string;
  thumbnail?: string;
  modified: string;
  itemCount?: number;
  thumbnailUrl?: string;
  url?: string;
  isFavorite?: boolean;
  tags?: string[];
  encrypted?: boolean;
  rawFile?: File;
}

// 修改 File 接口继承基础接口
export interface File extends FileSystemItem {
  type: FileType;
  content?: string;
  language?: string;
  versions?: {
    id: string;
    createdAt: Date;
    size: number;
  }[];
}

// 修改 Folder 接口继承基础接口
export interface Folder extends FileSystemItem {
  files: (File | Folder)[];
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

export interface ExtendedFile extends File {
  url?: string;
  content?: string;
  language?: string;
}

export interface Version {
  id: string | number;
  fileId: string;
  number: number;
  createdAt: Date;
  author: string;
  comment: string;
  size: number;
  hash: string;
  changes: {
    additions: number;
    deletions: number;
  };
  tags?: string[];
  status?: "active" | "archived";
  restorePoint?: boolean;
}

export interface VersionDiff {
  additions: number;
  deletions: number;
  changes: number;
  chunks: Array<{
    type: "added" | "removed" | "modified";
    content: string;
    lineNumbers: {
      old: {
        start: number;
        end: number;
      };
      new: {
        start: number;
        end: number;
      };
    };
  }>;
}
