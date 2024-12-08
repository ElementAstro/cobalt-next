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
  id: string;
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
}

export interface Folder {
  id: string;
  name: string;
  files: (File | Folder)[];
}

export interface CustomizationOptions {
  theme: "light" | "dark";
  gridSize: "small" | "medium" | "large";
  showHiddenFiles: boolean;
  listView: "compact" | "comfortable";
}

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
  | "properties";
