export interface Software {
  id: string;
  name: string;
  version: string;
  author: string;
  date: string;
  size: string;
  icon: string;
  isInstalled: boolean;
  hasUpdate: boolean;
  isFavorite: boolean;
  isUpdating: boolean;
  autoUpdate: boolean;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  tags: string[];
  requirements: {
    os: string[];
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  screenshots: string[];
  lastUpdated: string;
  releaseNotes: string;
  license: string;
  dependencies: string[];
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SoftwareStats {
  totalDownloads: number;
  activeUsers: number;
  averageRating: number;
  updateFrequency: string;
}

export type ViewMode = "compact" | "comfortable" | "detailed";
export type CategoryType = "all" | "astronomy" | "processing" | "utilities";
