import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExposureSettings {
  shutterSpeed: string;
  iso: string;
  aperture: string;
  focusPoint: string;
  filterType: string;
  exposureTime: number;
}

interface ExposureControlsProps {
  settings: ExposureSettings;
  onParameterClick: (parameter: string) => void;
  onCapture: (exposureTime: number, burstMode: boolean) => void;
  onPause: () => void;
  isShooting: boolean;
  isPaused: boolean;
  progress: number;
}

export default function ExposureControls({
  settings,
  onParameterClick,
  onCapture,
  onPause,
  isShooting,
  isPaused,
  progress,
}: ExposureControlsProps) {
  const [exposureTime, setExposureTime] = useState(settings.exposureTime);
  const [burstMode, setBurstMode] = useState(false);
  const [burstCount, setBurstCount] = useState(3);
  const [intervalMode, setIntervalMode] = useState(false);
  const [intervalTime, setIntervalTime] = useState(60);

  useEffect(() => {
    setExposureTime(settings.exposureTime);
  }, [settings.exposureTime]);

  const handleExposureTimeChange = (value: number[]) => {
    setExposureTime(value[0]);
  };

  const handleBurstCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBurstCount(Number(e.target.value));
  };

  const handleIntervalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntervalTime(Number(e.target.value));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="flex-grow space-y-4">
        {Object.entries(settings).map(
          ([key, value]) =>
            key !== "exposureTime" && (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center p-3 h-auto"
                  onClick={() => onParameterClick(key)}
                >
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-bold">{value}</span>
                </Button>
              </motion.div>
            )
        )}
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="exposureTime">Exposure Time (seconds)</Label>
          <Slider
            id="exposureTime"
            min={1}
            max={3600}
            step={1}
            value={[exposureTime]}
            onValueChange={handleExposureTimeChange}
          />
          <div className="text-sm text-right">{exposureTime} seconds</div>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="burstMode">Burst Mode</Label>
          <Switch
            id="burstMode"
            checked={burstMode}
            onCheckedChange={setBurstMode}
          />
        </div>
        {burstMode && (
          <div className="space-y-2">
            <Label htmlFor="burstCount">Burst Count</Label>
            <Input
              id="burstCount"
              type="number"
              min="2"
              max="10"
              value={burstCount}
              onChange={handleBurstCountChange}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label htmlFor="intervalMode">Interval Mode</Label>
          <Switch
            id="intervalMode"
            checked={intervalMode}
            onCheckedChange={setIntervalMode}
          />
        </div>
        {intervalMode && (
          <div className="space-y-2">
            <Label htmlFor="intervalTime">Interval Time (seconds)</Label>
            <Input
              id="intervalTime"
              type="number"
              min="5"
              max="3600"
              value={intervalTime}
              onChange={handleIntervalTimeChange}
            />
          </div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => onCapture(exposureTime, burstMode)}
            disabled={isShooting}
          >
            {isShooting
              ? isPaused
                ? "Resume Capture"
                : "Pause Capture"
              : `Start ${
                  burstMode ? "Burst" : intervalMode ? "Interval" : "Single"
                } Capture`}
          </Button>
        </motion.div>
        {isShooting && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <Button className="w-full" onClick={onPause}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
