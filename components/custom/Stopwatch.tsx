"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StopwatchProps {
  style: "classic" | "modern" | "minimal";
  darkMode: boolean;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ style, darkMode }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    playSound();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    playSound();
  };

  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, time]);
    playSound();
    toast({
      title: "分段时间已记录",
      description: `${formatTime(time)}`,
    });
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const getStyleClasses = () => {
    switch (style) {
      case "classic":
        return `bg-gradient-to-r ${
          darkMode ? "from-gray-800 to-gray-900" : "from-gray-100 to-gray-200"
        } rounded-lg shadow-lg`;
      case "modern":
        return `bg-gradient-to-r ${
          darkMode
            ? "from-purple-900 to-indigo-900"
            : "from-purple-400 to-indigo-500"
        } rounded-2xl shadow-xl`;
      case "minimal":
        return `${darkMode ? "bg-gray-800" : "bg-white"} rounded-md shadow-sm`;
      default:
        return "";
    }
  };

  return (
    <div className={`w-full max-w-md p-6 ${getStyleClasses()} mx-auto`}>
      <div className="relative w-full max-w-[300px] aspect-square mb-6 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 stroke-current"
            strokeWidth="6"
            cx="50"
            cy="50"
            r="44"
            fill="none"
          />
          <motion.circle
            className="text-blue-500 stroke-current"
            strokeWidth="6"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="44"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (time % 60000) / 60000 }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>
        <motion.div
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {formatTime(time)}
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          onClick={handleStartStop}
          variant={isRunning ? "destructive" : "default"}
          className="w-full"
        >
          {isRunning ? "停止" : "开始"}
        </Button>
        <Button onClick={handleLap} disabled={!isRunning} className="w-full">
          记录分段
        </Button>
        <Button onClick={handleReset} variant="outline" className="w-full">
          重置
        </Button>
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="outline"
          className="w-full"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </div>
      {laps.length > 0 && (
        <ScrollArea
          className={`h-40 ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          } rounded p-2`}
        >
          <AnimatePresence>
            {laps.map((lapTime, index) => (
              <motion.div
                key={index}
                className={`flex justify-between py-1 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <span>分段 {index + 1}</span>
                <span>{formatTime(lapTime)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      )}
      {laps.length === 0 && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>提示</AlertTitle>
          <AlertDescription>点击"记录分段"按钮来记录时间。</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
