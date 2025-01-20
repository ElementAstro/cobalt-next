"use client";

import { z } from "zod";
import { debounce } from "lodash";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useGuidingStore } from "@/store/useGuidingStore";
import { motion } from "framer-motion";
import { 
  Settings, 
  RotateCcw, 
  Play, 
  Pause,
  Grid,
  Zap,
  Gauge,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const calibrationSchema = z.object({
  lineLength: z.number().min(50).max(150),
  rotationSpeed: z.number().min(0).max(10),
  zoomLevel: z.number().min(0.5).max(2),
});

export default function CalibrationControls() {
  const { toast } = useToast();
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
  } = useGuidingStore().calibration;

  type CalibrationField = keyof typeof calibrationSchema.shape;

  const debouncedValidate = debounce(
    (value: number, field: CalibrationField) => {
      try {
        const schema = z.object({ [field]: calibrationSchema.shape[field] });
        schema.parse({ [field]: value });
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            variant: "destructive",
            title: "输入错误",
            description: error.errors[0].message,
          });
        }
      }
    },
    300
  );

  const handleValueChange = (
    value: number,
    field: CalibrationField,
    setter: (value: number) => void
  ) => {
    setter(value);
    debouncedValidate(value, field);
  };

  return (
    <motion.div
      className="mt-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-gray-300 font-medium flex items-center gap-2">
          <Settings className="w-5 h-5" />
          校准设置
        </h3>
        <Separator className="bg-gray-700" />

        <TooltipProvider>
          {/* 显示网格 */}
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-300 text-sm flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  显示网格
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>显示/隐藏校准网格</p>
              </TooltipContent>
            </Tooltip>
            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
          </div>

          {/* 动画效果 */}
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  动画效果
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>启用/禁用动画效果</p>
              </TooltipContent>
            </Tooltip>
            <Switch checked={showAnimation} onCheckedChange={setShowAnimation} />
          </div>

          {/* 线条长度 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-300 text-sm flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    线条长度
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>调整校准线长度 (50-150)</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-gray-300 text-sm">{lineLength}</span>
            </div>
            <Slider
              value={[lineLength]}
              onValueChange={(value) =>
                handleValueChange(value[0], "lineLength", setLineLength)
              }
              min={50}
              max={150}
              step={1}
              className="flex-grow"
            />
          </div>

          {/* 自动旋转 */}
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-300 text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  自动旋转
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>启用/禁用自动旋转</p>
              </TooltipContent>
            </Tooltip>
            <Switch checked={autoRotate} onCheckedChange={setAutoRotate} />
          </div>

          {/* 旋转速度 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">旋转速度</span>
              <span className="text-gray-300 text-sm">{rotationSpeed}°/s</span>
            </div>
            <Slider
              value={[rotationSpeed]}
              onValueChange={(value) =>
                handleValueChange(value[0], "rotationSpeed", setRotationSpeed)
              }
              min={0}
              max={10}
              step={0.1}
              disabled={!autoRotate}
              className="flex-grow"
            />
          </div>

          {/* 缩放级别 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm flex items-center gap-2">
                {zoomLevel >= 1 ? (
                  <ZoomIn className="w-4 h-4" />
                ) : (
                  <ZoomOut className="w-4 h-4" />
                )}
                缩放级别
              </span>
              <span className="text-gray-300 text-sm">{zoomLevel}x</span>
            </div>
            <Slider
              value={[zoomLevel]}
              onValueChange={(value) =>
                handleValueChange(value[0], "zoomLevel", setZoomLevel)
              }
              min={0.5}
              max={2}
              step={0.1}
              className="flex-grow"
            />
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleRecalibrate}
              variant="destructive"
              className="w-full text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重新校准
            </Button>
            <Button
              onClick={() => setAutoRotate(!autoRotate)}
              variant="outline"
              className="w-full text-sm flex items-center gap-2"
            >
              {autoRotate ? (
                <>
                  <Pause className="w-4 h-4" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  开始
                </>
              )}
            </Button>
          </div>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
