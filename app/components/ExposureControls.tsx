import React, { useReducer, useEffect, useState } from "react";
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
};

type Action =
  | { type: "SET_EXPOSURE_TIME"; payload: number }
  | { type: "TOGGLE_BURST_MODE"; payload: boolean }
  | { type: "SET_BURST_COUNT"; payload: number }
  | { type: "TOGGLE_INTERVAL_MODE"; payload: boolean }
  | { type: "SET_INTERVAL_TIME"; payload: number }
  | { type: "SET_EXPOSURE_MODE"; payload: string }
  | { type: "SET_WHITE_BALANCE"; payload: string }
  | { type: "RESET"; payload: ExposureSettings };

const initialState = (settings: ExposureSettings): State => ({
  exposureTime: settings.exposureTime,
  burstMode: false,
  burstCount: 3,
  intervalMode: false,
  intervalTime: 60,
  exposureMode: settings.exposureMode || "Manual",
  whiteBalance: settings.whiteBalance || "Auto",
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
    const [collapsed, setCollapsed] = useState(true);

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

    const handleIntervalTimeChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = Number(e.target.value);
      if (value >= 5 && value <= 3600) {
        dispatch({ type: "SET_INTERVAL_TIME", payload: value });
      }
    };

    const handleExposureModeChange = (value: string) => {
      dispatch({ type: "SET_EXPOSURE_MODE", payload: value });
    };

    const handleWhiteBalanceChange = (value: string) => {
      dispatch({ type: "SET_WHITE_BALANCE", payload: value });
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
      <div className="flex flex-col items-center justify-center h-full p-4  rounded-lg shadow-lg">
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
                  <Label htmlFor="exposureMode">曝光模式</Label>
                  <Select
                    value={state.exposureMode}
                    onValueChange={handleExposureModeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择曝光模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">手动</SelectItem>
                      <SelectItem value="Auto">自动</SelectItem>
                      <SelectItem value="Aperture Priority">
                        光圈优先
                      </SelectItem>
                      <SelectItem value="Shutter Priority">快门优先</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="whiteBalance">白平衡</Label>
                  <Select
                    value={state.whiteBalance}
                    onValueChange={handleWhiteBalanceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择白平衡" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto">自动</SelectItem>
                      <SelectItem value="Incandescent">白炽灯</SelectItem>
                      <SelectItem value="Fluorescent">荧光灯</SelectItem>
                      <SelectItem value="Daylight">日光</SelectItem>
                      <SelectItem value="Shade">阴影</SelectItem>
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

export default ExposureControls;
