export type SettingValue = string | number | boolean | File | null;

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max" | "custom";
  value?: string | number;
  message?: string;
  validator?: (value: SettingValue) => boolean;
}

export interface Setting {
  type: "text" | "number" | "checkbox" | "select" | "color" | "range" | "date" | "time" | "file" | "custom";
  label: string;
  value: SettingValue;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  component?: React.ReactNode;
  validation?: ValidationRule[];
}
