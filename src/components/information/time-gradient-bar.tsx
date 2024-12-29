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
import { motion, AnimatePresence } from "framer-motion";

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

// 在类型定义后添加新的动画变体
const gradientVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3
    }
  }
};

const timeIndicatorVariants = {
  initial: { height: 0 },
  animate: { 
    height: "100%",
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const TimeGradientBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // 添加新的状态
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTimeDetails, setShowTimeDetails] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  // 添加天文时间计算
  const calculateAstronomicalTimes = (date: Date) => {
    return {
      sidereal: format(date, "HH:mm:ss"), // 恒星时
      julian: getJulianDate(date), // 儒略日
      lst: getLocalSiderealTime(date, selectedCity.longitude), // 本地恒星时
    };
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
      className={`${darkMode ? "dark" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className="w-full bg-gray-900/95 dark:bg-gray-900/95 text-white p-2 shadow-lg border-gray-800">
        <CardContent className="p-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Select
                onValueChange={(value) =>
                  setSelectedCity(
                    cities.find((city) => city.name === value) || cities[0]
                  )
                }
              >
                <SelectTrigger className="w-24 h-8 text-sm bg-gray-800 border-gray-700">
                  <SelectValue placeholder="选择城市" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {cities.map((city) => (
                    <SelectItem
                      key={city.name}
                      value={city.name}
                      className="text-white"
                    >
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={toggleDarkMode}
                className="h-8 px-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm border border-gray-700"
              >
                {darkMode ? "亮色" : "暗色"}
              </button>
            </div>
            <div className="text-xl font-bold text-gray-100">
              {format(currentTime, "HH:mm:ss")}
            </div>
          </div>
          <motion.div
            className="relative mb-8"
            variants={gradientVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-8 left-0 right-0 bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 text-xs"
                >
                  点击查看详细信息
                </motion.div>
              )}
            </AnimatePresence>
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
              <motion.div
                className="absolute top-0 w-1 h-full bg-white dark:bg-gray-300 opacity-75"
                variants={timeIndicatorVariants}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-sm">
            {sunTimes && (
              <>
                <div className="flex items-center bg-gray-800/50 rounded p-2">
                  <Sunrise className="w-4 h-4 mr-2" />
                  <span>{format(sunTimes.sunrise, "HH:mm")}</span>
                </div>
                <div className="flex items-center bg-gray-800/50 rounded p-2">
                  <Sunset className="w-4 h-4 mr-2" />
                  <span>{format(sunTimes.sunset, "HH:mm")}</span>
                </div>
                <div className="flex items-center bg-gray-800/50 rounded p-2">
                  <Sun className="w-4 h-4 mr-2" />
                  <span>{format(sunTimes.solarNoon, "HH:mm")}</span>
                </div>
                <div className="flex items-center bg-gray-800/50 rounded p-2">
                  <Moon className="w-4 h-4 mr-2" />
                  <span>{format(sunTimes.night, "HH:mm")}</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">恒星时</div>
              <div>{calculateAstronomicalTimes(currentTime).sidereal}</div>
            </div>
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">儒略日</div>
              <div>{calculateAstronomicalTimes(currentTime).julian}</div>
            </div>
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">本地恒星时</div>
              <div>{calculateAstronomicalTimes(currentTime).lst}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function getJulianDate(date: Date) {
  // Convert date to Julian Date
  // Formula from Jean Meeus' Astronomical Algorithms
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  // Adjust month and year for January/February
  let adjY = y;
  let adjM = m;
  if (m <= 2) {
    adjY = y - 1;
    adjM = m + 12;
  }

  // Calculate A and B terms for Julian Date
  const a = Math.floor(adjY / 100);
  const b = 2 - a + Math.floor(a / 4);

  // Calculate Julian Day Number
  const jdn =
    Math.floor(365.25 * (adjY + 4716)) +
    Math.floor(30.6001 * (adjM + 1)) +
    d +
    b -
    1524.5;

  // Add time of day
  const fraction = (h + min / 60 + sec / 3600) / 24;
  const jd = jdn + fraction;

  // Return formatted string with 4 decimal places
  return jd.toFixed(4);
}
function getLocalSiderealTime(date: Date, longitude: number): string {
  // Constants for sidereal time calculation
  const J2000 = 2451545.0; // Julian date for J2000.0 epoch
  const SIDEREAL_DAY = 23.9344696; // Hours in a sidereal day
  const SOLAR_TO_SIDEREAL = 1.002737909350795; // Conversion factor

  // Calculate days since J2000.0
  const jd = parseFloat(getJulianDate(date));
  const daysSinceJ2000 = jd - J2000;

  // Calculate Greenwich Mean Sidereal Time (GMST)
  // Formula from Astronomical Algorithms by Jean Meeus
  const T = daysSinceJ2000 / 36525.0; // Julian centuries since J2000.0
  let gmst =
    280.46061837 +
    360.98564736629 * daysSinceJ2000 +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;

  // Normalize to 0-360 degrees
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;

  // Convert to hours (divide by 15)
  let gmstHours = gmst / 15;

  // Add longitude correction (longitude in degrees to hours)
  let lst = gmstHours + longitude / 15;

  // Normalize to 0-24 hours
  lst = lst % 24;
  if (lst < 0) lst += 24;

  // Convert to HH:mm:ss format
  const hours = Math.floor(lst);
  const minutes = Math.floor((lst - hours) * 60);
  const seconds = Math.floor(((lst - hours) * 60 - minutes) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
