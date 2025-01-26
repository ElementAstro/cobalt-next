import { faker } from "@faker-js/faker";
import { File, Folder, FileType, ApiResponse } from "@/types/filesystem";

const FILE_TYPES: FileType[] = [
  "folder",
  "image",
  "video",
  "document",
  "code",
  "audio",
  "archive",
  "unknown",
];

// 增强 mock 数据生成器
const generateMockFile = (overrides?: Partial<File>): File => ({
  id: faker.string.uuid(),
  name: faker.system.fileName(),
  type: faker.helpers.arrayElement(FILE_TYPES),
  size: faker.number.int({ min: 1024, max: 1024 * 1024 * 100 }),
  lastModified: faker.date.recent(),
  createdAt: faker.date.past(),
  owner: faker.person.fullName(),
  permissions: "rw-r--r--",
  content: faker.lorem.paragraph(),
  language: faker.helpers.arrayElement(["javascript", "python", "java"]),
  path: faker.system.filePath(),
  thumbnail: faker.image.url(),
  modified: faker.date.recent().toISOString(),
  versions: Array(3)
    .fill(null)
    .map(() => ({
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      size: faker.number.int({ min: 1024, max: 1024 * 1024 }),
    })),
  tags: faker.helpers.arrayElements(["Work", "Personal", "Important"], {
    min: 0,
    max: 3,
  }),
  isFavorite: faker.datatype.boolean(),
  ...overrides,
});

const generateMockFolder = (overrides?: Partial<Folder>): Folder => ({
  id: faker.string.uuid(),
  name: faker.system.fileName(),
  files: [],
  createdAt: faker.date.past(),
  lastModified: faker.date.recent(),
  owner: faker.person.fullName(),
  permissions: "rwxr-xr-x",
  path: faker.system.directoryPath(),
  modified: faker.date.recent().toISOString(),
  size: faker.number.int({ min: 0, max: 1024 * 1024 * 1000 }),
  itemCount: faker.number.int({ min: 0, max: 100 }),
  parentId: faker.string.uuid(),
  ...overrides,
});

export const mockFilesystemApi = {
  // 文件操作
  getFiles: async (path: string): Promise<ApiResponse<File[]>> => ({
    data: Array(10)
      .fill(null)
      .map(() => generateMockFile({ path })),
    message: "Files retrieved successfully",
    status: "success",
  }),

  uploadFiles: async (files: FormData): Promise<ApiResponse<File[]>> => ({
    data: Array.from({ length: files.getAll("files").length }, () =>
      generateMockFile()
    ),
    message: "Files uploaded successfully",
    status: "success",
  }),

  search: async (params: {
    query: string;
    type?: FileType[];
  }): Promise<ApiResponse<File[]>> => ({
    data: Array(5)
      .fill(null)
      .map(() =>
        generateMockFile({
          type: params.type
            ? faker.helpers.arrayElement(params.type)
            : undefined,
        })
      ),
    message: "Search completed",
    status: "success",
  }),

  renameFile: async (
    fileId: string,
    newName: string
  ): Promise<ApiResponse<File>> => ({
    data: generateMockFile({ id: fileId, name: newName }),
    message: "File renamed successfully",
    status: "success",
  }),

  moveFile: async (
    fileId: string,
    newPath: string
  ): Promise<ApiResponse<File>> => ({
    data: generateMockFile({ id: fileId, path: newPath }),
    message: "File moved successfully",
    status: "success",
  }),

  deleteFiles: async (fileIds: string[]): Promise<ApiResponse<void>> => ({
    data: undefined,
    message: `Successfully deleted ${fileIds.length} files`,
    status: "success",
  }),

  // 文件夹操作
  getFolders: async (path: string): Promise<ApiResponse<Folder[]>> => ({
    data: Array(5)
      .fill(null)
      .map(() => generateMockFolder({ path })),
    message: "Folders retrieved successfully",
    status: "success",
  }),

  createFolder: async (
    path: string,
    name: string
  ): Promise<ApiResponse<Folder>> => ({
    data: generateMockFolder({ path, name }),
    message: "Folder created successfully",
    status: "success",
  }),

  deleteFolder: async (folderId: string): Promise<ApiResponse<void>> => ({
    data: undefined,
    message: "Folder deleted successfully",
    status: "success",
  }),

  // 收藏夹操作
  getFavorites: async (): Promise<ApiResponse<string[]>> => ({
    data: Array(3)
      .fill(null)
      .map(() => faker.string.uuid()),
    message: "Favorites retrieved successfully",
    status: "success",
  }),

  // 标签操作
  getTags: async (): Promise<
    ApiResponse<{ tags: string[]; colors: Record<string, string> }>
  > => ({
    data: {
      tags: ["Work", "Personal", "Important"],
      colors: {
        Work: "#3B82F6",
        Personal: "#10B981",
        Important: "#EF4444",
      },
    },
    message: "Tags retrieved successfully",
    status: "success",
  }),

  addFileTag: async (
    fileId: string,
    tag: string
  ): Promise<ApiResponse<void>> => ({
    data: undefined,
    message: "Tag added successfully",
    status: "success",
  }),

  removeFileTag: async (
    fileId: string,
    tag: string
  ): Promise<ApiResponse<void>> => ({
    data: undefined,
    message: "Tag removed successfully",
    status: "success",
  }),

  // 版本操作
  getVersions: async (fileId: string): Promise<ApiResponse<File[]>> => ({
    data: Array(3)
      .fill(null)
      .map(() => generateMockFile({ id: fileId })),
    message: "Versions retrieved successfully",
    status: "success",
  }),

  restoreVersion: async (
    fileId: string,
    versionId: string
  ): Promise<ApiResponse<File>> => ({
    data: generateMockFile({ id: fileId }),
    message: "Version restored successfully",
    status: "success",
  }),
};
