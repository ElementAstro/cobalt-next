import { useFilesystemStore } from "@/store/useFilesystemStore";
import { mockFilesystemApi } from "./mock/filesystem";
import { filesystemApi } from "./api/filesystem";

const UPLOAD_CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

interface UploadResponse {
  success: boolean;
  error?: string;
  data?: any;
  code?: string;
}

class UploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'UploadError';
  }
}

export const uploadFile = async (
  formData: FormData,
  signal: AbortSignal,
  onProgress: (progress: number) => void
): Promise<UploadResponse> => {
  try {
    // 使用 filesystemApi 的 uploadFiles 方法
    const response = await filesystemApi.uploadFiles(formData);
    
    if (response.data) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: "Upload failed"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Upload failed"
    };
  }
};

// 模拟文件上传过程
const simulateFileUpload = async (
  formData: FormData,
  signal: AbortSignal,
  onProgress: (progress: number) => void
): Promise<UploadResponse> => {
  const file = formData.get("file") as File;
  if (!file) {
    return {
      success: false,
      error: "No file provided"
    };
  }

  const totalSteps = 100;
  const timePerStep = 50; // 每步耗时50ms，总共5秒

  for (let step = 0; step <= totalSteps; step++) {
    if (signal.aborted) {
      throw new Error("Upload cancelled");
    }

    await new Promise(resolve => setTimeout(resolve, timePerStep));
    onProgress(step);

    // 模拟随机上传失败
    if (Math.random() < 0.01) { // 1%的失败率
      return {
        success: false,
        error: "Random upload failure"
      };
    }
  }

  // 模拟成功上传
  return {
    success: true,
    data: {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // 创建临时URL用于预览
    }
  };
};

// 添加一个工具函数来验证文件
export const validateFile = (file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
}) => {
  const errors: string[] = [];

  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`文件大小不能超过 ${options.maxSize / 1024 / 1024}MB`);
  }

  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`不支持的文件类型: ${file.type}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// 添加批量上传功能
export const uploadFiles = async (
  files: File[],
  options: {
    onProgress?: (fileName: string, progress: number) => void;
    onSuccess?: (fileName: string, response: UploadResponse) => void;
    onError?: (fileName: string, error: string) => void;
  }
) => {
  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();

    try {
      const response = await uploadFile(
        formData,
        controller.signal,
        (progress) => {
          options.onProgress?.(file.name, progress);
        }
      );

      if (response.success) {
        options.onSuccess?.(file.name, response);
      } else {
        options.onError?.(file.name, response.error || "Upload failed");
      }

      return response;
    } catch (error: any) {
      options.onError?.(file.name, error.message);
      throw error;
    }
  });

  return Promise.all(uploads);
};
