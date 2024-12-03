"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Film, History, Bell } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProgressPanel() {
  const [mode, setMode] = useState<"single" | "sequence">("single");
  const [progress, setProgress] = useState({ left: 0, right: 0 });
  const [isLandscape, setIsLandscape] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const startCapture = () => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => ({
        left: Math.min(prev.left + 1, 100),
        right: Math.min(prev.right + 0.5, 100),
      }));
    }, 100);

    // Simulate notifications and history update
    setNotifications((prev) => [...prev, "开始拍摄"]);
    setHistory((prev) => [
      ...prev,
      `拍摄模式: ${mode} 于 ${new Date().toLocaleTimeString()}`,
    ]);

    // Clear interval after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      setNotifications((prev) => [...prev, "拍摄完成"]);
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 dark:bg-gray-900">
      <main
        className={`grid gap-4 ${isLandscape ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {/* Progress Section */}
        <Card className="bg-zinc-800/50 border-zinc-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-zinc-400">进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex ${
                isLandscape ? "flex-col" : "flex-row"
              } justify-center gap-8 mb-8`}
            >
              {/* Circular Progress Indicators */}
              {["left", "right"].map((side) => (
                <Tooltip key={side} delayDuration={500}>
                  <TooltipTrigger>
                    <div
                      className={`relative ${
                        isLandscape ? "w-full h-32" : "w-32 h-32"
                      }`}
                    >
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="stroke-zinc-700 fill-none"
                          strokeWidth="4"
                          cx="50"
                          cy="50"
                          r="45"
                        />
                        <motion.circle
                          className="stroke-zinc-500 fill-none"
                          strokeWidth="4"
                          strokeDasharray="283"
                          strokeDashoffset={
                            283 -
                            (283 * progress[side as keyof typeof progress]) /
                              100
                          }
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="45"
                          initial={{ strokeDashoffset: 283 }}
                          animate={{
                            strokeDashoffset:
                              283 -
                              (283 * progress[side as keyof typeof progress]) /
                                100,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                          className="text-2xl font-bold"
                          key={progress[side as keyof typeof progress]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {progress[side as keyof typeof progress]}%
                        </motion.span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {side === "left" ? "左进度" : "右进度"}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Mode Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={`w-32 flex items-center justify-center ${
                      mode === "single"
                        ? "bg-blue-500 text-white"
                        : "border-blue-500 text-blue-400"
                    } hover:bg-blue-500/20 transition-colors duration-300`}
                    variant={mode === "single" ? "default" : "outline"}
                    onClick={() => setMode("single")}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    单次拍摄
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => setMode("single")}
                  >
                    单次拍摄
                  </Button>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={`w-32 flex items-center justify-center ${
                      mode === "sequence"
                        ? "bg-green-500 text-white"
                        : "border-green-500 text-green-400"
                    } hover:bg-green-500/20 transition-colors duration-300`}
                    variant={mode === "sequence" ? "default" : "outline"}
                    onClick={() => setMode("sequence")}
                  >
                    <Film className="w-4 h-4 mr-2" />
                    连续拍摄
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => setMode("sequence")}
                  >
                    连续拍摄
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                onClick={startCapture}
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 flex items-center"
              >
                <Bell className="w-4 h-4 mr-2" />
                开始拍摄
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info and Settings Section */}
        <div className="space-y-4">
          {/* Shot Info */}
          <Card className="bg-zinc-800/50 border-zinc-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-zinc-400 text-sm">
                拍摄信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {["曝光", "已用时间", "剩余时间"].map((label) => (
                  <div key={label} className="text-center">
                    <div className="text-zinc-400 text-sm">{label}</div>
                    <div className="text-zinc-300">--:--:--</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sequence Info */}
          <Card className="bg-zinc-800/50 border-zinc-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-zinc-400 text-sm">
                连续拍摄信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {["开始时间", "剩余", "结束时间"].map((label) => (
                  <div key={label} className="text-center">
                    <div className="text-zinc-400 text-sm">{label}</div>
                    <div className="text-zinc-300">--:--:--</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exposure Settings */}
          <Card className="bg-zinc-800/50 border-zinc-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-zinc-400 text-sm">
                曝光设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400">快门速度</label>
                  <Slider
                    defaultValue={[1 / 60]}
                    max={1}
                    min={1 / 1000}
                    step={1 / 1000}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">光圈</label>
                  <Slider
                    defaultValue={[5.6]}
                    max={22}
                    min={1.4}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">ISO</label>
                  <Slider
                    defaultValue={[100]}
                    max={6400}
                    min={100}
                    step={100}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capture History */}
          <Card className="bg-zinc-800/50 border-zinc-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-zinc-400 text-sm">
                <History className="w-4 h-4 mr-2" />
                拍摄历史
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                {history.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-zinc-300"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-zinc-800/50 border-zinc-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-zinc-400 text-sm">
                <Bell className="w-4 h-4 mr-2" />
                通知
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                {notifications.map((note, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-zinc-300"
                  >
                    {note}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
