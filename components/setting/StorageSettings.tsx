"use client";

import { useEffect } from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSystemStore } from "@/lib/store/system";
import { useToast } from "@/hooks/use-toast";
import { Span } from "@/components/custom/Span";
import DiskInfo from "./DiskInfo";

export default function StorageSettings() {
  const { toast } = useToast();
  const {
    systemInfo: { defaultStorage, storageUsage },
    setDefaultStorage,
    updateStorageUsage,
  } = useSystemStore();

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

  const usagePercentage = (storageUsage.used / storageUsage.total) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 dark:bg-gray-900 bg-white transition-colors duration-500">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-2 bg-gray-100 dark:bg-gray-800">
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
              <div className="flex flex-col sm:flex-row mb-2">
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
              <DiskInfo />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
