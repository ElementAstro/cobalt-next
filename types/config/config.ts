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
}

export interface SettingGroup {
  id: string;
  label: string;
  icon?: string;
  settings: (Setting | SettingGroup)[];
  collapsible?: boolean;
}

export type SettingsData = SettingGroup[];

export interface SettingsState {
  settings: SettingsData;
  updateSetting: (path: string[], value: SettingValue) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
