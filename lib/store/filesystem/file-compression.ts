import { create } from "zustand";

interface FileCompressionState {
  selectedFiles: File[];
  compressionType: "zip" | "rar" | "7z";
  isCompressing: boolean;
  setSelectedFiles: (files: File[]) => void;
  setCompressionType: (type: "zip" | "rar" | "7z") => void;
  setIsCompressing: (compressing: boolean) => void;
}

export const useFileCompression = create<FileCompressionState>((set) => ({
  selectedFiles: [],
  compressionType: "zip",
  isCompressing: false,
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  setCompressionType: (type) => set({ compressionType: type }),
  setIsCompressing: (compressing) => set({ isCompressing: compressing }),
}));
