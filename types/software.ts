export interface Software {
  id: string;
  name: string;
  version: string;
  author: string;
  date: string;
  size: string;
  icon: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterOption {
  label: string;
  value: string;
}
