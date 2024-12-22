import { create } from "zustand";

interface FileEncryptionState {
  selectedFile: File | null;
  password: string;
  isSuccess: boolean;
  isEncrypting: boolean;
  isProcessing: boolean;
  setIsSuccess: (success: boolean) => void;
  setSelectedFile: (file: File | null) => void;
  setPassword: (password: string) => void;
  toggleEncrypting: () => void;
  setIsProcessing: (processing: boolean) => void;
}

export const useFileEncryption = create<FileEncryptionState>((set) => ({
  selectedFile: null,
  password: "",
  isSuccess: false,
  isEncrypting: true,
  isProcessing: false,
  setIsSuccess: (success) => set({ isSuccess: success }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setPassword: (password) => set({ password }),
  toggleEncrypting: () =>
    set((state) => ({ isEncrypting: !state.isEncrypting })),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
}));