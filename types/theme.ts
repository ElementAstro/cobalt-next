export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  border: string;
  input: string;
  ring: string;
  accent: string;
  popover: string;
  card: string;
  muted: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeSettings {
  colorScheme: ColorScheme;
  fontSize: number;
  borderRadius: number;
  fontFamily: string;
  buttonStyle: "default" | "rounded" | "square";
  useShadows: boolean;
  animationSpeed: "none" | "slow" | "normal" | "fast";
  contrast: "normal" | "high";
}

// 默认深色配色方案 - 天文观测友好
export const defaultDarkScheme: ColorScheme = {
  primary: "hsl(240 5.9% 10%)",
  secondary: "hsl(240 3.7% 15.9%)",
  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  border: "hsl(240 3.7% 15.9%)",
  input: "hsl(240 3.7% 15.9%)",
  ring: "hsl(346.8 77.2% 49.8%)",
  accent: "hsl(346.8 77.2% 49.8%)",
  popover: "hsl(240 10% 3.9%)",
  card: "hsl(240 10% 3.9%)",
  muted: "hsl(240 3.7% 15.9%)",
  destructive: "hsl(0 62.8% 30.6%)",
  success: "hsl(142.1 70.6% 45.3%)",
  warning: "hsl(48 96.5% 53.9%)",
  info: "hsl(217.2 91.2% 59.8%)",
};

// 默认浅色配色方案
export const defaultLightScheme: ColorScheme = {
  primary: "hsl(0 0% 100%)",
  secondary: "hsl(0 0% 96.1%)",
  background: "hsl(0 0% 100%)",
  foreground: "hsl(240 10% 3.9%)",
  border: "hsl(240 5.9% 90%)",
  input: "hsl(240 5.9% 90%)",
  ring: "hsl(346.8 77.2% 49.8%)",
  accent: "hsl(346.8 77.2% 49.8%)",
  popover: "hsl(0 0% 100%)",
  card: "hsl(0 0% 100%)",
  muted: "hsl(240 4.8% 95.9%)",
  destructive: "hsl(0 84.2% 60.2%)",
  success: "hsl(142.1 76.2% 36.3%)",
  warning: "hsl(47.9 95.8% 53.1%)",
  info: "hsl(221.2 83.2% 53.3%)",
};

// 天文红光保护配色方案
export const astronomyRedScheme: ColorScheme = {
  primary: "hsl(0 10% 5%)",
  secondary: "hsl(0 10% 10%)",
  background: "hsl(0 10% 3%)",
  foreground: "hsl(0 80% 40%)",
  border: "hsl(0 80% 20%)",
  input: "hsl(0 10% 10%)",
  ring: "hsl(0 80% 40%)",
  accent: "hsl(0 80% 40%)",
  popover: "hsl(0 10% 5%)",
  card: "hsl(0 10% 5%)",
  muted: "hsl(0 10% 15%)",
  destructive: "hsl(0 62.8% 30.6%)",
  success: "hsl(0 80% 30%)",
  warning: "hsl(0 80% 40%)",
  info: "hsl(0 80% 35%)",
};

// 深海蓝配色方案
export const oceanBlueScheme: ColorScheme = {
  primary: "hsl(200 80% 10%)",
  secondary: "hsl(200 80% 15%)",
  background: "hsl(200 80% 5%)",
  foreground: "hsl(200 10% 98%)",
  border: "hsl(200 80% 20%)",
  input: "hsl(200 80% 15%)",
  ring: "hsl(200 80% 40%)",
  accent: "hsl(200 80% 40%)",
  popover: "hsl(200 80% 10%)",
  card: "hsl(200 80% 10%)",
  muted: "hsl(200 80% 20%)",
  destructive: "hsl(0 62.8% 30.6%)",
  success: "hsl(142.1 70.6% 45.3%)",
  warning: "hsl(48 96.5% 53.9%)",
  info: "hsl(200 80% 40%)",
};

// 森林绿配色方案
export const forestGreenScheme: ColorScheme = {
  primary: "hsl(120 30% 10%)",
  secondary: "hsl(120 30% 15%)",
  background: "hsl(120 30% 5%)",
  foreground: "hsl(120 10% 98%)",
  border: "hsl(120 30% 20%)",
  input: "hsl(120 30% 15%)",
  ring: "hsl(120 50% 40%)",
  accent: "hsl(120 50% 40%)",
  popover: "hsl(120 30% 10%)",
  card: "hsl(120 30% 10%)",
  muted: "hsl(120 30% 20%)",
  destructive: "hsl(0 62.8% 30.6%)",
  success: "hsl(142.1 70.6% 45.3%)",
  warning: "hsl(48 96.5% 53.9%)",
  info: "hsl(120 50% 40%)",
};

// 默认主题设置
export const defaultThemeSettings: ThemeSettings = {
  colorScheme: defaultDarkScheme,
  fontSize: 16,
  borderRadius: 8,
  fontFamily: "system-ui, sans-serif",
  buttonStyle: "rounded",
  useShadows: true,
  animationSpeed: "normal",
  contrast: "normal",
};

// 预设主题
export const presetThemes = {
  light: {
    ...defaultThemeSettings,
    colorScheme: defaultLightScheme,
  },
  dark: {
    ...defaultThemeSettings,
    colorScheme: defaultDarkScheme,
  },
  astronomyRed: {
    ...defaultThemeSettings,
    colorScheme: astronomyRedScheme,
    animationSpeed: "slow",
    contrast: "high",
  },
  oceanBlue: {
    ...defaultThemeSettings,
    colorScheme: oceanBlueScheme,
  },
  forestGreen: {
    ...defaultThemeSettings,
    colorScheme: forestGreenScheme,
  },
} as const;

// 主题工具函数
export const themeUtils = {
  // 修改颜色亮度
  adjustBrightness: (color: string, amount: number): string => {
    // 实现颜色亮度调整逻辑
    return color;
  },

  // 判断颜色是否为暗色
  isDarkColor: (color: string): boolean => {
    // 实现暗色判断逻辑
    return true;
  },

  // 获取对比色
  getContrastColor: (color: string): string => {
    // 实现对比色获取逻辑
    return color;
  },

  // 创建渐变色
  createGradient: (startColor: string, endColor: string): string => {
    return `linear-gradient(to right, ${startColor}, ${endColor})`;
  },
};

// 导出主题类型
export type ThemeName = keyof typeof presetThemes;

// 导出颜色方案名称
export type ColorSchemeName =
  | "light"
  | "dark"
  | "astronomyRed"
  | "oceanBlue"
  | "forestGreen";

// 导出完整主题配置类型
export type ThemeConfig = (typeof presetThemes)[ThemeName];
