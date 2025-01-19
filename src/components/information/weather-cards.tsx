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
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <Card className="bg-gray-700 text-white">
        <CardHeader>
          <CardTitle>温度</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Thermometer className="w-6 h-6" />
          <span>
            {weatherData.temperature.toFixed(1)}°
            {units === "metric" ? "C" : "F"}
          </span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>湿度</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Droplet className="w-6 h-6" />
          <span>{weatherData.humidity}%</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader>
          <CardTitle>风速</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Wind className="w-6 h-6" />
          <span>
            {weatherData.windSpeed.toFixed(1)}{" "}
            {units === "metric" ? "m/s" : "mph"}
          </span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white">
        <CardHeader>
          <CardTitle>云量</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Cloud className="w-6 h-6" />
          <span>{weatherData.cloudCover}%</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>紫外线指数</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Sun className="w-6 h-6" />
          <span>{weatherData.uvi}</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>气压</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <ThermometerSun className="w-6 h-6" />
          <span>{weatherData.pressure} hPa</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>日出</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Sunrise className="w-6 h-6" />
          <span>{weatherData.sunrise}</span>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 text-white hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>日落</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Sunset className="w-6 h-6" />
          <span>{weatherData.sunset}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCards;
