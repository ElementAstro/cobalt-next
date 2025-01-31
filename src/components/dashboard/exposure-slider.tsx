import React, { useRef, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Span } from "@/components/custom/span";
import { Eye, FastForward, History, Maximize2, Sliders } from "lucide-react";
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
      className="w-full p-4 bg-gray-800 rounded-lg shadow-md relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 调整顶部按钮样式 */}
      <div className="absolute top-2 right-2 flex gap-2">
        {settings.showFullscreen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
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
              className="text-gray-300 hover:text-white hover:bg-gray-700"
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
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <RedoIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-gray-800 border-gray-700">
            <motion.div
              className="space-y-6 p-4 bg-gray-900/60 backdrop-blur rounded-lg border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-gray-400" />
                <h4 className="font-medium text-gray-200">滑块设置</h4>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Span
                    icon={Eye}
                    tooltip="在滑动时显示数值提示"
                    variant="default"
                    size="sm"
                  >
                    显示提示
                  </Span>
                  <Switch
                    checked={settings.showTooltips}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, showTooltips: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Span
                    icon={FastForward}
                    tooltip="调整滑块动画速度"
                    variant="default"
                    size="sm"
                  >
                    动画速度
                  </Span>
                  <Select
                    value={settings.animationSpeed.toString()}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        animationSpeed: parseFloat(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.1">快速</SelectItem>
                      <SelectItem value="0.3">正常</SelectItem>
                      <SelectItem value="0.5">慢速</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Span
                      icon={Eye}
                      tooltip="自动吸附到预设值"
                      variant="default"
                      size="sm"
                    >
                      吸附预设
                    </Span>
                    <Switch
                      checked={settings.snapToPresets}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, snapToPresets: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Span
                      icon={Eye}
                      tooltip="显示实时预览"
                      variant="default"
                      size="sm"
                    >
                      显示预览
                    </Span>
                    <Switch
                      checked={settings.showPreview}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, showPreview: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Span
                      icon={History}
                      tooltip="显示历史记录"
                      variant="default"
                      size="sm"
                    >
                      显示历史
                    </Span>
                    <Switch
                      checked={settings.showHistory}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, showHistory: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Span
                      icon={Maximize2}
                      tooltip="允许全屏显示"
                      variant="default"
                      size="sm"
                    >
                      允许全屏
                    </Span>
                    <Switch
                      checked={settings.showFullscreen}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, showFullscreen: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </PopoverContent>
        </Popover>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-200">
        Exposure Time
      </h2>
      <div className="flex items-center justify-between mb-2 text-xs sm:text-sm text-gray-300">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium text-gray-300 cursor-help">
              1/{Math.pow(2, -MIN_EXPOSURE)}s
            </span>
          </TooltipTrigger>
          <TooltipContent>Minimum exposure time</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium text-gray-300 cursor-help">
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
              left: `${
                ((exposureValue - MIN_EXPOSURE) /
                  (MAX_EXPOSURE - MIN_EXPOSURE)) *
                100
              }%`,
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
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handlePresetClick(value)}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm w-full sm:w-auto bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
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
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <HistoryIcon className="mr-2 h-4 w-4" />
            View History
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-gray-800 border-gray-700">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-200 leading-none">
              Adjustment History
            </h4>
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
