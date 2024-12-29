"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Plus } from "lucide-react";

interface ActionButtonsProps {
  resetCorrectionLevels: () => void;
  generateBadPixels: () => void;
  handleManualAddPixel: () => void;
  manualPixel: string;
  setManualPixel: (value: string) => void;
}

export default function ActionButtons({
  resetCorrectionLevels,
  generateBadPixels,
  handleManualAddPixel,
  manualPixel,
  setManualPixel,
}: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="flex justify-between space-x-2"
    >
      <Button variant="outline" size="sm" onClick={resetCorrectionLevels}>
        <RotateCcw className="mr-2 h-4 w-4" />
        重置
      </Button>
      <Button variant="outline" size="sm" onClick={generateBadPixels}>
        <Play className="mr-2 h-4 w-4" />
        生成
      </Button>
      <Button variant="outline" size="sm" onClick={handleManualAddPixel}>
        <Plus className="mr-2 h-4 w-4" />
        增加坏点
      </Button>
    </motion.div>
  );
}
