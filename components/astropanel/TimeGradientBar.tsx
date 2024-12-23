"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import SunCalc from "suncalc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { motion } from "framer-motion";

interface SunTimes {
  nightEnd: Date;
  nauticalDawn: Date;
  dawn: Date;
  sunrise: Date;
  sunriseEnd: Date;
  goldenHourEnd: Date;
  solarNoon: Date;
  goldenHour: Date;
  sunsetStart: Date;
  sunset: Date;
  dusk: Date;
  nauticalDusk: Date;
  night: Date;
}

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

const cities: City[] = [
  { name: "南京", latitude: 32.0603, longitude: 118.7969 },
  { name: "北京", latitude: 39.9042, longitude: 116.4074 },
  { name: "上海", latitude: 31.2304, longitude: 121.4737 },
  { name: "广州", latitude: 23.1291, longitude: 113.2644 },
];

const TimeGradientBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // 添加新的状态
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTimeDetails, setShowTimeDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setSunTimes(
        SunCalc.getTimes(
          now,
          selectedCity.latitude,
          selectedCity.longitude
        ) as SunTimes
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCity]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getGradientPosition = (date: Date) => {
    const minutes = date.getHours() * 60 + date.getMinutes();
    return (minutes / 1440) * 100;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverPosition((x / rect.width) * 100);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const getTimeFromPosition = (position: number) => {
    const minutes = (position / 100) * 1440;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      hours,
      mins
    );
  };

  const getGradientStyle = () => {
    if (!sunTimes) return {};

    const toPercent = (time: Date) =>
      ((time.getHours() * 60 + time.getMinutes()) / 1440) * 100;

    return {
      background: `linear-gradient(to right, 
        ${darkMode ? "#1f2937" : "#0c1445"} 0%,
        ${darkMode ? "#1f2937" : "#0c1445"} ${toPercent(sunTimes.nightEnd)}%,
        ${darkMode ? "#4b5563" : "#4b6cb7"} ${toPercent(sunTimes.dawn)}%,
        ${darkMode ? "#f59e0b" : "#ffd89b"} ${toPercent(sunTimes.sunrise)}%,
        ${darkMode ? "#3b82f6" : "#80c9ff"} ${toPercent(sunTimes.solarNoon)}%,
        ${darkMode ? "#f59e0b" : "#ffd89b"} ${toPercent(sunTimes.sunset)}%,
        ${darkMode ? "#4b5563" : "#4b6cb7"} ${toPercent(sunTimes.dusk)}%,
        ${darkMode ? "#1f2937" : "#0c1445"} ${toPercent(sunTimes.night)}%,
        ${darkMode ? "#1f2937" : "#0c1445"} 100%
      )`,
    };
  };

  // 添加动画控制函数
  const handleBarClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // 添加时间详情切换函数
  const toggleTimeDetails = () => {
    setShowTimeDetails(!showTimeDetails);
  };

  // 在 return 语句前添加新的工具函数
  const getTimeDetails = () => {
    if (!sunTimes) return null;
    return [
      {
        label: "黎明",
        time: format(sunTimes.dawn, "HH:mm"),
        icon: <Sunrise />,
      },
      { label: "日出", time: format(sunTimes.sunrise, "HH:mm"), icon: <Sun /> },
      {
        label: "正午",
        time: format(sunTimes.solarNoon, "HH:mm"),
        icon: <Sun />,
      },
      {
        label: "日落",
        time: format(sunTimes.sunset, "HH:mm"),
        icon: <Sunset />,
      },
      { label: "天黑", time: format(sunTimes.night, "HH:mm"), icon: <Moon /> },
    ];
  };

  const SunriseIcon = () => (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* SVG paths */}
    </motion.svg>
  );

  const SunsetIcon = () => (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* SVG paths */}
    </motion.svg>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={`${darkMode ? "dark" : ""} min-h-screen`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 dark:bg-gray-800 text-white p-4 sm:p-6">
        <CardHeader className="space-y-4">
          <CardTitle className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Select
                onValueChange={(value) =>
                  setSelectedCity(
                    cities.find((city) => city.name === value) || cities[0]
                  )
                }
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="选择城市" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={toggleDarkMode}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                {darkMode ? "亮色模式" : "暗色模式"}
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="relative mb-8"
            variants={itemVariants}
            animate={isAnimating ? "pulse" : "visible"}
            onClick={handleBarClick}
          >
            {/* 添加时间详情展示 */}
            {showTimeDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute -top-20 left-0 right-0 bg-gray-800 rounded-lg p-4"
              >
                <div className="grid grid-cols-5 gap-4">
                  {getTimeDetails()?.map((detail, index) => (
                    <motion.div
                      key={detail.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      {detail.icon}
                      <span className="text-sm">{detail.label}</span>
                      <span className="text-xs">{detail.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            <div
              className="h-16 rounded-full relative overflow-hidden cursor-pointer"
              style={getGradientStyle()}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="absolute top-0 w-1 h-full bg-white dark:bg-gray-300 opacity-75"
                style={{ left: `${getGradientPosition(currentTime)}%` }}
              />
              {hoverPosition !== null && (
                <div
                  className="absolute top-full mt-2 transform -translate-x-1/2 bg-white dark:bg-gray-700 text-black dark:text-white px-2 py-1 rounded text-sm"
                  style={{ left: `${hoverPosition}%` }}
                >
                  {format(getTimeFromPosition(hoverPosition), "HH:mm")}
                </div>
              )}
            </div>
            {sunTimes && (
              <>
                <div
                  className="absolute bottom-full mb-2"
                  style={{ left: `${getGradientPosition(sunTimes.sunrise)}%` }}
                >
                  <SunriseIcon />
                </div>
                <div
                  className="absolute bottom-full mb-2"
                  style={{ left: `${getGradientPosition(sunTimes.sunset)}%` }}
                >
                  <SunsetIcon />
                </div>
              </>
            )}
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={itemVariants}
          >
            <motion.div
              className="text-center text-2xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {format(currentTime, "HH:mm:ss")}
            </motion.div>
            {sunTimes && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="flex items-center">
                  <Sunrise className="mr-2" />
                  <span>日出: {format(sunTimes.sunrise, "HH:mm")}</span>
                </div>
                <div className="flex items-center">
                  <Sunset className="mr-2" />
                  <span>日落: {format(sunTimes.sunset, "HH:mm")}</span>
                </div>
                <div className="flex items-center">
                  <Sun className="mr-2" />
                  <span>正午: {format(sunTimes.solarNoon, "HH:mm")}</span>
                </div>
                <div className="flex items-center">
                  <Moon className="mr-2" />
                  <span>天黑: {format(sunTimes.night, "HH:mm")}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TimeGradientBar;
