"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TargetSetHeader } from "@/components/sequencer/target-set-header";
import { TimelineGraph } from "@/components/sequencer/timeline-graph";
import { TargetControls } from "@/components/sequencer/target-controls";
import { AutofocusSettings } from "@/components/sequencer/autofocus-settings";
import { CoordinateData } from "@/types/sequencer";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { useSequencerStore } from "@/store/useSequencerStore";
import { Progress } from "@/components/ui/progress";

const timelineData = Array.from({ length: 24 }, (_, i) => ({
  time: i.toString().padStart(2, "0"),
  value: i >= 3 && i <= 6 ? 90 : 30,
}));

const initialCoordinates: CoordinateData = {
  ra: { h: 0, m: 0, s: 0 },
  dec: { d: 0, m: 0, s: 0 },
  rotation: 0,
};

const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.5,
      ease: [0.7, 0, 0.84, 0],
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
      damping: 15,
    },
  },
};

export default function SequencerEditor() {
  const [coordinates, setCoordinates] =
    useState<CoordinateData>(initialCoordinates);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const {
    errors,
    notifications,
    clearNotification,
    isRunning,
    currentProgress,
    startSequence,
    stopSequence,
    pauseSequence,
  } = useSequencerStore();

  // Dummy implementations for settings actions.
  const saveSettings = () => {
    console.log("Settings saved");
  };

  const resetSettings = () => {
    console.log("Settings reset");
  };

  // 自动清除已读通知
  useEffect(() => {
    const timer = setInterval(() => {
      notifications
        .filter((n) => n.read)
        .forEach((n) => clearNotification(n.id));
    }, 5000);
    return () => clearInterval(timer);
  }, [notifications, clearNotification]);

  // 监听错误并显示通知
  useEffect(() => {
    if (errors.length > 0) {
      // 使用 toast 或其他通知组件显示错误
      console.error("Error:", errors);
    }
  }, [errors]);

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            saveSettings();
            break;
          case "r":
            e.preventDefault();
            resetSettings();
            break;
          // 添加更多快捷键...
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // 已移除未使用的 debouncedSave

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <ScrollArea className="h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg"
            >
              <h1 className="text-lg font-medium">Target Set</h1>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
              {/* Left Panel */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-8 space-y-2"
              >
                <TargetSetHeader />

                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <TimelineGraph
                    data={timelineData}
                    height={isMobile ? 150 : 200}
                    showControls
                    showGrid
                  />
                </div>

                {/* Coordinates */}
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div>RA</div>
                      <div className="text-white">{`${coordinates.ra.h}h ${
                        coordinates.ra.m
                      }m ${coordinates.ra.s.toFixed(1)}s`}</div>
                    </div>
                    <div>
                      <div>Dec</div>
                      <div className="text-white">{`${coordinates.dec.d}d ${
                        coordinates.dec.m
                      }m ${coordinates.dec.s.toFixed(1)}s`}</div>
                    </div>
                    <div>
                      <div>Rotation</div>
                      <div className="text-white">{`${coordinates.rotation}°`}</div>
                    </div>
                    <div className="text-right">
                      <div>Now</div>
                      <div className="text-white">15:39:51</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Panel */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-4 space-y-2"
              >
                <TargetControls />
                <AutofocusSettings />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>

      {/* 添加错误提示 */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          {/* 错误通知组件 */}
          <div className="bg-red-600 p-3 rounded-lg">出错了！请检查日志。</div>
        </motion.div>
      )}

      {/* 添加进度指示器 */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <Progress value={currentProgress} />
            <div className="mt-2 text-sm text-gray-400">
              正在执行序列... {currentProgress}%
            </div>
          </div>
        </motion.div>
      )}

      {/* 添加快捷操作菜单 */}
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gray-900 p-2 rounded-lg shadow-lg flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startSequence()}
            disabled={isRunning}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pauseSequence()}
            disabled={!isRunning}
          >
            <Pause className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => stopSequence()}
            disabled={!isRunning}
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
