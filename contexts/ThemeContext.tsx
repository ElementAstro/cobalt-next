"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ColorScheme, ThemeSettings, presetThemes } from "@/types/theme";

interface ThemeContextType {
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  activePreset: keyof typeof presetThemes;
  setActivePreset: (preset: keyof typeof presetThemes) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeSettings>(presetThemes.dark);
  const [activePreset, setActivePreset] =
    useState<keyof typeof presetThemes>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-settings");
    const savedPreset = localStorage.getItem(
      "theme-preset"
    ) as keyof typeof presetThemes;

    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
    if (savedPreset) {
      setActivePreset(savedPreset);
    }
  }, []);

  useEffect(() => {
    const applyTheme = (settings: ThemeSettings) => {
      const {
        colorScheme,
        fontSize,
        borderRadius,
        fontFamily,
        buttonStyle,
        useShadows,
      } = settings;

      // 应用颜色方案
      Object.entries(colorScheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });

      // 应用其他样式设置
      document.documentElement.style.setProperty(
        "--font-size",
        `${fontSize}px`
      );
      document.documentElement.style.setProperty(
        "--border-radius",
        `${borderRadius}px`
      );
      document.documentElement.style.setProperty("--font-family", fontFamily);
      document.documentElement.style.setProperty(
        "--button-radius",
        buttonStyle === "rounded" ? "9999px" : `${borderRadius}px`
      );
      document.documentElement.style.setProperty(
        "--use-shadows",
        useShadows ? "1" : "0"
      );

      // 应用暗色模式
      document.documentElement.classList.toggle(
        "dark",
        activePreset === "dark" || activePreset === "astronomyRed"
      );
    };

    applyTheme(theme);
    localStorage.setItem("theme-settings", JSON.stringify(theme));
    localStorage.setItem("theme-preset", activePreset);
  }, [theme, activePreset]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, activePreset, setActivePreset }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
