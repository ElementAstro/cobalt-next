"use client";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useGuidingStore } from "@/lib/store/guiding/calibration";
import { motion } from "framer-motion";

export default function CalibrationControls() {
  const {
    showGrid,
    setShowGrid,
    showAnimation,
    setShowAnimation,
    lineLength,
    setLineLength,
    handleRecalibrate,
  } = useGuidingStore();

  return (
    <motion.div
      className="mt-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-sm">显示网格</span>
        <Switch checked={showGrid} onCheckedChange={setShowGrid} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-sm">动画效果</span>
        <Switch checked={showAnimation} onCheckedChange={setShowAnimation} />
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-300 text-sm">线条长度</span>
        <Slider
          value={[lineLength]}
          onValueChange={(value) => setLineLength(value[0])}
          min={50}
          max={150}
          step={1}
          className="flex-grow"
        />
        <span className="text-gray-300 text-sm">{lineLength}</span>
      </div>
      <Button onClick={handleRecalibrate} className="w-full text-sm">
        重新校准
      </Button>
    </motion.div>
  );
}
