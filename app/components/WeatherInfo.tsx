import React, { useEffect, useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Cloud,
  Thermometer,
  Wind,
  Droplet,
  Sun,
  RefreshCcw,
  AlertCircle,
  X,
  Locate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherInfoProps {
  onClose: () => void;
  city?: string;
  units?: "metric" | "imperial";
  apiKey: string;
  isMock?: boolean;
  mockData?: WeatherData;
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

const DEFAULT_CITY = "London";
const DEFAULT_MOCK_DATA: WeatherData = {
  temperature: 25,
  humidity: 50,
  windSpeed: 5,
  cloudCover: 20,
  description: "晴朗",
  uvi: 5,
  pressure: 1013,
  visibility: 10000,
  forecast: [
    { date: "明天", temperature: 26, description: "多云" },
    { date: "后天", temperature: 24, description: "小雨" },
  ],
};

export const WeatherInfo: React.FC<WeatherInfoProps> = memo(
  ({
    onClose,
    city = DEFAULT_CITY,
    units = "metric",
    apiKey,
    isMock = true,
    mockData = DEFAULT_MOCK_DATA,
  }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>(city);

    const fetchWeatherData = useCallback(async () => {
      if (isMock) {
        setWeatherData(mockData);
        setLastUpdated(new Date());
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=${units}`
        );
        if (!response.ok) {
          throw new Error("无法获取天气数据，请检查城市名称或 API 密钥。");
        }
        const data = await response.json();
        // 获取预报数据
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=${units}`
        );
        const forecastData = await forecastResponse.json();
        const forecastList = forecastData.list.slice(0, 2).map((item: any) => ({
          date: item.dt_txt.split(" ")[0],
          temperature: item.main.temp,
          description: item.weather[0].description,
        }));
        setWeatherData({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          cloudCover: data.clouds.all,
          description: data.weather[0].description,
          uvi: data.uvi || 0,
          pressure: data.main.pressure,
          visibility: data.visibility,
          forecast: forecastList,
        });
        setLastUpdated(new Date());
      } catch (err: any) {
        console.error("获取天气数据时出错:", err);
        setError(err.message || "获取天气数据时出错。");
      } finally {
        setLoading(false);
      }
    }, [selectedCity, units, apiKey, isMock, mockData]);

    useEffect(() => {
      fetchWeatherData();
      if (!isMock) {
        const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
        return () => clearInterval(interval);
      }
    }, [fetchWeatherData, isMock]);

    const handleGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // 根据经纬度获取城市名称
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`
            )
              .then((res) => res.json())
              .then((data) => {
                setSelectedCity(data.name);
              })
              .catch((err) => {
                console.error("定位获取失败:", err);
                setError("无法获取当前位置天气。");
              });
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center space-x-2">
                <Locate className="w-6 h-6" />
                <span>城市天气信息: {selectedCity}</span>
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedCity}
                  onValueChange={(value) => setSelectedCity(value)}
                >
                  <SelectItem value="London">伦敦</SelectItem>
                  <SelectItem value="Beijing">北京</SelectItem>
                  <SelectItem value="New York">纽约</SelectItem>
                  {/* 添加更多城市 */}
                </Select>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleGeolocation}
                  aria-label="获取当前位置天气"
                >
                  <Locate className="h-5 w-5 text-white" />
                </Button>
                <Select
                  value={units}
                  onValueChange={(value) => {
                    fetchWeatherData();
                  }}
                >
                  <SelectItem value="metric">公制</SelectItem>
                  <SelectItem value="imperial">英制</SelectItem>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="关闭天气信息"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>
            </DialogHeader>
            {loading && (
              <div className="flex justify-center items-center flex-1">
                <motion.div
                  className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"
                  initial={{ rotate: 0 }}
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
              <div className="flex items-center justify-center flex-1 text-red-500">
                <AlertCircle className="h-6 w-6 mr-2" />
                {error}
              </div>
            )}
            {weatherData && !loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto flex-grow text-white">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-6 h-6 text-white" />
                  <span>
                    温度: {weatherData.temperature.toFixed(1)}°
                    {units === "metric" ? "C" : "F"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplet className="w-6 h-6 text-white" />
                  <span>湿度: {weatherData.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-6 h-6 text-white" />
                  <span>
                    风速: {weatherData.windSpeed}{" "}
                    {units === "metric" ? "m/s" : "mph"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cloud className="w-6 h-6 text-white" />
                  <span>云量: {weatherData.cloudCover}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-6 h-6 text-white" />
                  <span>紫外线指数: {weatherData.uvi}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-6 h-6 text-white" />
                  <span>气压: {weatherData.pressure} hPa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-6 h-6 text-white" />
                  <span>能见度: {weatherData.visibility / 1000} km</span>
                </div>
                <div className="col-span-1 sm:col-span-2 flex items-center space-x-2">
                  <span>描述: {weatherData.description}</span>
                </div>
                {weatherData.forecast && (
                  <div className="col-span-1 sm:col-span-2">
                    <h3 className="text-lg">预报：</h3>
                    {weatherData.forecast.map((forecast, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span>{forecast.date}:</span>
                        <span>
                          {forecast.temperature}°
                          {units === "metric" ? "C" : "F"} -{" "}
                          {forecast.description}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {lastUpdated && (
                  <div className="col-span-1 sm:col-span-2 text-sm text-gray-400">
                    最后更新: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
                {/* Mock 模式指示 */}
                {isMock && (
                  <div className="col-span-1 sm:col-span-2 flex items-center space-x-2 text-blue-500">
                    <span>当前为 Mock 模式</span>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </AnimatePresence>
      </Dialog>
    );
  }
);

WeatherInfo.displayName = "WeatherInfo";

export default WeatherInfo;
