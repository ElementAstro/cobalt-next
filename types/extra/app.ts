export interface App {
  id: string;
  name: string;
  icon: string;
  category: "microsoft" | "system" | "tools" | "recent";
  isPinned: boolean;
  lastOpened?: string;
  url: string;
}

export interface AppGroup {
  title: string;
  apps: App[];
}
