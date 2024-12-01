"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartStyle,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

interface FocusAssistantProps {
  onClose: () => void;
}

interface FocusData {
  timestamp: Date;
  score: number;
}

export function FocusAssistant({ onClose }: FocusAssistantProps) {
  const { t } = useTranslation();
  const [focusScore, setFocusScore] = useState(0);
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusDuration, setFocusDuration] = useState(0); // 专注时长（秒）
  const [focusHistory, setFocusHistory] = useState<FocusData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 加载历史记录
  useEffect(() => {
    const storedHistory = localStorage.getItem("focusHistory");
    if (storedHistory) {
      setFocusHistory(JSON.parse(storedHistory));
    }
  }, []);

  // 保存历史记录
  useEffect(() => {
    localStorage.setItem("focusHistory", JSON.stringify(focusHistory));
  }, [focusHistory]);

  // 实时更新专注分数
  useEffect(() => {
    if (isFocusing) {
      intervalRef.current = setInterval(() => {
        setFocusScore((prevScore) => {
          const newScore = prevScore + Math.random() * 10 - 5;
          return Math.max(0, Math.min(100, newScore));
        });
      }, 500);

      // 开始计时
      timerRef.current = setInterval(() => {
        setFocusDuration((prev) => prev + 1);
      }, 1000);

      // 播放开始专注音效
      const startAudio = new Audio("/start-focus.mp3");
      startAudio.play();

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isFocusing]);

  const handleStartFocus = () => {
    setIsFocusing(true);
  };

  const handleStopFocus = () => {
    setIsFocusing(false);
    // 保存当前专注分数到历史记录
    setFocusHistory((prev) => [
      ...prev,
      { timestamp: new Date(), score: focusScore },
    ]);
    // 重置专注分数和时长
    setFocusScore(0);
    setFocusDuration(0);
    // 播放停止专注音效
    const stopAudio = new Audio("/stop-focus.mp3");
    stopAudio.play();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("focusAssistant.title")}</DialogTitle>
          <DialogDescription>
            {t("focusAssistant.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {t("focusAssistant.focusScore")}
            </h3>
            <p className="text-3xl font-bold">{focusScore.toFixed(2)}</p>
          </div>
          <Progress
            value={focusScore}
            className="w-full"
            aria-label={t("focusAssistant.progress")}
          />
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t("focusAssistant.duration")}: {formatDuration(focusDuration)}
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleStartFocus} disabled={isFocusing}>
              {t("focusAssistant.startFocus")}
            </Button>
            <Button onClick={handleStopFocus} disabled={!isFocusing}>
              {t("focusAssistant.stopFocus")}
            </Button>
          </div>
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">
              {t("focusAssistant.history")}
            </h4>
            {focusHistory.length > 0 ? (
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={focusHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-sm text-gray-400">
                {t("focusAssistant.noHistory")}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="secondary">
            {t("focusAssistant.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
