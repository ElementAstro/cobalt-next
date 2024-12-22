import { create } from "zustand";

interface CloudState {
  selectedService: string;
  setSelectedService: (service: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  feedback: { type: "success" | "error"; message: string } | null;
  setFeedback: (
    feedback: { type: "success" | "error"; message: string } | null
  ) => void;
}

export const useCloudStore = create<CloudState>((set) => ({
  selectedService: "google-drive",
  setSelectedService: (service) => set({ selectedService: service }),
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  feedback: null,
  setFeedback: (feedback) => set({ feedback }),
}));