"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherInfoHeader from "./weather-info-header";
import WeatherControls from "./weather-controls";
import WeatherCards from "./weather-cards";
import ForecastAccordion from "./forecast-accordion";
import TemperatureChart from "./temperature-chart";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Map,
  Sun,
  Moon,
  Wind,
  Droplet,
  Cloud,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StaticMap from "./static-map";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWeatherStore } from "@/store/information/weather";
import { toast } from "@/hooks/use-toast";

// 从环境变量获取 API key
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY;

interface WeatherInfoProps {
  onClose: () => void;
  initialCity?: string;
  initialUnits?: "metric" | "imperial";
  isMock?: boolean;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  cloudCover: number;
  description: string;
  uvi: number;
  pressure: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  forecast?: ForecastData[];
}

interface ForecastData {
  date: string;
  temperature: number;
  description: string;
}

interface WeatherAPI {
  name: string;
  fetchWeather: (
    city: string,
    units: string,
    apiKey: string
  ) => Promise<WeatherData>;
}

const DEFAULT_CITY = "Beijing";
const DEFAULT_API = "OpenWeatherMap";

const AVAILABLE_APIS: WeatherAPI[] = [
  {
    name: "OpenWeatherMap",
    fetchWeather: async (city, units) => {
      if (!OPENWEATHER_API_KEY) {
        throw new Error("未配置 OpenWeatherMap API 密钥。");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${units}`
      );
      if (!response.ok) {
        throw new Error("无法获取天气数据，请检查城市名称或 API 密钥。");
      }
      const data = await response.json();
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${units}`
      );
      const forecastData = await forecastResponse.json();
      const forecastList = forecastData.list.slice(0, 5).map((item: any) => ({
        date: item.dt_txt.split(" ")[0],
        temperature: item.main.temp,
        description: item.weather[0].description,
      }));
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        cloudCover: data.clouds.all,
        description: data.weather[0].description,
        uvi: data.uvi || 0,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        forecast: forecastList,
      };
    },
  },
  // 新增 WeatherAPI2
  {
    name: "WeatherAPI2",
    fetchWeather: async (city, units, apiKey) => {
      const response = await fetch(
        `https://api.weatherapi2.com/v1/forecast?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`
      );
      if (!response.ok) {
        throw new Error("无法获取天气数据，请检查城市名称或 API 密钥。");
      }
      const data = await response.json();
      const forecastList = data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        temperature: units === "metric" ? day.day.avgtemp_c : day.day.avgtemp_f,
        description: day.day.condition.text,
      }));
      return {
        temperature:
          units === "metric" ? data.current.temp_c : data.current.temp_f,
        humidity: data.current.humidity,
        windSpeed:
          units === "metric"
            ? data.current.wind_kph / 3.6
            : data.current.wind_mph,
        windDirection: data.current.wind_dir,
        cloudCover: data.current.cloud,
        description: data.current.condition.text,
        uvi: data.current.uv,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        sunrise: data.forecast.forecastday[0].astro.sunrise,
        sunset: data.forecast.forecastday[0].astro.sunset,
        forecast: forecastList,
      };
    },
  },
];

