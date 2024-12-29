import React, { useRef, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExposureTime } from "@/hooks/use-exposure-slider";
import { formatExposureTime } from "@/utils/format-exposure-time";
import { motion, useAnimation } from "framer-motion";
import {
  HistoryIcon,
  SettingsIcon,
  FullscreenIcon,
  UndoIcon,
  RedoIcon,
} from "lucide-react";

interface HistoryItem {
  value: number;
  timestamp: Date;
}

interface SliderSettings {
  showTooltips: boolean;
  animationSpeed: number;
  snapToPresets: boolean;
  showPreview: boolean;
  showHistory: boolean;
  showFullscreen: boolean;
}

export function ExposureTimeSlider() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState<SliderSettings>({
    showTooltips: true,
    animationSpeed: 0.3,
    snapToPresets: false,
    showPreview: true,
    showHistory: true,
    showFullscreen: true,
  });
  const {
    exposureValue,
    handleExposureChange,
    animateToValue,
    isAnimating,
    MIN_EXPOSURE,
    MAX_EXPOSURE,
    PRESET_VALUES,
  } = useExposureTime();

  const addToHistory = (value: number) => {
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      { value, timestamp: new Date() },
    ];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevValue = history[historyIndex - 1].value;
      animateToValue(prevValue);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextValue = history[historyIndex + 1].value;
      animateToValue(nextValue);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handleExposureChange(Math.max(exposureValue - 0.1, MIN_EXPOSURE));
    } else if (e.key === "ArrowRight") {
      handleExposureChange(Math.min(exposureValue + 0.1, MAX_EXPOSURE));
    } else if (e.key === "z" && e.ctrlKey) {
      handleUndo();
    } else if (e.key === "y" && e.ctrlKey) {
      handleRedo();
    }
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    controls.start({ opacity: 1, scale: 1 });
    addToHistory(exposureValue);
  }, [exposureValue]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handlePresetClick = (value: number) => {
    animateToValue(value);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= MIN_EXPOSURE && value <= MAX_EXPOSURE) {
      animateToValue(value);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        {settings.showFullscreen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <FullscreenIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle fullscreen</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <UndoIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <RedoIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <h4 className="font-medium">Slider Settings</h4>
              <div className="flex items-center justify-between">
                <label className="text-sm">Show Tooltips</label>
                <input
                  type="checkbox"
                  checked={settings.showTooltips}
                  onChange={(e) =>
                    setSettings({ ...settings, showTooltips: e.target.checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Animation Speed</label>
                <select
                  value={settings.animationSpeed}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      animationSpeed: parseFloat(e.target.value),
                    })
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={0.1}>Fast</option>
                  <option value={0.3}>Normal</option>
                  <option value={0.5}>Slow</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Snap to Presets</label>
                <input
                  type="checkbox"
                  checked={settings.snapToPresets}
                  onChange={(e) =>
                    setSettings({ ...settings, snapToPresets: e.target.checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Show Preview</label>
                <input
                  type="checkbox"
                  checked={settings.showPreview}
                  onChange={(e) =>
                    setSettings({ ...settings, showPreview: e.target.checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Show History</label>
                <input
                  type="checkbox"
                  checked={settings.showHistory}
                  onChange={(e) =>
                    setSettings({ ...settings, showHistory: e.target.checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Show Fullscreen</label>
                <input
                  type="checkbox"
                  checked={settings.showFullscreen}
                  onChange={(e) =>
                    setSettings({ ...settings, showFullscreen: e.target.checked })
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Exposure Time
      </h2>
      <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium text-gray-600 cursor-help">
              1/{Math.pow(2, -MIN_EXPOSURE)}s
            </span>
          </TooltipTrigger>
          <TooltipContent>Minimum exposure time</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium text-gray-600 cursor-help">
              {Math.pow(2, MAX_EXPOSURE)}s
            </span>
          </TooltipTrigger>
          <TooltipContent>Maximum exposure time</TooltipContent>
        </Tooltip>
      </div>
      <div ref={sliderRef} className="relative mb-4 group">
        <Slider
          value={[exposureValue]}
          onValueChange={(values) => handleExposureChange(values[0])}
          max={MAX_EXPOSURE}
          min={MIN_EXPOSURE}
          step={0.1}
          disabled={isAnimating}
          className="touch-none"
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          animate={controls}
          initial={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div
            className="absolute top-1/2 w-6 h-6 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg hover:scale-110 transition-transform"
            style={{
              left: `${((exposureValue - MIN_EXPOSURE) / (MAX_EXPOSURE - MIN_EXPOSURE)) * 100}%`,
            }}
          />
        </motion.div>
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <motion.div
          className="text-center"
          animate={controls}
          initial={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="text-2xl sm:text-3xl font-bold text-blue-600">
            {formatExposureTime(exposureValue)}
          </span>
        </motion.div>
        <Input
          type="number"
          value={exposureValue}
          onChange={handleManualInput}
          min={MIN_EXPOSURE}
          max={MAX_EXPOSURE}
          step={0.1}
          className="w-24"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center mb-4">
        {PRESET_VALUES.map((value) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                key={value}
                onClick={() => handlePresetClick(value)}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm w-full sm:w-auto"
              >
                {formatExposureTime(value)}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Set to {formatExposureTime(value)}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full">
            <HistoryIcon className="mr-2 h-4 w-4" />
            View History
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Adjustment History</h4>
            <div className="max-h-60 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={item.timestamp.toISOString()}
                  className={`flex justify-between items-center p-2 text-sm ${
                    index === historyIndex ? "bg-blue-50" : ""
                  }`}
                >
                  <span>{formatExposureTime(item.value)}</span>
                  <span className="text-gray-500">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
