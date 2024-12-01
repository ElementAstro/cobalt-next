import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, Save, RefreshCcw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveStackingProps {
  onClose: () => void;
  initialStackedImages?: number;
  initialSNR?: number;
  maxSNR?: number;
  stackingInterval?: number; // stacking interval in milliseconds
}

const LiveStacking: React.FC<LiveStackingProps> = memo(
  ({
    onClose,
    initialStackedImages = 0,
    initialSNR = 0,
    maxSNR = 100,
    stackingInterval = 5000,
  }) => {
    const [isStacking, setIsStacking] = useState(false);
    const [stackedImages, setStackedImages] = useState(initialStackedImages);
    const [snr, setSNR] = useState(initialSNR);
    const [presets, setPresets] = useState<
      { stackedImages: number; snr: number }[]
    >([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleStartStopStacking = useCallback(() => {
      if (isStacking) {
        setIsStacking(false);
      } else {
        setIsStacking(true);
        setSuccess(false);
        setError(null);
      }
    }, [isStacking]);

    const handleStacking = useCallback(() => {
      if (snr >= maxSNR) {
        setIsStacking(false);
        setSuccess(true);
        return;
      }

      // 模拟可能发生的错误
      const shouldError = Math.random() < 0.1; // 10% 概率出错
      if (shouldError) {
        setIsStacking(false);
        setError("对齐过程中发生错误，请重试。");
        return;
      }

      setStackedImages((prev) => prev + 1);
      setSNR((prev) => Math.min(maxSNR, prev + Math.random() * 5));
    }, [snr, maxSNR]);

    useEffect(() => {
      if (isStacking) {
        const interval = setInterval(handleStacking, stackingInterval);
        return () => clearInterval(interval);
      }
    }, [isStacking, handleStacking, stackingInterval]);

    const handleSavePreset = useCallback(() => {
      setPresets((prev) => [...prev, { stackedImages, snr }]);
    }, [stackedImages, snr]);

    const handleLoadPreset = useCallback(
      (preset: { stackedImages: number; snr: number }) => {
        setStackedImages(preset.stackedImages);
        setSNR(preset.snr);
        setSuccess(false);
        setError(null);
      },
      []
    );

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <AnimatePresence>
          <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Live Stacking</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="关闭对齐"
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            </DialogHeader>
            <div className="space-y-4 text-white">
              {/* 堆叠图像数量 */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">堆叠图像数量</h3>
                <p className="text-3xl font-bold">{stackedImages}</p>
              </div>

              {/* 信噪比进度条 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">信噪比 (SNR)</h4>
                <Progress value={(snr / maxSNR) * 100} className="w-full" />
                <p className="text-sm text-right">{snr.toFixed(2)}%</p>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="flex items-center space-x-2 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 成功提示 */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Check className="h-5 w-5" />
                  <span>堆叠成功完成！</span>
                </motion.div>
              )}

              {/* 预设按钮 */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleSavePreset}
                  variant="secondary"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600"
                  aria-label="保存预设"
                >
                  <Save className="h-4 w-4 mr-1" /> 保存预设
                </Button>
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    onClick={() => handleLoadPreset(preset)}
                    variant="ghost"
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600"
                    aria-label={`加载预设 ${index + 1}`}
                  >
                    <Check className="h-4 w-4 mr-1" /> 预设 {index + 1}
                  </Button>
                ))}
              </div>

              {/* 对齐控制按钮 */}
              <Button
                onClick={handleStartStopStacking}
                disabled={success}
                className="w-full bg-gray-700 hover:bg-gray-600"
              >
                {isStacking ? (
                  <>
                    <RefreshCcw className="h-5 w-5 mr-2 animate-spin" />{" "}
                    停止堆叠
                  </>
                ) : (
                  "开始堆叠"
                )}
              </Button>
            </div>
          </DialogContent>
        </AnimatePresence>
      </Dialog>
    );
  }
);

LiveStacking.displayName = "LiveStacking";

export default LiveStacking;
