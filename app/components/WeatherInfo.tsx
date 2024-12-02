"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Thermometer,
  Wind,
  Droplet,
  Cloud,
  Sun,
  RefreshCcw,
  Locate,
  X,
  AlertCircle,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  cloudCover: number;
  description: string;
  uvi: number;
  pressure: number;
  visibility: number;
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

const DEFAULT_CITY = "London";
const DEFAULT_API = "OpenWeatherMap";

const AVAILABLE_APIS: WeatherAPI[] = [
  {
    name: "OpenWeatherMap",
    fetchWeather: async (city, units, apiKey) => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
      );
      if (!response.ok) {
        throw new Error("无法获取天气数据，请检查城市名称或 API 密钥。");
      }
      const data = await response.json();
      // 获取预报数据
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`
      );
      const forecastData = await forecastResponse.json();
      const forecastList = forecastData.list.slice(0, 2).map((item: any) => ({
        date: item.dt_txt.split(" ")[0],
        temperature: item.main.temp,
        description: item.weather[0].description,
      }));
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cloudCover: data.clouds.all,
        description: data.weather[0].description,
        uvi: data.uvi || 0,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        forecast: forecastList,
      };
    },
  },
  {
    name: "WeatherAPI",
    fetchWeather: async (city, units, apiKey) => {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=no&alerts=no`
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
        cloudCover: data.current.cloud,
        description: data.current.condition.text,
        uvi: data.current.uv,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        forecast: forecastList,
      };
    },
  },
];

export const WeatherInfo: React.FC<WeatherInfoProps> = memo(
  ({
    onClose,
    initialCity = DEFAULT_CITY,
    initialUnits = "metric",
    isMock = false,
  }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [city, setCity] = useState<string>(initialCity);
    const [units, setUnits] = useState<"metric" | "imperial">(initialUnits);
    const [apiKey, setApiKey] = useState<string>("");
    const [selectedAPI, setSelectedAPI] = useState<WeatherAPI>(
      AVAILABLE_APIS[0]
    );
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const fetchWeatherData = useCallback(async () => {
      if (isMock) {
        setWeatherData({
          temperature: 25,
          humidity: 50,
          windSpeed: 5,
          cloudCover: 20,
          description: "晴朗",
          uvi: 5,
          pressure: 1013,
          visibility: 10,
          forecast: [
            { date: "明天", temperature: 26, description: "多云" },
            { date: "后天", temperature: 24, description: "小雨" },
          ],
        });
        setLastUpdated(new Date());
        return;
      }

      if (!apiKey) {
        setError("请在设置中提供 API 密钥。");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await selectedAPI.fetchWeather(city, units, apiKey);
        setWeatherData(data);
        setLastUpdated(new Date());
      } catch (err: any) {
        console.error("获取天气数据时出错:", err);
        setError(err.message || "获取天气数据时出错。");
      } finally {
        setLoading(false);
      }
    }, [city, units, apiKey, selectedAPI, isMock]);

    useEffect(() => {
      fetchWeatherData();
      if (!isMock) {
        const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
        return () => clearInterval(interval);
      }
    }, [fetchWeatherData, isMock]);

    const handleGeolocation = () => {
      if (!apiKey) {
        setError("请在设置中提供 API 密钥。");
        return;
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCity(`${position.coords.latitude},${position.coords.longitude}`);
          },
          () => {
            setError("无法获取您的位置信息。");
          }
        );
      } else {
        setError("浏览器不支持地理定位。");
      }
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <AnimatePresence>
          <DialogContent className="sm:max-w-2xl dark:bg-gray-800">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              <DialogHeader>
                <DialogTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Locate className="w-6 h-6" />
                    <span>城市天气信息</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5 text-white" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Select
                    value={city}
                    onValueChange={(value) => setCity(value)}
                  >
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
                      className={`h-5 w-5 text-white ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={units}
                    onValueChange={(value) =>
                      setUnits(value as "metric" | "imperial")
                    }
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
                    value={selectedAPI.name}
                    onValueChange={(value) => {
                      const api = AVAILABLE_APIS.find(
                        (api) => api.name === value
                      );
                      if (api) setSelectedAPI(api);
                    }}
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
              {showSettings && (
                <Card className="mt-4 p-4">
                  <CardHeader>
                    <CardTitle>设置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label htmlFor="apiKey" className="text-white">
                          API 密钥:
                        </label>
                        <input
                          id="apiKey"
                          type="text"
                          className="flex-1 px-2 py-1 bg-gray-700 text-white rounded"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {loading && (
                <div className="flex justify-center items-center my-6">
                  <motion.div
                    className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-gray-700 text-white">
                      <CardHeader>
                        <CardTitle>湿度</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center space-x-2">
                        <Droplet className="w-6 h-6" />
                        <span>{weatherData.humidity}%</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                  {/* 其他天气信息卡片 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
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
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="bg-gray-700 text-white">
                      <CardHeader>
                        <CardTitle>云量</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center space-x-2">
                        <Cloud className="w-6 h-6" />
                        <span>{weatherData.cloudCover}%</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                  {/* 添加更多卡片，如紫外线指数、气压、能见度等 */}
                  {weatherData.forecast && (
                    <div className="col-span-1 sm:col-span-2 mt-4">
                      <h3 className="text-lg text-white">预报：</h3>
                      {weatherData.forecast.map((forecast, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mt-2 text-white"
                        >
                          <span>{forecast.date}:</span>
                          <span>
                            {forecast.temperature.toFixed(1)}°
                            {units === "metric" ? "C" : "F"} -{" "}
                            {forecast.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {lastUpdated && (
                    <div className="col-span-1 sm:col-span-2 text-sm text-gray-400 mt-4">
                      最后更新: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                  {isMock && (
                    <div className="col-span-1 sm:col-span-2 text-blue-500">
                      当前为 Mock 模式
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </DialogContent>
        </AnimatePresence>
      </Dialog>
    );
  }
);

WeatherInfo.displayName = "WeatherInfo";

export default WeatherInfo;
