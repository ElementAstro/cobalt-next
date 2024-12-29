import { useState, useEffect } from "react";

const DEFAULT_SETTINGS = {
  darkMode: false,
  defaultTimeout: 5000,
  maxHistoryItems: 10,
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
  }, []);

  interface Settings {
    darkMode: boolean;
    defaultTimeout: number;
    maxHistoryItems: number;
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
}
