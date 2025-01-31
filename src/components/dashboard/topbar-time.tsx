"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Bell,
  Settings,
  Search,
  Timer,
  Play,
  Pause,
  StopCircle,
  Clock12,
  Clock,
} from "lucide-react";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function WindowsTaskbarClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);
  const [alarms, setAlarms] = useState<
    {
      time: string;
      repeat: string;
      sound: string;
      label?: string;
      snooze?: number;
      active: boolean;
    }[]
  >([]);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const stopwatchInterval = useRef<NodeJS.Timeout | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<
    { title: string; date: string; time: string }[]
  >([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });
  const [snoozeDuration, setSnoozeDuration] = useState(5);
  const [activeAlarmSound, setActiveAlarmSound] = useState<Howl | null>(null);
  const [newAlarm, setNewAlarm] = useState("");
  const [alarmRepeat, setAlarmRepeat] = useState("once");
  const [alarmSound, setAlarmSound] = useState("bell");
  const [timezones, setTimezones] = useState([
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Africa/Johannesburg",
    "Pacific/Honolulu",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState("");
  const [isCounting, setIsCounting] = useState(false);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const [timeFormat, setTimeFormat] = useState<
    "default" | "spoken" | "military" | "iso" | "relative" | "unix"
  >("default");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const updateTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime]);

  const getRelativeTime = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return "刚刚";
  }, []);

  const formatTime = useMemo(() => {
    return (
      date: Date,
      format:
        | "default"
        | "spoken"
        | "military"
        | "iso"
        | "relative"
        | "unix" = "default"
    ) => {
      switch (format) {
        case "spoken":
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? "下午" : "上午";
          const spokenHours = hours % 12 || 12;
          return `${spokenHours}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;

        case "military":
          return date.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

        case "iso":
          return date.toISOString();

        case "relative":
          return getRelativeTime(date);

        case "unix":
          return Math.floor(date.getTime() / 1000).toString();

        default:
          return date.toLocaleTimeString("zh-CN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: !is24HourFormat,
            second: showSeconds ? "2-digit" : undefined,
          });
      }
    };
  }, [is24HourFormat, showSeconds, getRelativeTime]);

  const formatDate = useMemo(() => {
    return (date: Date) => {
      return date.toLocaleDateString("zh-CN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };
  }, []);

  const getTimeZone = useCallback(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  const syncTime = useCallback(async () => {
    try {
      const response = await fetch("https://worldtimeapi.org/api/ip");
      const data = await response.json();
      const syncedTime = new Date(data.datetime);
      setCurrentTime(syncedTime);
      toast({
        title: "时间同步成功",
        description: "您的时钟已与世界时间同步",
      });
    } catch (error) {
      console.error("时间同步失败:", error);
      toast({
        title: "同步失败",
        description: "无法同步时间，请稍后重试",
        variant: "destructive",
      });
    }
  }, []);

  const addAlarm = useCallback(() => {
    try {
      if (!newAlarm) {
        throw new Error("请选择有效的时间");
      }

      const [alarmHours, alarmMinutes] = newAlarm.split(":");
      if (isNaN(Number(alarmHours)) || isNaN(Number(alarmMinutes))) {
        throw new Error("时间格式无效，请使用HH:MM格式");
      }

      const alarm = {
        time: newAlarm,
        repeat: alarmRepeat,
        sound: alarmSound,
        label: `闹钟 ${alarms.length + 1}`,
        snooze: snoozeDuration,
        active: true,
      };

      setAlarms((prev) => [...prev, alarm]);
      setNewAlarm("");
      toast({
        title: "闹钟已添加",
        description: `已设置新闹钟：${newAlarm} (${alarmRepeat})`,
        duration: 3000,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "错误",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "错误",
          description: "发生未知错误",
          variant: "destructive",
        });
      }
    }
  }, [newAlarm, alarmRepeat, alarmSound, snoozeDuration, alarms.length]);

  const triggerAlarm = useCallback((alarm: (typeof alarms)[0]) => {
    const sound = new Howl({
      src: [`/sounds/${alarm.sound}.mp3`],
      loop: true,
      volume: 0.5,
    });

    sound.play();
    setActiveAlarmSound(sound);

    toast({
      title: "闹钟响起",
      description: `${alarm.time}的闹钟正在响铃！`,
      action: (
        <Button
          variant="default"
          onClick={() => {
            sound.stop();
            setActiveAlarmSound(null);
            if (alarm.snooze) {
              const snoozeTime = new Date();
              snoozeTime.setMinutes(snoozeTime.getMinutes() + alarm.snooze);
              setAlarms((prev) => [
                ...prev,
                {
                  ...alarm,
                  time: `${snoozeTime.getHours()}:${snoozeTime.getMinutes()}`,
                },
              ]);
            }
          }}
        >
          {alarm.snooze ? "稍后提醒" : "关闭"}
        </Button>
      ),
    });
  }, []);

  const removeAlarm = useCallback((alarm: { time: string }) => {
    setAlarms((prev) => prev.filter((a) => a.time !== alarm.time));
    toast({
      title: "闹钟已移除",
      description: `${alarm.time}的闹钟已移除`,
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  }, []);

  const startStopwatch = useCallback(() => {
    setIsStopwatchRunning(true);
    stopwatchInterval.current = setInterval(() => {
      setStopwatchTime((prev) => prev + 10);
    }, 10);
  }, []);

  const stopStopwatch = useCallback(() => {
    if (stopwatchInterval.current) {
      clearInterval(stopwatchInterval.current);
      setIsStopwatchRunning(false);
    }
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchTime(0);
    if (stopwatchInterval.current) {
      clearInterval(stopwatchInterval.current);
      setIsStopwatchRunning(false);
    }
  }, []);

  const formatStopwatchTime = useCallback((time: number) => {
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const addCalendarEvent = useCallback(() => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      setCalendarEvents((prev) => [...prev, newEvent]);
      setNewEvent({ title: "", date: "", time: "" });
      toast({
        title: "事件已添加",
        description: `新事件"${newEvent.title}"已添加到日历`,
      });
    }
  }, [newEvent]);

  const startCountdown = useCallback(() => {
    if (countdown) {
      const [hours, minutes, seconds] = countdown.split(":").map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      let remaining = totalSeconds;

      setIsCounting(true);
      countdownInterval.current = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
          clearInterval(countdownInterval.current!);
          setIsCounting(false);
          toast({
            title: "倒计时结束",
            description: "您的倒计时已完成！",
          });
        }
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        setCountdown(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }, 1000);
    }
  }, [countdown]);

  const stopCountdown = useCallback(() => {
    clearInterval(countdownInterval.current!);
    setIsCounting(false);
    setCountdown("");
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          className="flex items-center space-x-2 px-2 py-1 rounded-md bg-gray-800/40 backdrop-blur hover:bg-gray-700/40 cursor-default select-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Clock className="h-4 w-4 text-gray-400" />
          <div className="text-xs font-medium text-gray-200">
            <div>{formatTime(currentTime, timeFormat)}</div>
            <div className="text-gray-400">{formatDate(currentTime)}</div>
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[340px] p-3" 
        sideOffset={5}
        align="end"
      >
        <Tabs defaultValue="datetime" className="w-full">
          <TabsList className="grid grid-cols-4 h-8 mb-2">
            <TabsTrigger value="datetime" className="text-xs">时间</TabsTrigger>
            <TabsTrigger value="alarms" className="text-xs">闹钟</TabsTrigger>
            <TabsTrigger value="stopwatch" className="text-xs">秒表</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">设置</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datetime">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-2xl font-bold">
                  {formatTime(currentTime)}
                </div>
                <div className="text-lg">{formatDate(currentTime)}</div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{getTimeZone()}</span>
                </div>
                <Calendar
                  mode="single"
                  selected={currentTime}
                  className="rounded-md border"
                />
                <Button onClick={syncTime} className="w-full">
                  同步时间
                </Button>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="alarms">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-lg font-semibold">闹钟</span>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="time"
                      value={newAlarm}
                      onChange={(e) => setNewAlarm(e.target.value)}
                      placeholder="设置新闹钟"
                    />
                    <Button onClick={addAlarm}>添加</Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>重复:</Label>
                    <Select value={alarmRepeat} onValueChange={setAlarmRepeat}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="选择重复" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">一次</SelectItem>
                        <SelectItem value="daily">每天</SelectItem>
                        <SelectItem value="weekdays">工作日</SelectItem>
                        <SelectItem value="weekends">周末</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>铃声:</Label>
                    <Select value={alarmSound} onValueChange={setAlarmSound}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="选择铃声" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bell">铃声</SelectItem>
                        <SelectItem value="chime">钟声</SelectItem>
                        <SelectItem value="beep">蜂鸣</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <ul className="space-y-2">
                  {alarms.map((alarm, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{alarm.time}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAlarm(alarm)}
                      >
                        移除
                      </Button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="settings">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-lg font-semibold">设置</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="24-hour"
                      checked={is24HourFormat}
                      onCheckedChange={setIs24HourFormat}
                    />
                    <Label htmlFor="24-hour">使用24小时制</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-seconds"
                      checked={showSeconds}
                      onCheckedChange={setShowSeconds}
                    />
                    <Label htmlFor="show-seconds">显示秒数</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                    <Label htmlFor="dark-mode">深色模式</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>时间格式:</Label>
                    <Select
                      value={timeFormat}
                      onValueChange={(value: typeof timeFormat) =>
                        setTimeFormat(value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="选择格式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">默认</SelectItem>
                        <SelectItem value="spoken">口语</SelectItem>
                        <SelectItem value="military">军用</SelectItem>
                        <SelectItem value="iso">ISO 8601</SelectItem>
                        <SelectItem value="relative">相对</SelectItem>
                        <SelectItem value="unix">Unix时间戳</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="worldclock">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-lg font-semibold">世界时钟</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="搜索时区..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timezones
                    .filter((tz) =>
                      tz.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((timezone, index) => (
                      <motion.div
                        key={timezone}
                        className="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <span>{timezone.split("/")[1].replace("_", " ")}</span>
                        <span>
                          {new Date().toLocaleTimeString("zh-CN", {
                            timeZone: timezone,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: !is24HourFormat,
                          })}
                        </span>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="stopwatch">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Clock12 className="h-4 w-4" />
                  <span className="text-lg font-semibold">秒表</span>
                </div>
                <div className="text-3xl font-mono text-center">
                  {formatStopwatchTime(stopwatchTime)}
                </div>
                <div className="flex justify-center space-x-2">
                  {isStopwatchRunning ? (
                    <Button variant="destructive" onClick={stopStopwatch}>
                      <Pause className="mr-2 h-4 w-4" />
                      暂停
                    </Button>
                  ) : (
                    <Button onClick={startStopwatch}>
                      <Play className="mr-2 h-4 w-4" />
                      开始
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetStopwatch}>
                    <StopCircle className="mr-2 h-4 w-4" />
                    重置
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="countdown">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4" />
                  <span className="text-lg font-semibold">倒计时</span>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="time"
                    value={countdown}
                    onChange={(e) => setCountdown(e.target.value)}
                    placeholder="设置倒计时"
                    step="1"
                  />
                  {isCounting ? (
                    <Button variant="destructive" onClick={stopCountdown}>
                      停止
                    </Button>
                  ) : (
                    <Button onClick={startCountdown}>开始</Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
