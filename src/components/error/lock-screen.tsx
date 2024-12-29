"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LockIcon,
  UnlockIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ThermometerIcon,
  BellIcon,
  MusicIcon,
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  MessageSquareIcon,
  PhoneIcon,
  InstagramIcon,
  TwitterIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SettingsIcon,
  BatteryChargingIcon,
  WifiIcon,
  WifiOffIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudLightningIcon,
  CloudFogIcon,
  CloudDrizzleIcon,
  CloudSunIcon,
  CloudMoonIcon,
  FingerprintIcon,
  AlertTriangleIcon,
} from "lucide-react";

import { create } from "zustand";

interface LockScreenState {
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  lastActivityTime: number;
  updateLastActivityTime: () => void;
}

export const useLockScreenStore = create<LockScreenState>((set) => ({
  isLocked: true,
  setIsLocked: (locked) => set({ isLocked: locked }),
  lastActivityTime: Date.now(),
  updateLastActivityTime: () => set({ lastActivityTime: Date.now() }),
}));

interface Notification {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface MinimalModeConfig {
  showTime?: boolean;
  showWeather?: boolean;
  showNotifications?: boolean;
  showMusicControls?: boolean;
  showQuickLaunch?: boolean;
  showStatusIndicators?: boolean;
}

interface LockScreenProps {
  backgroundImage?: string;
  showWeather?: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  isConnected?: boolean;
  minimalMode?: boolean;
  minimalModeConfig?: MinimalModeConfig;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

type WeatherCondition =
  | "Sunny"
  | "Rain"
  | "Snow"
  | "Thunderstorm"
  | "Fog"
  | "Drizzle"
  | "Cloudy"
  | "PartlyCloudy"
  | "Night";

const weatherIconMap: Record<WeatherCondition, React.ComponentType> = {
  Sunny: SunIcon,
  Rain: CloudRainIcon,
  Snow: CloudSnowIcon,
  Thunderstorm: CloudLightningIcon,
  Fog: CloudFogIcon,
  Drizzle: CloudDrizzleIcon,
  Cloudy: CloudIcon,
  PartlyCloudy: CloudSunIcon,
  Night: CloudMoonIcon,
};

export default function LockScreen({
  backgroundImage = "/placeholder.svg?height=1080&width=1920",
  showWeather = true,
  batteryLevel = 85,
  isCharging = false,
  isConnected = true,
  minimalMode = false,
  minimalModeConfig = {
    showTime: true,
    showWeather: true,
    showNotifications: true,
    showMusicControls: true,
    showQuickLaunch: true,
    showStatusIndicators: true,
  },
}: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isLocked, setIsLocked } = useLockScreenStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather, setWeather] = useState({
    temp: 25,
    condition: "Sunny" as WeatherCondition,
    humidity: 60,
    windSpeed: 10,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "Awesome Song",
    artist: "Cool Artist",
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "新消息",
      message: "你有一条新的短信",
      icon: <MessageSquareIcon />,
    },
    {
      id: 2,
      title: "未接来电",
      message: "妈妈 (2分钟前)",
      icon: <PhoneIcon />,
    },
    {
      id: 3,
      title: "Instagram",
      message: "你有3条新的赞",
      icon: <InstagramIcon />,
    },
    {
      id: 4,
      title: "Twitter",
      message: "你有1条新的推文",
      icon: <TwitterIcon />,
    },
  ]);
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (value: number[]) => {
    if (value[0] === 100) {
      setShowPasswordInput(true);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setIsLocked(false);
    } else {
      alert("密码错误，请重试");
      setPassword("");
    }
  };

  const handleQuickLaunch = (app: string) => {
    alert(`启动应用: ${app}`);
  };

  const handleBiometricAuth = () => {
    alert("生物识别认证");
  };

  const handleEmergencyCall = () => {
    alert("紧急呼叫");
  };

  const toggleNotifications = () => {
    setIsNotificationExpanded(!isNotificationExpanded);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const WeatherIcon = weatherIconMap[weather.condition] || CloudIcon;

  if (!isLocked) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-white"
        >
          设备已解锁
        </motion.h1>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative flex flex-col md:flex-row items-stretch justify-between h-screen overflow-hidden bg-cover bg-center ${
        isDarkMode ? "dark" : ""
      }`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={`absolute inset-0 ${
          isDarkMode ? "bg-black/70" : "bg-black/30"
        } backdrop-blur-md transition-colors duration-500`}
      ></div>

      {/* 左侧: 时间和天气 */}
      {(!minimalMode || minimalModeConfig.showTime) && (
        <motion.div
          variants={containerVariants}
          className="z-10 text-white p-4 w-full md:w-1/3 flex flex-col justify-center items-start"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold mb-1"
          >
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-base mb-2">
            {currentTime.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </motion.h2>
          {showWeather && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-1 text-sm"
            >
              <div className="flex items-center">
                <div className="w-4 h-4 mr-1">
                  <WeatherIcon />
                </div>
                <span>{weather.temp}°C</span>
                <ThermometerIcon className="w-4 h-4 ml-1" />
              </div>
              <div className="flex items-center text-xs text-white/80">
                <span>湿度: {weather.humidity}%</span>
                <span className="mx-1">|</span>
                <span>风速: {weather.windSpeed} km/h</span>
              </div>
            </motion.div>
          )}

          {/* 状态指示器 */}
          {(!minimalMode || minimalModeConfig.showStatusIndicators) && (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mt-2 text-sm"
            >
              <div className="flex items-center">
                {isCharging ? (
                  <BatteryChargingIcon className="w-4 h-4 mr-1" />
                ) : (
                  <BatteryChargingIcon className="w-4 h-4 mr-1" />
                )}
                <span>{batteryLevel}%</span>
              </div>
              <div className="flex items-center">
                {isConnected ? (
                  <WifiIcon className="w-4 h-4" />
                ) : (
                  <WifiOffIcon className="w-4 h-4" />
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 中间: 控制区 */}
      {(!minimalMode || minimalModeConfig.showMusicControls) && (
        <motion.div
          variants={containerVariants}
          className="z-10 w-full md:w-1/3 p-4 flex flex-col justify-center"
        >
          {/* 音乐控制 */}
          <motion.div
            variants={itemVariants}
            className="bg-white/20 backdrop-blur-md rounded-lg p-2 mb-2"
          >
            <div className="flex items-center justify-between mb-1">
              <MusicIcon className="w-4 h-4" />
              <div className="text-center flex-1 mx-2">
                <h4 className="text-sm text-white font-medium truncate">
                  {currentSong.title}
                </h4>
                <p className="text-xs text-white/80 truncate">
                  {currentSong.artist}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={toggleSettings}
              >
                <SettingsIcon className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex justify-center items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <SkipBackIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <PauseIcon className="w-3 h-3" />
                ) : (
                  <PlayIcon className="w-3 h-3" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <SkipForwardIcon className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>

          {/* 解锁控制 */}
          <AnimatePresence>
            {showPasswordInput ? (
              <motion.form
                onSubmit={handlePasswordSubmit}
                className="mb-2"
                variants={itemVariants}
              >
                <Input
                  type="password"
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 text-sm mb-1"
                />
                <Button type="submit" size="sm" className="w-full h-8">
                  解锁
                </Button>
              </motion.form>
            ) : (
              <motion.div variants={itemVariants} className="mb-2">
                <div className="bg-white/20 p-1 rounded-full mb-1">
                  <Slider
                    defaultValue={[0]}
                    max={100}
                    step={1}
                    onValueChange={handleUnlock}
                    className="w-full"
                  />
                </div>
                <p className="text-center text-white text-xs">
                  <LockIcon className="inline w-3 h-3 mr-1" />
                  滑动解锁
                  <UnlockIcon className="inline w-3 h-3 ml-1" />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 右侧: 通知 */}
      {(!minimalMode || minimalModeConfig.showNotifications) && (
        <motion.div
          variants={containerVariants}
          className="z-10 w-full md:w-1/3 p-4 flex flex-col justify-center"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white text-sm flex items-center">
              <BellIcon className="w-4 h-4 mr-1" /> 通知
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={toggleNotifications}
            >
              {isNotificationExpanded ? (
                <ChevronUpIcon className="w-4 h-4 text-white" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {isNotificationExpanded && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-1 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
              >
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    className="bg-white/20 backdrop-blur-md rounded-lg p-2"
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="ml-2 min-w-0">
                        <h4 className="text-white text-xs font-medium truncate">
                          {notification.title}
                        </h4>
                        <p className="text-white/80 text-xs truncate">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 快速启动 */}
          {(!minimalMode || minimalModeConfig.showQuickLaunch) && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-4 gap-1 mt-2"
            >
              {[
                {
                  icon: <MessageSquareIcon />,
                  action: () => handleQuickLaunch("Messages"),
                },
                {
                  icon: <PhoneIcon />,
                  action: () => handleQuickLaunch("Phone"),
                },
                {
                  icon: <InstagramIcon />,
                  action: () => handleQuickLaunch("Instagram"),
                },
                {
                  icon: <TwitterIcon />,
                  action: () => handleQuickLaunch("Twitter"),
                },
                {
                  icon: <FingerprintIcon />,
                  action: () => handleBiometricAuth(),
                },
                {
                  icon: <AlertTriangleIcon />,
                  action: () => handleEmergencyCall(),
                },
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={item.action}
                >
                  <div className="w-4 h-4 text-white">{item.icon}</div>
                </Button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 设置面板 - Always visible in minimal mode */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-lg p-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <SunIcon className="w-3 h-3 text-white" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="scale-75"
              />
              <MoonIcon className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="/path-to-your-audio-file.mp3" />
    </motion.div>
  );
}
