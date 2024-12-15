"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import CalibrationCanvas from "./CalibrationCanvas";
import CalibrationControls from "./CalibrationControls";
import CalibrationData from "./CalibrationData";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/lib/store/guiding/calibration";

export default function GuidingCalibration() {
  const { isLandscape } = useGuidingStore();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-4xl mx-auto p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 ${
        isLandscape || isMobileLandscape ? "landscape" : ""
      }`}
    >
      <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
        <div
          className={`p-4 ${
            isLandscape || isMobileLandscape
              ? "flex space-x-4"
              : "flex flex-col space-y-4"
          }`}
        >
          <div className="flex-1">
            <CalibrationCanvas />
            <CalibrationControls />
          </div>
          <div className="flex-1">
            <CalibrationData />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
