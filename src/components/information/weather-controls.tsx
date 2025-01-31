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
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex-1 min-w-[200px] flex items-center space-x-2">
        <Select value={city} onValueChange={(value) => setCity(value)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="选择城市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="London">伦敦</SelectItem>
            <SelectItem value="Beijing">北京</SelectItem>
            <SelectItem value="New York">纽约</SelectItem>
            {/* 添加更多城市 */}
          </SelectContent>
        </Select>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={handleGeolocation}>
            <Locate className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchWeatherData}
            disabled={loading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={units}
          onValueChange={(value) => setUnits(value as "metric" | "imperial")}
        >
          <SelectTrigger className="h-9 w-20">
            <SelectValue placeholder="单位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">公制</SelectItem>
            <SelectItem value="imperial">英制</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAPI} onValueChange={setSelectedAPI}>
          <SelectTrigger className="h-9 w-32">
            <SelectValue placeholder="API" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_APIS.map((api) => (
              <SelectItem key={api.name} value={api.name}>
                {api.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeatherControls;
