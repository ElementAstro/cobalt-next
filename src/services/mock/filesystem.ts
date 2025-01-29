import { faker } from "@faker-js/faker";
import {
  File,
  Folder,
  FileType,
  ApiResponse,
  Version,
  VersionDiff,
} from "@/types/filesystem";

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
  thumbnail: faker.image.url({ width: 200, height: 200 }), // 修改这一行以生成固定尺寸的缩略图
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

const generateMockFolder = (overrides?: Partial<Folder>): Folder => {
  const path = overrides?.path || "/";
  const depth = path.split("/").filter(Boolean).length;

  // 限制文件夹深度，避免无限递归
  const subItemCount = depth < 3 ? faker.number.int({ min: 2, max: 5 }) : 0;

  const folder: Folder = {
    id: faker.string.uuid(), // This ensures id is always a string
    name: faker.system.fileName(),
    files: [],
    size: 0,
    lastModified: faker.date.recent(),
    createdAt: faker.date.past(),
    owner: faker.person.fullName(),
    permissions: "rwxr-xr-x",
    path: path,
    modified: faker.date.recent().toISOString(),
    itemCount: subItemCount,
    parentId: depth > 0 ? faker.string.uuid() : undefined,
    ...overrides,
  };

  // 只在深度小于3的情况下生成子项目
  if (depth < 3) {
    folder.files = Array(subItemCount)
      .fill(null)
      .map(() => {
        const isSubFolder = faker.datatype.boolean();
        if (isSubFolder) {
          return generateMockFolder({
            path: `${folder.path}/${faker.system.fileName()}`,
            parentId: String(folder.id),
          });
        } else {
          return generateMockFile({
            path: folder.path,
            type: faker.helpers.arrayElement(["image", "video", "document"]),
          });
        }
      });
  }

  return folder;
};

