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
      className={`relative flex flex-col lg:flex-row items-stretch justify-between h-screen overflow-hidden bg-cover bg-center ${
        isDarkMode ? "dark" : ""
      }`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={`absolute inset-0 ${
          isDarkMode ? "bg-black/70" : "bg-black/30"
        } backdrop-blur-md transition-colors duration-500`}
      ></div>

      {/* 左侧/顶部区域：时间、日期和天气 */}
      <motion.div
        variants={containerVariants}
        className="z-10 text-white text-center p-4 lg:w-1/3 lg:p-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold mb-1 md:text-6xl lg:text-8xl lg:mb-2"
        >
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </motion.h1>
        <motion.h2
          variants={itemVariants}
          className="text-lg mb-2 md:text-xl lg:text-3xl lg:mb-4"
        >
          {currentTime.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.h2>
        {showWeather && (
          <motion.div
            variants={itemVariants}
            className="mb-2 flex items-center justify-center lg:mb-8"
          >
            {weather.condition === "Sunny" ? (
              <SunIcon className="mr-2" />
            ) : (
              <CloudIcon className="mr-2" />
            )}
            <span className="text-lg lg:text-xl">{weather.temp}°C</span>
            <ThermometerIcon className="ml-2" />
          </motion.div>
        )}
      </motion.div>

      {/* 中间区域：通知 */}
      <motion.div
        variants={containerVariants}
        className="z-10 w-full lg:w-1/3 p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-lg lg:text-xl flex items-center">
            <BellIcon className="mr-2" /> 通知
          </h3>
          <Button variant="ghost" size="sm" onClick={toggleNotifications}>
            {isNotificationExpanded ? (
              <ChevronUpIcon className="text-white" />
            ) : (
              <ChevronDownIcon className="text-white" />
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
              className="overflow-hidden"
            >
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-2 mb-2 text-white"
                >
                  <div className="flex items-center">
                    {notification.icon}
                    <div className="ml-2">
                      <h4 className="font-semibold text-sm lg:text-base">
                        {notification.title}
                      </h4>
                      <p className="text-xs lg:text-sm">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 右侧/底部区域：音乐控制、解锁滑块和快速启动 */}
      <motion.div
        variants={containerVariants}
        className="z-10 w-full lg:w-1/3 p-4 flex flex-col justify-end"
      >
        {/* 音乐控制 */}
        <motion.div
          variants={itemVariants}
          className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-2 mb-2 text-white lg:p-3 lg:mb-4"
        >
          <div className="flex items-center justify-between mb-1 lg:mb-2">
            <MusicIcon className="w-4 h-4 lg:w-5 lg:h-5" />
            <div className="text-center">
              <h4 className="font-semibold text-sm lg:text-base">
                {currentSong.title}
              </h4>
              <p className="text-xs lg:text-sm">{currentSong.artist}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSettings}>
              <SettingsIcon className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Previous song")}
            >
              <SkipBackIcon className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause}>
              {isPlaying ? (
                <PauseIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <PlayIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Next song")}
            >
              <SkipForwardIcon className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </div>
        </motion.div>

        {/* 解锁滑块或密码输入 */}
        <AnimatePresence>
          {showPasswordInput ? (
            <motion.form
              onSubmit={handlePasswordSubmit}
              className="mb-2 lg:mb-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Input
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" className="w-full">
                解锁
              </Button>
            </motion.form>
          ) : (
            <motion.div variants={itemVariants} className="mb-4">
              <motion.div
                className="w-full bg-white bg-opacity-20 p-1 rounded-full mb-2 lg:p-2 lg:mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  onValueChange={handleUnlock}
                  className="w-full"
                />
              </motion.div>
              <motion.p
                className="text-center text-white text-sm mb-2 lg:text-base lg:mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <LockIcon className="inline mr-2 w-4 h-4 lg:w-5 lg:h-5" />{" "}
                滑动解锁{" "}
                <UnlockIcon className="inline ml-2 w-4 h-4 lg:w-5 lg:h-5" />
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 快速启动 */}
        <motion.div variants={itemVariants} className="flex justify-around">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuickLaunch("Messages")}
          >
            <MessageSquareIcon className="text-white w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuickLaunch("Phone")}
          >
            <PhoneIcon className="text-white w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuickLaunch("Instagram")}
          >
            <InstagramIcon className="text-white w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuickLaunch("Twitter")}
          >
            <TwitterIcon className="text-white w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* 设置面板 */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.h3 variants={itemVariants} className="text-lg mb-2">
              设置
            </motion.h3>
            <motion.div
              variants={itemVariants}
              className="flex items-center mb-2"
            >
              <SunIcon className="mr-2" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <MoonIcon className="ml-2" />
            </motion.div>
            {/* 添加更多设置项 */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 深色模式切换 */}
      <motion.div
        className="absolute bottom-2 right-2 flex items-center lg:bottom-4 lg:right-4"
        variants={itemVariants}
      >
        <SunIcon className="mr-1 text-white w-3 h-3 lg:mr-2 lg:w-4 lg:h-4" />
        <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        <MoonIcon className="ml-1 text-white w-3 h-3 lg:ml-2 lg:w-4 lg:h-4" />
      </motion.div>

      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} src="/path-to-your-audio-file.mp3" />
    </motion.div>
  );
}
