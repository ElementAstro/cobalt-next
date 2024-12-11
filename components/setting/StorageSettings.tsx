"use client";

import { useState, useEffect } from "react";
import { HardDrive, Settings, Info } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { useStorageStore } from "@/lib/store/system";
import { useToast } from "@/hooks/use-toast";
import { Span } from "@/components/custom/Span";

export default function StorageSettings() {
  const { toast } = useToast();
  const {
    defaultStorage,
    storageUsage,
    setDefaultStorage,
    updateStorageUsage,
  } = useStorageStore();

  const [showDetails, setShowDetails] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    updateStorageUsage({ used: 75, total: 128 });
  }, [updateStorageUsage]);

  const handleStorageChange = (value: string) => {
    setDefaultStorage(value);
    toast({
      title: "默认存储已更改",
      description: `新的默认存储设置为: ${
        value === "internal" ? "内置存储" : "SD卡"
      }`,
    });
  };

  const formatSize = (size: number) => {
    return `${size}GB`;
  };

  const usagePercentage = (storageUsage.used / storageUsage.total) * 100;
  const getStorageStatus = () => {
    if (usagePercentage > 90) return "error";
    if (usagePercentage > 70) return "warning";
    return "success";
  };

  return (
    <div
      className={`w-full max-w-3xl mx-auto space-y-6 p-4 ${
        isDarkMode ? "dark bg-gray-900" : "bg-white"
      } transition-colors duration-500`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <Span
          icon={HardDrive}
          variant="default"
          size="lg"
          className="font-bold"
        >
          存储设置
        </Span>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Switch
            checked={showDetails}
            onCheckedChange={setShowDetails}
            aria-label="显示详细信息"
          />
          <Span size="sm" variant="info">
            显示详细信息
          </Span>
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
            aria-label="切换暗色模式"
          />
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-4 bg-gray-100 dark:bg-gray-800">
            <CardHeader className="flex justify-between items-center">
              <Span
                icon={Settings}
                variant="default"
                tooltip="选择默认存储位置"
              >
                默认存储位置
              </Span>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <Button
                  variant={
                    defaultStorage === "internal" ? "default" : "outline"
                  }
                  className={`flex-1 ${
                    defaultStorage === "internal"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }`}
                  onClick={() => handleStorageChange("internal")}
                >
                  内置存储
                </Button>
                <Button
                  variant={defaultStorage === "sd" ? "default" : "outline"}
                  className={`flex-1 ${
                    defaultStorage === "sd"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }`}
                  onClick={() => handleStorageChange("sd")}
                >
                  SD卡
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Span
                    variant={getStorageStatus()}
                    icon={Info}
                    tooltip="当前存储使用情况"
                  >
                    存储空间使用情况
                  </Span>
                  <Span variant={getStorageStatus()} copyable>
                    {formatSize(storageUsage.used)} /{" "}
                    {formatSize(storageUsage.total)}
                  </Span>
                </div>

                <Progress
                  value={usagePercentage}
                  className="h-2 bg-gray-300 dark:bg-gray-700"
                />

                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Span
                      variant={getStorageStatus()}
                      animate="pulse"
                      highlightOnHover
                    >
                      使用率: {Math.round(usagePercentage)}%
                    </Span>
                    <Span variant="info" tooltip="可用存储空间" breakWords>
                      可用空间:{" "}
                      {formatSize(storageUsage.total - storageUsage.used)}
                    </Span>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