export const WeatherInfo: React.FC<WeatherInfoProps> = memo(
  ({ onClose, initialCity, initialUnits, isMock = false }) => {
    const {
      data: weatherData,
      loading,
      error,
      lastUpdated,
      city,
      units,
      selectedAPI,
      showSettings,
      showMap,
      darkMode,
      autoRefresh,
      refreshInterval,
      favorites,
      setCity,
      setUnits,
      setSelectedAPI,
      setShowSettings,
      setShowMap,
      toggleDarkMode,
      toggleAutoRefresh,
      setRefreshInterval,
      addToFavorites,
      removeFromFavorites,
      fetchWeatherData,
    } = useWeatherStore();

    useEffect(() => {
      if (initialCity) setCity(initialCity);
      if (initialUnits) setUnits(initialUnits);
    }, [initialCity, initialUnits]);

    useEffect(() => {
      fetchWeatherData();
      if (autoRefresh && !isMock) {
        const interval = setInterval(fetchWeatherData, refreshInterval);
        return () => clearInterval(interval);
      }
    }, [city, units, autoRefresh, refreshInterval, isMock]);

    const handleGeolocation = () => {
      if (!AMAP_API_KEY) {
        toast({
          title: "错误",
          description: "未配置高德地图 API 密钥。",
          variant: "destructive",
        });
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const coordinates = `${longitude},${latitude}`;
            try {
              const response = await fetch(
                `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_API_KEY}&location=${coordinates}&extensions=all`
              );
              const data = await response.json();
              if (data.status === "1") {
                const fetchedCity =
                  data.regeocode.addressComponent.city ||
                  data.regeocode.addressComponent.province;
                setCity(fetchedCity);
              } else {
                throw new Error("无法通过坐标获取城市信息。");
              }
            } catch (err: any) {
              toast({
                title: "错误",
                description: err.message || "获取城市信息时出错。",
                variant: "destructive",
              });
            }
          },
          () => {
            toast({
              title: "错误",
              description: "无法获取您的位置信息。",
              variant: "destructive",
            });
          }
        );
      } else {
        toast({
          title: "错误",
          description: "浏览器不支持地理定位。",
          variant: "destructive",
        });
      }
    };

    const handleMapClick = async (coordinates: string) => {
      if (!AMAP_API_KEY) {
        toast({
          title: "错误",
          description: "未配置高德地图 API 密钥。",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await fetch(
          `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_API_KEY}&location=${coordinates}&extensions=all`
        );
        const data = await response.json();
        if (data.status === "1") {
          const fetchedCity =
            data.regeocode.addressComponent.city ||
            data.regeocode.addressComponent.province;
          setCity(fetchedCity);
          setShowMap(false);
        } else {
          throw new Error("无法通过坐标获取城市信息。");
        }
      } catch (err: any) {
        toast({
          title: "错误",
          description: err.message || "获取城市信息时出错。",
          variant: "destructive",
        });
      }
    };

    const temperatureData =
      weatherData?.forecast?.map((f) => ({
        date: f.date,
        temperature: f.temperature,
      })) || [];

    return (
      <TooltipProvider>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 bg-gray-900 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-center">
              <WeatherInfoHeader onClose={onClose} />
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      onClick={toggleDarkMode}
                      className="p-2"
                      aria-label="切换主题"
                    >
                      {darkMode ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-gray-800" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>切换 {darkMode ? "亮色" : "暗色"} 主题</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <WeatherControls
              city={city}
              setCity={setCity}
              units={units}
              setUnits={setUnits}
              selectedAPI={selectedAPI.name}
              setSelectedAPI={(api) => {
                const selected = AVAILABLE_APIS.find((a) => a.name === api);
                if (selected) setSelectedAPI(selected);
              }}
              handleGeolocation={handleGeolocation}
              fetchWeatherData={fetchWeatherData}
              loading={loading}
              setShowSettings={setShowSettings}
              AVAILABLE_APIS={AVAILABLE_APIS}
            />
            <div className="mt-4 flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setShowMap(true)}
                className="flex items-center"
              >
                <Map className="mr-2" />
                选择位置
              </Button>
            </div>
            <Dialog open={showMap} onOpenChange={setShowMap}>
              <DialogContent className="w-full h-96">
                <DialogHeader>
                  <DialogTitle>选择位置</DialogTitle>
                </DialogHeader>
                <StaticMap
                  location={city}
                  zoom={10}
                  showControls={true}
                  showZoomButtons={true}
                  allowFullscreen={true}
                  onMapClick={handleMapClick}
                />
              </DialogContent>
            </Dialog>
            {loading && (
              <div className="flex justify-center items-center my-6">
                <motion.div
                  className="loader ease-linear rounded-full border-4 border-t-4 border-gray-400 h-12 w-12"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                />
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center my-6 text-red-500">
                <AlertCircle className="h-6 w-6 mr-2" />
                {error}
              </div>
            )}
            {weatherData && !loading && !error && (
              <>
                <WeatherCards weatherData={weatherData} units={units} />
                <Tabs defaultValue="current" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="forecast">预报</TabsTrigger>
                    <TabsTrigger value="chart">图表</TabsTrigger>
                  </TabsList>
                  <TabsContent value="forecast">
                    <ForecastAccordion
                      forecast={weatherData.forecast || []}
                      units={units}
                    />
                  </TabsContent>
                  <TabsContent value="chart">
                    <TemperatureChart data={temperatureData} />
                  </TabsContent>
                </Tabs>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white">详细信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center">
                        <Wind className="w-5 h-5 text-blue-500 mr-2" />
                        <span>
                          风速: {weatherData.windSpeed}{" "}
                          {units === "metric" ? "m/s" : "mph"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Droplet className="w-5 h-5 text-blue-300 mr-2" />
                        <span>湿度: {weatherData.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                        <span>日出: {weatherData.sunrise}</span>
                      </div>
                      <div className="flex items-center">
                        <Moon className="w-5 h-5 text-gray-400 mr-2" />
                        <span>日落: {weatherData.sunset}</span>
                      </div>
                      <div className="flex items-center">
                        <Cloud className="w-5 h-5 text-gray-300 mr-2" />
                        <span>云量: {weatherData.cloudCover}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="w-5 h-5 text-blue-500 mr-2" />
                        <span>风向: {weatherData.windDirection}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </TooltipProvider>
    );
  }
);

WeatherInfo.displayName = "WeatherInfo";

export default WeatherInfo;
