export interface App {
  id: string;
  name: string;
  icon: string;
  category: "microsoft" | "system" | "tools" | "development" | "media";
  isPinned: boolean;
  lastOpened?: string;
  url: string;
  description?: string;
  isFavorite?: boolean;
  metadata?: {
    version?: string;
    author?: string;
    license?: string;
  };
}

export interface AppGroup {
  title: string;
  apps: App[];
  onAppChange: (newApps: App[]) => void;
  onClose?: () => void;
  columns?: 2 | 3 | 4;
  className?: string;
  itemClassName?: string;
}
