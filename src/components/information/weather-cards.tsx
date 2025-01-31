import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Thermometer,
  Droplet,
  Wind,
  Cloud,
  Sun,
  ThermometerSun,
  Sunrise,
  Sunset,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  uvi: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

interface WeatherCardsProps {
  weatherData: WeatherData;
  units: "metric" | "imperial";
}

const WeatherCards: React.FC<WeatherCardsProps> = ({ weatherData, units }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">温度</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Thermometer className="w-4 h-4" />
          <span className="text-lg">
            {weatherData.temperature.toFixed(1)}°
            {units === "metric" ? "C" : "F"}
          </span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">湿度</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Droplet className="w-4 h-4" />
          <span className="text-lg">{weatherData.humidity}%</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">风速</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Wind className="w-4 h-4" />
          <span className="text-lg">
            {weatherData.windSpeed.toFixed(1)}{" "}
            {units === "metric" ? "m/s" : "mph"}
          </span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">云量</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Cloud className="w-4 h-4" />
          <span className="text-lg">{weatherData.cloudCover}%</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">紫外线指数</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Sun className="w-4 h-4" />
          <span className="text-lg">{weatherData.uvi}</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">气压</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <ThermometerSun className="w-4 h-4" />
          <span className="text-lg">{weatherData.pressure} hPa</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">日出</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Sunrise className="w-4 h-4" />
          <span className="text-lg">{weatherData.sunrise}</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">日落</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex items-center space-x-2">
          <Sunset className="w-4 h-4" />
          <span className="text-lg">{weatherData.sunset}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCards;
