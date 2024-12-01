import React, { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, X, Save, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PolarAlignmentProps {
  onClose: () => void;
  initialAzimuth?: number;
  initialAltitude?: number;
  azimuthRange?: { min: number; max: number; step: number };
  altitudeRange?: { min: number; max: number; step: number };
  onAlignSuccess?: (azimuth: number, altitude: number) => void;
}

const PolarAlignment: React.FC<PolarAlignmentProps> = memo(
  ({
    onClose,
    initialAzimuth = 0,
    initialAltitude = 0,
    azimuthRange = { min: -180, max: 180, step: 0.1 },
    altitudeRange = { min: 0, max: 90, step: 0.1 },
    onAlignSuccess,
  }) => {
    const [azimuth, setAzimuth] = useState(initialAzimuth);
    const [altitude, setAltitude] = useState(initialAltitude);
    const [aligning, setAligning] = useState(false);
    const [success, setSuccess] = useState(false);
    const [presets, setPresets] = useState<
      { azimuth: number; altitude: number }[]
    >([]);

    const handleAlign = useCallback(() => {
      setAligning(true);
      // 模拟对齐过程
      setTimeout(() => {
        setAligning(false);
        setSuccess(true);
        onAlignSuccess && onAlignSuccess(azimuth, altitude);
      }, 2000);
    }, [azimuth, altitude, onAlignSuccess]);

    const handleSavePreset = useCallback(() => {
      setPresets((prev) => [...prev, { azimuth, altitude }]);
    }, [azimuth, altitude]);

    const handleLoadPreset = useCallback(
      (preset: { azimuth: number; altitude: number }) => {
        setAzimuth(preset.azimuth);
        setAltitude(preset.altitude);
      },
      []
    );

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <AnimatePresence>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">Polar Alignment</DialogTitle>
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
              <div>
                <label
                  htmlFor="azimuth"
                  className="block text-sm font-medium text-white"
                >
                  Azimuth
                </label>
                <Slider
                  id="azimuth"
                  min={azimuthRange.min}
                  max={azimuthRange.max}
                  step={azimuthRange.step}
                  value={[azimuth]}
                  onValueChange={(value) => setAzimuth(value[0])}
                />
                <p className="mt-1 text-sm text-white">{azimuth.toFixed(1)}°</p>
              </div>
              <div>
                <label
                  htmlFor="altitude"
                  className="block text-sm font-medium text-white"
                >
                  Altitude
                </label>
                <Slider
                  id="altitude"
                  min={altitudeRange.min}
                  max={altitudeRange.max}
                  step={altitudeRange.step}
                  value={[altitude]}
                  onValueChange={(value) => setAltitude(value[0])}
                />
                <p className="mt-1 text-sm text-white">
                  {altitude.toFixed(1)}°
                </p>
              </div>
              {/* 预设按钮 */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleSavePreset}
                  variant="secondary"
                  size="sm"
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
                    aria-label={`加载预设 ${index + 1}`}
                  >
                    <Check className="h-4 w-4 mr-1" /> 预设 {index + 1}
                  </Button>
                ))}
              </div>
              {/* 对齐按钮 */}
              <Button
                onClick={handleAlign}
                disabled={aligning}
                className="w-full"
              >
                {aligning ? (
                  <>
                    <RefreshCcw className="h-5 w-5 mr-2 animate-spin" />{" "}
                    Aligning...
                  </>
                ) : (
                  "Align Mount"
                )}
              </Button>
              {/* 对齐成功消息 */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Check className="h-5 w-5" />
                  <span>Mount aligned successfully!</span>
                </motion.div>
              )}
            </div>
          </DialogContent>
        </AnimatePresence>
      </Dialog>
    );
  }
);

PolarAlignment.displayName = "PolarAlignment";

export default PolarAlignment;
