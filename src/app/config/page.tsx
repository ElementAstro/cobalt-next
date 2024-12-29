"use client";

import React, { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useSettingsStore } from "@/store/useConfigStore";
import { getSettingByPath } from "@/utils/config-utils";
import SettingGroup from "@/components/config/setting-group";

const SettingsInterface: React.FC = () => {
  const { settings, resetSettings, isLoading, error, fetchSettings } =
    useSettingsStore();
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [primaryColor, setPrimaryColor] = useState<string>("");

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colorSetting = getSettingByPath(settings, [
      "appearance",
      "primaryColor",
    ]);
    if (colorSetting && typeof colorSetting.value === "string") {
      root.style.setProperty("--primary", colorSetting.value);
      setPrimaryColor(colorSetting.value);
    }
  }, [settings]);

  if (isLoading && settings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">错误: {error}</p>
      </div>
    );
  }

  return (
    <div className={`mx-auto p-6 ${isMobile ? "w-full" : "max-w-3xl"}`}>
      <h1 className="text-3xl font-bold mb-6 text-white">设置</h1>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
      )}
      <Accordion type="multiple" className="w-full">
        {settings.map((group) => (
          <SettingGroup key={group.id} group={group} path={[]} />
        ))}
      </Accordion>
      <div className="mt-6">
        <Button
          onClick={resetSettings}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              重置中...
            </>
          ) : (
            "恢复默认设置"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsInterface;
