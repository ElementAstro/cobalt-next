import React, { useRef, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExposureStore } from "@/store/useDashboardStore";
import { Timer, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
  exposureTime: number;
  iso: number;
  aperture: number;
  timestamp: Date;
}

const MIN_EXPOSURE = 0.001;
const MAX_EXPOSURE = 3600;
const PRESET_VALUES = [0.001, 0.01, 0.1, 1, 10, 30, 60, 300, 600, 1800, 3600];

export function ExposureTimeSlider() {
  const {
    exposureTime,
    iso,
    aperture,
    setExposureTime,
    setISO,
    setAperture,
    exposureMode,
    setExposureMode,
  } = useExposureStore();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const addToHistory = () => {
    const newHistoryItem = {
      exposureTime,
      iso,
      aperture,
      timestamp: new Date(),
    };
    const newHistory = [...history.slice(0, historyIndex + 1), newHistoryItem];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setExposureTime(prevState.exposureTime);
      setISO(prevState.iso);
      setAperture(prevState.aperture);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setExposureTime(nextState.exposureTime);
      setISO(nextState.iso);
      setAperture(nextState.aperture);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleExposureChange = (value: number) => {
    setExposureTime(value);
    addToHistory();
  };

  const handleISOChange = (value: number) => {
    setISO(value);
    addToHistory();
  };

  const handleApertureChange = (value: number) => {
    setAperture(value);
    addToHistory();
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          ref={containerRef}
          className="bg-gray-900 border-gray-800 transition-shadow hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <motion.div
              className="flex items-center justify-between"
              layoutId="header"
            >
              <CardTitle className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Timer className="w-5 h-5" />
                </motion.div>
                <span>Exposure</span>
              </CardTitle>
              <Select value={exposureMode} onValueChange={setExposureMode}>
                <SelectTrigger className="w-28 h-8 bg-gray-800 border-gray-700 transition-colors hover:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Auto">Auto</SelectItem>
                  <SelectItem value="Bulb">Bulb</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={exposureMode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Exposure Controls */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4">
                  <Label className="w-24 text-gray-300">Exposure Time</Label>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Slider
                      value={[exposureTime]}
                      onValueChange={(values) =>
                        handleExposureChange(values[0])
                      }
                      max={MAX_EXPOSURE}
                      min={MIN_EXPOSURE}
                      step={0.1}
                      disabled={exposureMode === "Auto"}
                      className="flex-1"
                    />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Input
                        type="number"
                        value={exposureTime}
                        onChange={(e) =>
                          handleExposureChange(Number(e.target.value))
                        }
                        min={MIN_EXPOSURE}
                        max={MAX_EXPOSURE}
                        step={0.1}
                        className="w-20 h-8 bg-gray-800 border-gray-700 transition-colors focus:border-blue-500"
                        disabled={exposureMode === "Auto"}
                      />
                    </motion.div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-gray-800 border-gray-700 transition-colors hover:bg-gray-700"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 grid grid-cols-4 gap-1 p-2 bg-gray-800 border-gray-700">
                        {PRESET_VALUES.map((value) => (
                          <Tooltip key={value}>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  onClick={() => handleExposureChange(value)}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs w-full bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
                                >
                                  {value}s
                                </Button>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>Set to {value}s</TooltipContent>
                          </Tooltip>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* ISO Controls with Animation */}
                <motion.div
                  className="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label className="w-24 text-gray-300">ISO</Label>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Slider
                      value={[iso]}
                      onValueChange={(values) => handleISOChange(values[0])}
                      max={6400}
                      min={100}
                      step={100}
                      disabled={exposureMode === "Auto"}
                      className="flex-1"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Input
                      type="number"
                      value={iso}
                      onChange={(e) => handleISOChange(Number(e.target.value))}
                      min={100}
                      max={6400}
                      step={100}
                      className="w-20 h-8 bg-gray-800 border-gray-700 transition-colors focus:border-blue-500"
                      disabled={exposureMode === "Auto"}
                    />
                  </motion.div>
                </motion.div>

                {/* Aperture Controls with Animation */}
                <motion.div
                  className="grid grid-cols-[auto_1fr_auto] gap-4 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="w-24 text-gray-300">Aperture</Label>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Slider
                      value={[aperture]}
                      onValueChange={(values) =>
                        handleApertureChange(values[0])
                      }
                      max={22}
                      min={1.4}
                      step={0.1}
                      disabled={exposureMode === "Auto"}
                      className="flex-1"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Input
                      type="number"
                      value={aperture}
                      onChange={(e) =>
                        handleApertureChange(Number(e.target.value))
                      }
                      min={1.4}
                      max={22}
                      step={0.1}
                      className="w-20 h-8 bg-gray-800 border-gray-700 transition-colors focus:border-blue-500"
                      disabled={exposureMode === "Auto"}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
