import { create } from "zustand";

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fileType: "all" | "document" | "image" | "video";
  setFileType: (type: "all" | "document" | "image" | "video") => void;
  dateRange: "any" | "past-week" | "past-month" | "past-year";
  setDateRange: (
    range: "any" | "past-week" | "past-month" | "past-year"
  ) => void;
  includeArchived: boolean;
  setIncludeArchived: (include: boolean) => void;
  searchResults: string[];
  setSearchResults: (results: string[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  fileType: "all",
  setFileType: (type) => set({ fileType: type }),
  dateRange: "any",
  setDateRange: (range) => set({ dateRange: range }),
  includeArchived: false,
  setIncludeArchived: (include) => set({ includeArchived: include }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () =>
    set({
      searchTerm: "",
      fileType: "all",
      dateRange: "any",
      includeArchived: false,
      searchResults: [],
      isLoading: false,
    }),
}));
