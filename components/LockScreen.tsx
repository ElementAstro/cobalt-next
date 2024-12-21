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
} from "lucide-react";
import { useLockScreenStore } from "@/lib/store/lockscreen";

interface Notification {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface LockScreenProps {
  backgroundImage?: string;
  showWeather?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LockScreen({
  backgroundImage = "/placeholder.svg?height=1080&width=1920",
  showWeather = true,
}: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isLocked, setIsLocked } = useLockScreenStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather, setWeather] = useState({ temp: 25, condition: "Sunny" });
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

    // Fetch weather data (示例)
    // fetchWeather();

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

  const toggleNotifications = () => {
    setIsNotificationExpanded(!isNotificationExpanded);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

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
      className={`relative flex flex-row items-stretch justify-between h-screen overflow-hidden bg-cover bg-center ${
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
      <motion.div
        variants={containerVariants}
        className="z-10 text-white p-4 w-1/3 flex flex-col justify-center items-start"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-1">
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
            className="flex items-center text-sm"
          >
            {weather.condition === "Sunny" ? (
              <SunIcon className="w-4 h-4 mr-1" />
            ) : (
              <CloudIcon className="w-4 h-4 mr-1" />
            )}
            <span>{weather.temp}°C</span>
            <ThermometerIcon className="w-4 h-4 ml-1" />
          </motion.div>
        )}
      </motion.div>

      {/* 中间: 控制区 */}
      <motion.div
        variants={containerVariants}
        className="z-10 w-1/3 p-4 flex flex-col justify-center"
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

      {/* 右侧: 通知 */}
      <motion.div
        variants={containerVariants}
        className="z-10 w-1/3 p-4 flex flex-col justify-center"
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
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-4 gap-1 mt-2"
        >
          {[
            {
              icon: <MessageSquareIcon />,
              action: () => handleQuickLaunch("Messages"),
            },
            { icon: <PhoneIcon />, action: () => handleQuickLaunch("Phone") },
            {
              icon: <InstagramIcon />,
              action: () => handleQuickLaunch("Instagram"),
            },
            {
              icon: <TwitterIcon />,
              action: () => handleQuickLaunch("Twitter"),
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
      </motion.div>

      {/* 设置面板 */}
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
