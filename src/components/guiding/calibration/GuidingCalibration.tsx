"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import CalibrationCanvas from "./CalibrationCanvas";
import CalibrationControls from "./CalibrationControls";
import CalibrationData from "./CalibrationData";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/lib/store/guiding/calibration";

export default function GuidingCalibration() {
  const { isLandscape, setIsLandscape } = useGuidingStore();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsMobileLandscape(isLandscape);
      setIsLandscape(isLandscape);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // 监听屏幕旋转
    window.screen?.orientation?.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.screen?.orientation?.removeEventListener("change", handleResize);
    };
  }, [setIsLandscape]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-6xl mx-auto p-2 sm:p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 min-h-screen ${
        isLandscape || isMobileLandscape ? "landscape" : ""
      }`}
    >
      <Card className="bg-gray-800/95 border-gray-700 shadow-lg rounded-lg backdrop-blur-sm">
        <div
          className={`p-2 sm:p-4 ${
            isLandscape || isMobileLandscape
              ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
              : "flex flex-col space-y-4"
          }`}
        >
          <div className="flex-1 min-w-0">
            <CalibrationCanvas />
            <CalibrationControls />
          </div>
          <div className="flex-1 min-w-0 overflow-x-auto">
            <CalibrationData />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
