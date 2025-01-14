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
  Clock,
  Globe,
  Bell,
  Settings,
  Sun,
  Moon,
  Search,
  Timer,
  Volume2,
  Plus,
  Minus,
  Play,
  Pause,
  StopCircle,
  CalendarDays,
  AlarmClock,
  Clock4,
  Clock8,
  Clock9,
  Clock12,
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
  const [snoozeDuration, setSnoozeDuration] = useState(5); // in minutes
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
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
          const ampm = hours >= 12 ? "PM" : "AM";
          const spokenHours = hours % 12 || 12;
          return `${spokenHours}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;

        case "military":
          return date.toLocaleTimeString("en-US", {
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
          return date.toLocaleTimeString("en-US", {
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
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
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
        title: "Time Synced",
        description: "Your clock has been synchronized with the world time.",
      });
    } catch (error) {
      console.error("Failed to sync time:", error);
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize time. Please try again later.",
        variant: "destructive",
      });
    }
  }, []);

  const addAlarm = useCallback(() => {
    if (newAlarm) {
      const alarm = {
        time: newAlarm,
        repeat: alarmRepeat,
        sound: alarmSound,
        label: `Alarm ${alarms.length + 1}`,
        snooze: snoozeDuration,
        active: true,
      };

      setAlarms((prev) => [...prev, alarm]);
      setNewAlarm("");
      toast({
        title: "Alarm Added",
        description: `New alarm set for ${newAlarm} (${alarmRepeat})`,
      });

      // Check if alarm should trigger immediately
      const now = new Date();
      const [hours, minutes] = newAlarm.split(":");
      const alarmTime = new Date();
      alarmTime.setHours(parseInt(hours));
      alarmTime.setMinutes(parseInt(minutes));

      if (now >= alarmTime) {
        triggerAlarm(alarm);
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
      title: "Alarm Triggered",
      description: `Alarm for ${alarm.time} is ringing!`,
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
          {alarm.snooze ? "Snooze" : "Dismiss"}
        </Button>
      ),
    });
  }, []);

  const removeAlarm = useCallback((alarm: { time: string }) => {
    setAlarms((prev) => prev.filter((a) => a.time !== alarm.time));
    toast({
      title: "Alarm Removed",
      description: `Alarm for ${alarm.time} has been removed`,
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
        title: "Event Added",
        description: `New event "${newEvent.title}" added to calendar`,
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
            title: "Countdown Complete",
            description: "Your countdown has finished!",
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
          className={`flex items-center justify-center ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          } px-3 py-1 rounded-sm hover:bg-opacity-80 transition-colors duration-200 cursor-default select-none`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-xs font-semibold">
            <div>{formatTime(currentTime)}</div>
            <div>{formatDate(currentTime).split(",")[0]}</div>
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Tabs defaultValue="datetime" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="datetime">Date & Time</TabsTrigger>
            <TabsTrigger value="alarms">Alarms</TabsTrigger>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="worldclock">World Clock</TabsTrigger>
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
                  Sync Time
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
                  <span className="text-lg font-semibold">Alarms</span>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="time"
                      value={newAlarm}
                      onChange={(e) => setNewAlarm(e.target.value)}
                      placeholder="Set new alarm"
                    />
                    <Button onClick={addAlarm}>Add</Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Repeat:</Label>
                    <Select value={alarmRepeat} onValueChange={setAlarmRepeat}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select repeat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Sound:</Label>
                    <Select value={alarmSound} onValueChange={setAlarmSound}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select sound" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bell">Bell</SelectItem>
                        <SelectItem value="chime">Chime</SelectItem>
                        <SelectItem value="beep">Beep</SelectItem>
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
                        Remove
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
                  <span className="text-lg font-semibold">Settings</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="24-hour"
                      checked={is24HourFormat}
                      onCheckedChange={setIs24HourFormat}
                    />
                    <Label htmlFor="24-hour">Use 24-hour format</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-seconds"
                      checked={showSeconds}
                      onCheckedChange={setShowSeconds}
                    />
                    <Label htmlFor="show-seconds">Show seconds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                    <Label htmlFor="dark-mode">Dark mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Time Format:</Label>
                    <Select
                      value={timeFormat}
                      onValueChange={(value: typeof timeFormat) =>
                        setTimeFormat(value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="spoken">Spoken</SelectItem>
                        <SelectItem value="military">Military</SelectItem>
                        <SelectItem value="iso">ISO 8601</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="unix">Unix Timestamp</SelectItem>
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
                  <span className="text-lg font-semibold">World Clock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search timezone..."
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
                          {new Date().toLocaleTimeString("en-US", {
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
                  <span className="text-lg font-semibold">Stopwatch</span>
                </div>
                <div className="text-3xl font-mono text-center">
                  {formatStopwatchTime(stopwatchTime)}
                </div>
                <div className="flex justify-center space-x-2">
                  {isStopwatchRunning ? (
                    <Button variant="destructive" onClick={stopStopwatch}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={startStopwatch}>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetStopwatch}>
                    <StopCircle className="mr-2 h-4 w-4" />
                    Reset
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
                  <span className="text-lg font-semibold">Countdown Timer</span>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="time"
                    value={countdown}
                    onChange={(e) => setCountdown(e.target.value)}
                    placeholder="Set countdown"
                    step="1"
                  />
                  {isCounting ? (
                    <Button variant="destructive" onClick={stopCountdown}>
                      Stop
                    </Button>
                  ) : (
                    <Button onClick={startCountdown}>Start</Button>
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
