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
  Compass,
  Camera,
  Telescope,
  Wind,
  Eye,
  Lightbulb,
  Shuffle,
  TreeDeciduous,
  Star,
  HardDrive,
  ChevronLeft,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
  type: "info" | "warning" | "alert" | "success";
  timestamp: number;
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
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

const notificationVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const settingsVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
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
    condition: "Night" as WeatherCondition,
    humidity: 60,
    windSpeed: 10,
    seeing: 2.5, // 视宁度
    transparency: 3, // 透明度
    moonPhase: "Waning Gibbous", // 月相
    lightPollution: 4, // 光污染等级
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "星空夜曲",
    artist: "天文摄影助手",
    type: "ambient", // ambient | nature | music
    duration: "3:45",
    bpm: 60,
  });
  const [audioOptions, setAudioOptions] = useState([
    { label: "环境音效", value: "ambient" },
    { label: "自然声音", value: "nature" },
    { label: "背景音乐", value: "music" },
  ]);
  const [selectedAudio, setSelectedAudio] = useState("ambient");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "望远镜状态",
      message: "正在跟踪：M31",
      icon: <Telescope className="w-4 h-4" />,
      type: "info",
      timestamp: Date.now() - 3600000, // 1小时前
    },
    {
      id: 2,
      title: "相机状态",
      message: "温度：-15°C (目标：-20°C)",
      icon: <Camera className="w-4 h-4" />,
      type: "warning",
      timestamp: Date.now() - 1800000, // 30分钟前
    },
    {
      id: 3,
      title: "赤道仪状态",
      message: "高度：45° 方位：120°",
      icon: <Compass className="w-4 h-4" />,
      type: "info",
      timestamp: Date.now() - 1200000, // 20分钟前
    },
    {
      id: 4,
      title: "天气警报",
      message: "云量增加，建议暂停拍摄",
      icon: <CloudIcon className="w-4 h-4" />,
      type: "alert",
      timestamp: Date.now() - 600000, // 10分钟前
    },
    {
      id: 5,
      title: "自动导星",
      message: '导星精度：0.5"',
      icon: <Star className="w-4 h-4" />,
      type: "success",
      timestamp: Date.now() - 300000, // 5分钟前
    },
    {
      id: 6,
      title: "存储状态",
      message: "剩余空间：120GB",
      icon: <HardDrive className="w-4 h-4" />,
      type: "info",
      timestamp: Date.now() - 120000, // 2分钟前
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 text-xs text-white/80">
                <div className="flex items-center">
                  <ThermometerIcon className="w-3 h-3 mr-1" />
                  <span>湿度: {weather.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="w-3 h-3 mr-1" />
                  <span>风速: {weather.windSpeed} km/h</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>视宁度: {weather.seeing}"</span>
                </div>
                <div className="flex items-center">
                  <CloudIcon className="w-3 h-3 mr-1" />
                  <span>透明度: {weather.transparency}/5</span>
                </div>
                <div className="flex items-center">
                  <MoonIcon className="w-3 h-3 mr-1" />
                  <span>月相: {weather.moonPhase}</span>
                </div>
                <div className="flex items-center">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  <span>光污染: {weather.lightPollution}/9</span>
                </div>
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
              <div className="flex flex-col flex-1 min-w-0 mx-2">
                <h4 className="text-sm text-white font-medium truncate">
                  {currentSong.title}
                </h4>
                <p className="text-xs text-white/80 truncate">
                  {currentSong.artist} · {currentSong.duration} ·{" "}
                  {currentSong.bpm}BPM
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Select
                    value={selectedAudio}
                    onValueChange={setSelectedAudio}
                  >
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue placeholder="选择音效类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {option.value === "ambient" && (
                              <CloudMoonIcon className="w-3 h-3" />
                            )}
                            {option.value === "nature" && (
                              <TreeDeciduous className="w-3 h-3" />
                            )}
                            {option.value === "music" && (
                              <MusicIcon className="w-3 h-3" />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setSelectedAudio("random")}
                  >
                    <Shuffle className="w-3 h-3" />
                  </Button>
                </div>
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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
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
                  <Button type="submit" size="sm" className="w-full h-8 mb-2">
                    密码解锁
                  </Button>
                </motion.form>
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex-1"
                    onClick={handleBiometricAuth}
                  >
                    <FingerprintIcon className="w-3 h-3 mr-1" />
                    生物识别
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex-1"
                    onClick={() => setShowPasswordInput(false)}
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    返回
                  </Button>
                </motion.div>
              </motion.div>
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
                    className={`backdrop-blur-md rounded-lg p-2 ${
                      notification.type === "alert"
                        ? "bg-red-500/20 border-red-500/30"
                        : notification.type === "warning"
                        ? "bg-yellow-500/20 border-yellow-500/30"
                        : notification.type === "success"
                        ? "bg-green-500/20 border-green-500/30"
                        : "bg-white/20 border-white/30"
                    } border`}
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="ml-2 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-xs font-medium truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-white/50 ml-2">
                            {Math.floor(
                              (Date.now() - notification.timestamp) / 60000
                            )}
                            分钟前
                          </span>
                        </div>
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
                  icon: <Telescope className="w-4 h-4" />,
                  action: () => handleQuickLaunch("TelescopeControl"),
                  label: "望远镜控制",
                },
                {
                  icon: <Camera className="w-4 h-4" />,
                  action: () => handleQuickLaunch("CameraControl"),
                  label: "相机控制",
                },
                {
                  icon: <Compass className="w-4 h-4" />,
                  action: () => handleQuickLaunch("MountControl"),
                  label: "赤道仪控制",
                },
                {
                  icon: <CloudMoonIcon className="w-4 h-4" />,
                  action: () => handleQuickLaunch("WeatherMonitor"),
                  label: "天气监测",
                },
                {
                  icon: <Star className="w-4 h-4" />,
                  action: () => handleQuickLaunch("PolarAlignment"),
                  label: "极轴校准",
                },
                {
                  icon: <SettingsIcon className="w-4 h-4" />,
                  action: () => handleQuickLaunch("Settings"),
                  label: "系统设置",
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
