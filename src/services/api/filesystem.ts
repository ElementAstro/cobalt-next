import { File, Folder, Version, VersionDiff } from "@/types/filesystem";
import api from "../axios";

export interface FileSystemResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

export const filesystemApi = {
  // 文件操作
  getFiles: (path: string) =>
    api.request<FileSystemResponse<File[]>>({
      url: "/files",
      method: "GET",
      params: { path },
    }),

  uploadFiles: (files: FormData) =>
    api.request<FileSystemResponse<File[]>>({
      url: "/files/upload",
      method: "POST",
      data: files,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (files.get("onProgress")) {
            (files.get("onProgress") as unknown as Function)(percentCompleted);
          }
        }
      },
    }),

  deleteFiles: (fileIds: string[]) =>
    api.request<FileSystemResponse<void>>({
      url: "/files",
      method: "DELETE",
      data: { fileIds },
    }),

  renameFile: (fileId: string, newName: string) =>
    api.request<FileSystemResponse<File>>({
      url: `/files/${fileId}/rename`,
      method: "PATCH",
      data: { name: newName },
    }),

  moveFile: (fileId: string, newPath: string) =>
    api.request<FileSystemResponse<File>>({
      url: `/files/${fileId}/move`,
      method: "PATCH",
      data: { path: newPath },
    }),

  // 添加获取文件数据的方法
  getFileData: (fileId: string) =>
    api.request<FileSystemResponse<ArrayBuffer>>({
      url: `/files/${fileId}/data`,
      method: "GET",
      responseType: "arraybuffer",
    }),

  // 添加更新文件数据的方法
  updateFileData: (fileId: string, data: Blob) =>
    api.request<FileSystemResponse<void>>({
      url: `/files/${fileId}/data`,
      method: "PUT",
      data,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    }),

  // 文件夹操作
  getFolders: (path: string) =>
    api.request<FileSystemResponse<Folder[]>>({
      url: "/folders",
      method: "GET",
      params: { path },
    }),

  createFolder: (path: string, name: string) =>
    api.request<FileSystemResponse<Folder>>({
      url: "/folders",
      method: "POST",
      data: { path, name },
    }),

  deleteFolder: (folderId: string) =>
    api.request<FileSystemResponse<void>>({
      url: `/folders/${folderId}`,
      method: "DELETE",
    }),

  renameFolder: (folderId: string, newName: string) =>
    api.request<FileSystemResponse<Folder>>({
      url: `/folders/${folderId}/rename`,
      method: "PATCH",
      data: { name: newName },
    }),

  // 版本控制
  getVersions: (fileId: string) =>
    api.request<FileSystemResponse<Version[]>>({
      url: `/files/${fileId}/versions`,
      method: "GET",
    }),

  restoreVersion: (fileId: string, versionId: string) =>
    api.request<FileSystemResponse<File>>({
      url: `/files/${fileId}/versions/${versionId}/restore`,
      method: "POST",
    }),

  createVersion: (fileId: string, comment: string) =>
    api.request<FileSystemResponse<Version>>({
      url: `/files/${fileId}/versions`,
      method: "POST",
      data: { comment },
    }),

  compareVersions: (versionId1: string, versionId2: string) =>
    api.request<FileSystemResponse<VersionDiff>>({
      url: `/versions/compare`,
      method: "POST",
      data: {
        version1: versionId1,
        version2: versionId2,
      },
    }),

  // 收藏夹
  getFavorites: () =>
    api.request<FileSystemResponse<string[]>>({
      url: "/favorites",
      method: "GET",
    }),

  addFavorite: (fileId: string) =>
    api.request<FileSystemResponse<void>>({
      url: "/favorites",
      method: "POST",
      data: { fileId },
    }),

  removeFavorite: (fileId: string) =>
    api.request<FileSystemResponse<void>>({
      url: `/favorites/${fileId}`,
      method: "DELETE",
    }),

  // 标签管理
  getTags: () =>
    api.request<
      FileSystemResponse<{ tags: string[]; colors: Record<string, string> }>
    >({
      url: "/tags",
      method: "GET",
    }),

  addTag: (tag: string, color: string) =>
    api.request<FileSystemResponse<void>>({
      url: "/tags",
      method: "POST",
      data: { tag, color },
    }),

  removeTag: (tag: string) =>
    api.request<FileSystemResponse<void>>({
      url: `/tags/${encodeURIComponent(tag)}`,
      method: "DELETE",
    }),

  addFileTag: (fileId: string, tag: string) =>
    api.request<FileSystemResponse<void>>({
      url: `/files/${fileId}/tags`,
      method: "POST",
      data: { tag },
    }),

  removeFileTag: (fileId: string, tag: string) =>
    api.request<FileSystemResponse<void>>({
      url: `/files/${fileId}/tags/${encodeURIComponent(tag)}`,
      method: "DELETE",
    }),

  // 搜索
  search: (params: {
    term: string;
    type?: string;
    dateRange?: string;
    includeArchived?: boolean;
    sizeRange?: {
      min: number;
      max: number;
    };
    owner?: string;
    tags?: string[];
  }) =>
    api.request<FileSystemResponse<File[]>>({
      url: "/search",
      method: "GET",
      params,
    }),
};
