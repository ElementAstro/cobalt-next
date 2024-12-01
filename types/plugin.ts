export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Review {
  id: string;
  userId: string;
  pluginId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Plugin {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  downloads: number;
  version: string;
  lastUpdated: string;
  developer: string;
  requirements: string[];
  tags: string[];
  installed: boolean;
  reviews: Review[];
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  minRating?: number;
  maxPrice?: number;
  tags?: string[];
}

