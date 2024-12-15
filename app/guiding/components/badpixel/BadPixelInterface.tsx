"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBadPixelStore } from "@/lib/store/guiding/bad-pixel";
import { X, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import PixelInfo from "./PixelInfo";
import ActionButtons from "./ActionButtons";

export default function BadPixelInterface() {
  const {
    data,
    options,
    setData,
    setOptions,
    resetCorrectionLevels,
    generateBadPixels,
    addBadPixel,
  } = useBadPixelStore();
  const [isLandscape, setIsLandscape] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [manualPixel, setManualPixel] = useState("");

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", checkOrientation);
    checkOrientation();

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  useEffect(() => {
    if (options.autoRefresh) {
      const interval = setInterval(() => {
        generateBadPixels();
      }, options.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, options.refreshInterval, generateBadPixels]);

  const toggleTheme = () => {
    setOptions({ theme: options.theme === "light" ? "dark" : "light" });
    document.documentElement.classList.toggle("dark");
  };

  const handleManualAddPixel = () => {
    const pixel = parseInt(manualPixel);
    if (!isNaN(pixel)) {
      addBadPixel(pixel);
      setManualPixel("");
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}
    >
      <Card
        className={`w-full max-w-2xl mx-auto ${
          isLandscape ? "landscape" : ""
        } shadow-lg rounded-lg`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              完善坏点映射图
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-md shadow-inner"
              >
                <SettingsPanel />
              </motion.div>
            )}
          </AnimatePresence>

          <PixelInfo data={data} />

          <ActionButtons
            resetCorrectionLevels={resetCorrectionLevels}
            generateBadPixels={generateBadPixels}
            handleManualAddPixel={handleManualAddPixel}
            manualPixel={manualPixel}
            setManualPixel={setManualPixel}
          />

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            统计完成...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