export const mockFilesystemApi = {
  // 文件操作
  getFiles: async (path: string): Promise<ApiResponse<File[]>> => ({
    data: Array(15) // 增加生成的文件数量
      .fill(null)
      .map(() =>
        generateMockFile({
          path,
          type: faker.helpers.arrayElement([
            "image",
            "video",
            "document",
            "code",
            "audio",
            "archive",
          ]),
        })
      ),
    message: "Files retrieved successfully",
    status: "success",
  }),

  uploadFiles: async (files: FormData): Promise<ApiResponse<File[]>> => {
    // 模拟上传延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 模拟上传进度
    const onProgress = files.get("onProgress") as unknown as Function;
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        onProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    return {
      data: Array.from({ length: files.getAll("files").length }, () =>
        generateMockFile()
      ),
      message: "Files uploaded successfully",
      status: "success",
    };
  },

  search: async (params: {
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
  }): Promise<ApiResponse<File[]>> => {
    // 模拟搜索延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let results = Array(10)
      .fill(null)
      .map(() => generateMockFile());

    // 模拟根据搜索条件过滤结果
    if (params.term) {
      results = results.filter((file) =>
        file.name.toLowerCase().includes(params.term.toLowerCase())
      );
    }

    if (params.type && params.type !== "all") {
      results = results.filter((file) => file.type === params.type);
    }

    if (params.dateRange) {
      const now = new Date();
      const ranges = {
        "past-week": 7,
        "past-month": 30,
        "past-year": 365,
      };

      if (params.dateRange in ranges) {
        const days = ranges[params.dateRange as keyof typeof ranges];
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        results = results.filter(
          (file) => new Date(file.lastModified) > cutoff
        );
      }
    }

    if (params.sizeRange) {
      results = results.filter(
        (file) =>
          file.size >= params.sizeRange!.min &&
          file.size <= params.sizeRange!.max
      );
    }

    if (params.owner) {
      results = results.filter((file) =>
        file.owner.toLowerCase().includes(params.owner!.toLowerCase())
      );
    }

    if (params.tags && params.tags.length > 0) {
      results = results.filter((file) =>
        params.tags!.some((tag) => file.tags?.includes(tag) ?? false)
      );
    }

    return {
      data: results,
      message: `Found ${results.length} matching files`,
      status: "success",
    };
  },

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
  getFolders: async (path: string): Promise<ApiResponse<Folder[]>> => {
    const depth = path.split("/").filter(Boolean).length;
    return {
      data: Array(depth < 2 ? 3 : 1)
        .fill(null)
        .map(() =>
          generateMockFolder({
            path,
            name: faker.system.fileName(),
          })
        ),
      message: "Folders retrieved successfully",
      status: "success",
    };
  },

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

  // 添加 mock 的文件数据获取方法
  getFileData: async (fileId: string): Promise<ApiResponse<ArrayBuffer>> => {
    // 生成随机数据作为文件内容
    const size = faker.number.int({ min: 1024, max: 1024 * 1024 });
    const buffer = new ArrayBuffer(size);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
      view[i] = faker.number.int({ min: 0, max: 255 });
    }

    return {
      data: buffer,
      message: "File data retrieved successfully",
      status: "success",
    };
  },

  // 添加 mock 的文件数据更新方法
  updateFileData: async (
    fileId: string,
    data: Blob
  ): Promise<ApiResponse<void>> => {
    // 在实际应用中，这里应该更新文件系统中的文件
    // 在 mock 中，我们只是模拟成功响应
    return {
      data: undefined,
      message: "File data updated successfully",
      status: "success",
    };
  },

  // Version Control
  getVersions: async (fileId: string): Promise<ApiResponse<Version[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: faker.string.uuid(),
          fileId,
          number: i + 1,
          createdAt: faker.date.recent(),
          author: faker.person.fullName(),
          comment: faker.lorem.sentence(),
          size: faker.number.int({ min: 1024, max: 1024 * 1024 }),
          hash: faker.string.alphanumeric(40),
          changes: {
            additions: faker.number.int({ min: 0, max: 100 }),
            deletions: faker.number.int({ min: 0, max: 100 }),
          },
          tags: faker.helpers.arrayElements(["bugfix", "feature", "refactor"], {
            min: 1,
            max: 2,
          }),
          status: faker.helpers.arrayElement(["active", "archived"]),
          restorePoint: faker.datatype.boolean(),
        })),
      message: `Retrieved versions for file ${fileId}`,
      status: "success",
    };
  },

  createVersion: async (
    fileId: string,
    comment: string
  ): Promise<ApiResponse<Version>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: {
        id: faker.string.uuid(),
        fileId,
        number: faker.number.int({ min: 1, max: 100 }),
        createdAt: new Date(),
        author: faker.person.fullName(),
        comment,
        size: faker.number.int({ min: 1024, max: 1024 * 1024 }),
        hash: faker.string.alphanumeric(40),
        changes: {
          additions: faker.number.int({ min: 0, max: 100 }),
          deletions: faker.number.int({ min: 0, max: 100 }),
        },
        tags: ["feature"],
        status: "active",
        restorePoint: false,
      },
      message: `Created new version for file ${fileId}`,
      status: "success",
    };
  },

  compareVersions: async (
    versionId1: string,
    versionId2: string
  ): Promise<ApiResponse<VersionDiff>> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      data: {
        additions: faker.number.int({ min: 0, max: 100 }),
        deletions: faker.number.int({ min: 0, max: 100 }),
        changes: faker.number.int({ min: 0, max: 100 }),
        chunks: Array(faker.number.int({ min: 1, max: 5 }))
          .fill(null)
          .map(() => ({
            type: faker.helpers.arrayElement(["added", "removed", "modified"]),
            content: faker.lorem.lines(3),
            lineNumbers: {
              old: {
                start: faker.number.int({ min: 1, max: 100 }),
                end: faker.number.int({ min: 101, max: 200 }),
              },
              new: {
                start: faker.number.int({ min: 1, max: 100 }),
                end: faker.number.int({ min: 101, max: 200 }),
              },
            },
          })),
      },
      message: `Compared versions ${versionId1} and ${versionId2}`,
      status: "success",
    };
  },

  restoreVersion: async (
    fileId: string,
    versionId: string
  ): Promise<ApiResponse<File>> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      data: generateMockFile({
        id: fileId,
        versions: [
          {
            id: versionId,
            createdAt: new Date(),
            size: faker.number.int({ min: 1024, max: 1024 * 1024 }),
          },
        ],
        lastModified: new Date(),
      }),
      message: `Restored file ${fileId} to version ${versionId}`,
      status: "success",
    };
  },
};
