"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Locate, RefreshCcw, Settings } from "lucide-react";

interface WeatherControlsProps {
  city: string;
  setCity: (city: string) => void;
  units: "metric" | "imperial";
  setUnits: (units: "metric" | "imperial") => void;
  selectedAPI: string;
  setSelectedAPI: (api: string) => void;
  handleGeolocation: () => void;
  fetchWeatherData: () => void;
  loading: boolean;
  setShowSettings: (show: boolean) => void;
  AVAILABLE_APIS: { name: string }[];
}

const WeatherControls: React.FC<WeatherControlsProps> = ({
  city,
  setCity,
  units,
  setUnits,
  selectedAPI,
  setSelectedAPI,
  handleGeolocation,
  fetchWeatherData,
  loading,
  setShowSettings,
  AVAILABLE_APIS,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-2">
        <Select value={city} onValueChange={(value) => setCity(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="选择城市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="London">伦敦</SelectItem>
            <SelectItem value="Beijing">北京</SelectItem>
            <SelectItem value="New York">纽约</SelectItem>
            {/* 添加更多城市 */}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGeolocation}
          aria-label="获取当前位置天气"
        >
          <Locate className="h-5 w-5 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchWeatherData}
          aria-label="刷新天气数据"
          disabled={loading}
        >
          <RefreshCcw
            className={`h-5 w-5 text-white ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={units}
          onValueChange={(value) => setUnits(value as "metric" | "imperial")}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="选择单位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">公制</SelectItem>
            <SelectItem value="imperial">英制</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedAPI}
          onValueChange={(value) => setSelectedAPI(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="选择 API" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_APIS.map((api) => (
              <SelectItem key={api.name} value={api.name}>
                {api.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          aria-label="设置"
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default WeatherControls;
