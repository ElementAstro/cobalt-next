import React, { useReducer, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
import { Camera, Pause, Play, RefreshCw, Settings } from "lucide-react";

interface ExposureSettings {
  shutterSpeed: string;
  iso: string;
  aperture: string;
  focusPoint: string;
  filterType: string;
  exposureTime: number;
  exposureMode: string;
  whiteBalance: string;
  gain: number;
  offset: number;
  binning: string;
}

interface ExposureControlsProps {
  settings: ExposureSettings;
  onParameterClick: (parameter: string) => void;
  onCapture: (
    exposureTime: number,
    burstMode: boolean,
    exposureMode: string,
    whiteBalance: string
  ) => void;
  onPause: () => void;
  isShooting: boolean;
  isPaused: boolean;
  progress: number;
}

type State = {
  exposureTime: number;
  burstMode: boolean;
  burstCount: number;
  intervalMode: boolean;
  intervalTime: number;
  exposureMode: string;
  whiteBalance: string;
  iso: number;
  aperture: number;
  focusPoint: number;
  filterType: string;
  gain: number;
  offset: number;
  binning: string;
};

type Action =
  | { type: "SET_EXPOSURE_TIME"; payload: number }
  | { type: "TOGGLE_BURST_MODE"; payload: boolean }
  | { type: "SET_BURST_COUNT"; payload: number }
  | { type: "TOGGLE_INTERVAL_MODE"; payload: boolean }
  | { type: "SET_INTERVAL_TIME"; payload: number }
  | { type: "SET_EXPOSURE_MODE"; payload: string }
  | { type: "SET_WHITE_BALANCE"; payload: string }
  | { type: "SET_ISO"; payload: number }
  | { type: "SET_APERTURE"; payload: number }
  | { type: "SET_FOCUS_POINT"; payload: number }
  | { type: "SET_FILTER_TYPE"; payload: string }
  | { type: "SET_GAIN"; payload: number }
  | { type: "SET_OFFSET"; payload: number }
  | { type: "SET_BINNING"; payload: string }
  | { type: "RESET"; payload: ExposureSettings };

const initialState = (settings: ExposureSettings): State => ({
  exposureTime: settings.exposureTime,
  burstMode: false,
  burstCount: 3,
  intervalMode: false,
  intervalTime: 60,
  exposureMode: settings.exposureMode || "Manual",
  whiteBalance: settings.whiteBalance || "Auto",
  iso: parseInt(settings.iso) || 100,
  aperture: parseFloat(settings.aperture) || 2.8,
  focusPoint: parseInt(settings.focusPoint) || 50,
  filterType: settings.filterType || "None",
  gain: settings.gain || 0,
  offset: settings.offset || 0,
  binning: settings.binning || "1x1",
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EXPOSURE_TIME":
      return { ...state, exposureTime: action.payload };
    case "TOGGLE_BURST_MODE":
      return { ...state, burstMode: action.payload };
    case "SET_BURST_COUNT":
      return { ...state, burstCount: action.payload };
    case "TOGGLE_INTERVAL_MODE":
      return { ...state, intervalMode: action.payload };
    case "SET_INTERVAL_TIME":
      return { ...state, intervalTime: action.payload };
    case "SET_EXPOSURE_MODE":
      return { ...state, exposureMode: action.payload };
    case "SET_WHITE_BALANCE":
      return { ...state, whiteBalance: action.payload };
    case "SET_ISO":
      return { ...state, iso: action.payload };
    case "SET_APERTURE":
      return { ...state, aperture: action.payload };
    case "SET_FOCUS_POINT":
      return { ...state, focusPoint: action.payload };
    case "SET_FILTER_TYPE":
      return { ...state, filterType: action.payload };
    case "SET_GAIN":
      return { ...state, gain: action.payload };
    case "SET_OFFSET":
      return { ...state, offset: action.payload };
    case "SET_BINNING":
      return { ...state, binning: action.payload };
    case "RESET":
      return initialState(action.payload);
    default:
      return state;
  }
};

const ExposureControls: React.FC<ExposureControlsProps> = React.memo(
  ({
    settings,
    onParameterClick,
    onCapture,
    onPause,
    isShooting,
    isPaused,
    progress,
  }) => {
    const [state, dispatch] = useReducer(reducer, settings, initialState);

    useEffect(() => {
      dispatch({ type: "RESET", payload: settings });
    }, [settings]);

    const handleExposureTimeChange = (value: number[]) => {
      dispatch({ type: "SET_EXPOSURE_TIME", payload: value[0] });
    };

    const handleBurstCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (value >= 2 && value <= 10) {
        dispatch({ type: "SET_BURST_COUNT", payload: value });
      }
    };

    const handleFilterTypeChange = (value: string) => {
      dispatch({ type: "SET_FILTER_TYPE", payload: value });
    };

    const handleGainChange = (value: number[]) => {
      dispatch({ type: "SET_GAIN", payload: value[0] });
    };

    const handleOffsetChange = (value: number[]) => {
      dispatch({ type: "SET_OFFSET", payload: value[0] });
    };

    const handleBinningChange = (value: string) => {
      dispatch({ type: "SET_BINNING", payload: value });
    };

    const handleReset = () => {
      dispatch({ type: "RESET", payload: settings });
    };

    const handleCaptureClick = () => {
      onCapture(
        state.exposureTime,
        state.burstMode,
        state.exposureMode,
        state.whiteBalance
      );
    };

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 rounded-lg shadow-lg">
        <div className="flex justify-end w-full mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="left"
              className="w-80 p-4 bg-gray-800 text-white rounded-md shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="burstMode">连拍模式</Label>
                  <Switch
                    id="burstMode"
                    checked={state.burstMode}
                    onCheckedChange={(checked) =>
                      dispatch({
                        type: "TOGGLE_BURST_MODE",
                        payload: checked,
                      })
                    }
                  />
                </div>
                {state.burstMode && (
                  <div className="flex flex-col">
                    <Label htmlFor="burstCount">连拍次数</Label>
                    <Input
                      id="burstCount"
                      type="number"
                      min="2"
                      max="10"
                      value={state.burstCount}
                      onChange={handleBurstCountChange}
                      className="mt-1"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <Label htmlFor="exposureTime">曝光时间 (秒)</Label>
                  <Slider
                    id="exposureTime"
                    min={1}
                    max={3600}
                    step={1}
                    value={[state.exposureTime]}
                    onValueChange={handleExposureTimeChange}
                    className="mt-2"
                  />
                  <div className="text-sm text-right">
                    {state.exposureTime} 秒
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="filterType">滤镜类型</Label>
                  <Select
                    value={state.filterType}
                    onValueChange={handleFilterTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择滤镜类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">无</SelectItem>
                      <SelectItem value="Black and White">黑白</SelectItem>
                      <SelectItem value="Sepia">棕褐色</SelectItem>
                      <SelectItem value="Vivid">鲜艳</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="gain">增益</Label>
                  <Slider
                    id="gain"
                    min={0}
                    max={100}
                    step={1}
                    value={[state.gain]}
                    onValueChange={handleGainChange}
                    className="mt-2"
                  />
                  <div className="text-sm text-right">{state.gain}</div>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="offset">偏置</Label>
                  <Slider
                    id="offset"
                    min={0}
                    max={100}
                    step={1}
                    value={[state.offset]}
                    onValueChange={handleOffsetChange}
                    className="mt-2"
                  />
                  <div className="text-sm text-right">{state.offset}</div>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="binning">像素合并</Label>
                  <Select
                    value={state.binning}
                    onValueChange={handleBinningChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择像素合并" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1x1">1x1</SelectItem>
                      <SelectItem value="2x2">2x2</SelectItem>
                      <SelectItem value="3x3">3x3</SelectItem>
                      <SelectItem value="4x4">4x4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center space-x-2"
                  onClick={handleReset}
                >
                  <RefreshCw />
                  <span>重置</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mb-4"
        >
          <Button
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 flex items-center justify-center space-x-2"
            onClick={handleCaptureClick}
            disabled={isShooting}
          >
            <Camera />
          </Button>
        </motion.div>
        {isShooting && (
          <>
            <Progress value={progress} className="w-full mb-4" />
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 flex items-center justify-center space-x-2"
              onClick={onPause}
            >
              {isPaused ? <Play /> : <Pause />}
            </Button>
          </>
        )}
        <Button
          variant="secondary"
          className="w-full mt-4 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleReset}
        >
          <RefreshCw />
        </Button>
      </div>
    );
  }
);

ExposureControls.displayName = "ExposureControls";

export default ExposureControls;
