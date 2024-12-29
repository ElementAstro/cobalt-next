export type SettingValue = string | number | boolean;

export type ValidationRule = {
  type: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max";
  value?: number | string | RegExp;
  message: string;
};

export interface Setting {
  id: string;
  label: string;
  type: "text" | "number" | "checkbox" | "select" | "color" | "range";
  value: SettingValue;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  validation?: ValidationRule[];
  tags?: string[];
  description?: string;
  preview?: boolean;
  category?: string;
}

export interface SettingGroup {
  id: string;
  label: string;
  icon?: string;
  settings: (Setting | SettingGroup)[];
  collapsible?: boolean;
}

export type SettingsData = SettingGroup[];

export interface SettingGroup extends Setting {
  settings: Array<Setting | SettingGroup>;
}

export interface SettingHistoryEntry {
  timestamp: number;
  path: string[];
  oldValue: SettingValue | null;
  newValue: SettingValue;
}

export interface SettingTag {
  id: string;
  label: string;
  color: string;
}

export interface SettingsState {
  settings: SettingsData;
  updateSetting: (path: string[], value: SettingValue) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  history: SettingHistoryEntry[];
  tags: SettingTag[];
  searchQuery: string;
  activeCategory: string | null;
  activeTags: string[];
  addHistoryEntry: (entry: SettingHistoryEntry) => void;
  clearHistory: () => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string | null) => void;
  setActiveTags: (tags: string[]) => void;
  exportSettings: () => Promise<void>;
  importSettings: (data: SettingsData) => Promise<void>;
}
