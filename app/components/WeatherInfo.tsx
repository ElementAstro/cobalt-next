import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cloud, Thermometer, Wind, Droplet, Sun } from "lucide-react";

interface WeatherInfoProps {
  onClose: () => void;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  description: string;
}

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your actual API key
const CITY = "London"; // Replace with the desired city

export function WeatherInfo({ onClose }: WeatherInfoProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          cloudCover: data.clouds.all,
          description: data.weather[0].description,
        });
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Weather Information for {CITY}</DialogTitle>
        </DialogHeader>
        {weatherData ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-6 h-6" />
              <span>Temperature: {weatherData.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplet className="w-6 h-6" />
              <span>Humidity: {weatherData.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-6 h-6" />
              <span>Wind Speed: {weatherData.windSpeed} m/s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cloud className="w-6 h-6" />
              <span>Cloud Cover: {weatherData.cloudCover}%</span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Sun className="w-6 h-6" />
              <span>Description: {weatherData.description}</span>
            </div>
          </div>
        ) : (
          <div>Loading weather data...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
