"use client";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useGuidingStore } from "@/store/useGuidingStore";
import { motion } from "framer-motion";
import { Settings, RotateCcw, Play, Pause } from "lucide-react";

export default function CalibrationControls() {
  const {
    showGrid,
    setShowGrid,
    showAnimation,
    setShowAnimation,
    lineLength,
    setLineLength,
    handleRecalibrate,
    autoRotate,
    setAutoRotate,
    rotationSpeed,
    setRotationSpeed,
    zoomLevel,
    setZoomLevel,
  } = useGuidingStore();

  return (
    <motion.div
      className="mt-4 space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 现有控制项 */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          显示网格
        </span>
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

      {/* 新增控制项 */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-sm flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          自动旋转
        </span>
        <Switch checked={autoRotate} onCheckedChange={setAutoRotate} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">旋转速度</span>
          <span className="text-gray-300 text-sm">{rotationSpeed}°/s</span>
        </div>
        <Slider
          value={[rotationSpeed]}
          onValueChange={(value) => setRotationSpeed(value[0])}
          min={0}
          max={10}
          step={0.1}
          disabled={!autoRotate}
          className="flex-grow"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">缩放级别</span>
          <span className="text-gray-300 text-sm">{zoomLevel}x</span>
        </div>
        <Slider
          value={[zoomLevel]}
          onValueChange={(value) => setZoomLevel(value[0])}
          min={0.5}
          max={2}
          step={0.1}
          className="flex-grow"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleRecalibrate}
          variant="destructive"
          className="w-full text-sm"
        >
          重新校准
        </Button>
        <Button
          onClick={() => setAutoRotate(!autoRotate)}
          variant="outline"
          className="w-full text-sm"
        >
          {autoRotate ? (
            <>
              <Pause className="w-4 h-4 mr-2" /> 暂停
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" /> 开始
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
