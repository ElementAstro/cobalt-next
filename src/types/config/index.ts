export type SettingValue = string | number | boolean;

export type ValidationRule = {
  type: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max";
  value?: number | string | RegExp;
  message: string;
  custom?: (value: SettingValue) => boolean | Promise<boolean>;
  dependsOn?: string[];
};

export interface HistoryEntry {
  timestamp: number;
  path: string[];
  oldValue: SettingValue | null;
  newValue: SettingValue;
}

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
  filter: (setting: Setting) => boolean;
  unit?: string;
  defaultValue?: SettingValue;
  requiresRestart?: boolean;
  dependsOn?: {
    setting: string;
    value: SettingValue;
  };
  isAdvanced?: boolean;
  formatValue?: (value: SettingValue) => string;
  validationRules?: ValidationRule[];
  autoSync?: boolean;
  lastModified?: number;
  modifiedBy?: string;
}

export interface SettingGroup {
  id: string;
  label: string;
  icon?: string;
  settings: (Setting | SettingGroup)[];
  collapsible?: boolean;
}

export type SettingsData = SettingGroup[];

export interface SettingGroupG extends Setting {
  settings: Array<Setting | SettingGroup>;
}

export interface SettingHistoryEntry {
  timestamp: number;
  path: string[];
  oldValue: SettingValue | null;
  newValue: SettingValue;
  user?: string;
  device?: string;
  revertible?: boolean;
}

export interface SettingTag {
  id: string;
  label: string;
  color: string;
}

export interface SettingBatch {
  settings: Array<{
    path: string[];
    value: SettingValue;
  }>;
  timestamp: number;
  user?: string;
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
  batchUpdate: (batch: SettingBatch) => Promise<void>;
  validateSettings: () => Promise<boolean>;
  subscribeToChanges: (callback: (changes: SettingHistoryEntry) => void) => () => void;
  getSettingsDiff: (timestamp: number) => Promise<SettingHistoryEntry[]>;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  path: string[];
  oldValue: SettingValue | null;
  newValue: SettingValue;
  user?: string;
  device?: string;
  revertible: boolean;
  changeType: 'update' | 'reset' | 'batch' | 'import';
  status: 'pending' | 'success' | 'failed';
  error?: string;
  metadata?: Record<string, any>;
}
