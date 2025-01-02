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
} from "lucide-react";
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
    { time: string; repeat: string; sound: string }[]
  >([]);
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const updateTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime]);

  const formatTime = useMemo(() => {
    return (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: !is24HourFormat,
        second: showSeconds ? "2-digit" : undefined,
      });
    };
  }, [is24HourFormat, showSeconds]);

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
      setAlarms((prev) => [
        ...prev,
        {
          time: newAlarm,
          repeat: alarmRepeat,
          sound: alarmSound,
        },
      ]);
      setNewAlarm("");
      toast({
        title: "Alarm Added",
        description: `New alarm set for ${newAlarm} (${alarmRepeat})`,
      });
    }
  }, [newAlarm, alarmRepeat, alarmSound]);

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="datetime">Date & Time</TabsTrigger>
            <TabsTrigger value="alarms">Alarms</TabsTrigger>
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
