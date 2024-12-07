"use client";

import { useEffect, useState } from "react";
import { HardDrive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function StorageSettings({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  const { toast } = useToast();
  const [defaultStorage, setDefaultStorage] = useState<string>("internal");
  const [storageUsage, setStorageUsage] = useState<{
    used: number;
    total: number;
  }>({
    used: 0,
    total: 0,
  });

  useEffect(() => {
    // Simulate fetching storage usage
    setStorageUsage({ used: 75, total: 128 });
  }, []);

  const handleStorageChange = (value: string) => {
    setDefaultStorage(value);
    toast({
      title: "默认存储已更改",
      description: `新的默认存储设置为: ${
        value === "internal" ? "内置存储" : "SD卡"
      }`,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`flex items-center text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  <HardDrive className="mr-2" />
                  默认存储
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className={`flex-1 ${
                      defaultStorage === "internal"
                        ? isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                        : isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition-colors duration-200`}
                    onClick={() => handleStorageChange("internal")}
                  >
                    内置存储
                  </Button>
                  <Button
                    className={`flex-1 ${
                      defaultStorage === "sd"
                        ? isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                        : isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition-colors duration-200`}
                    onClick={() => handleStorageChange("sd")}
                  >
                    SD卡
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div
                  className={`flex items-center text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  存储空间使用情况
                </div>
                <Progress
                  value={(storageUsage.used / storageUsage.total) * 100}
                  className={`w-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  } rounded-full h-4`}
                />
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mt-2`}
                >
                  已使用 {storageUsage.used}GB / 总共 {storageUsage.total}GB
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  className={`w-full ${
                    isDarkMode
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-500 hover:bg-green-600"
                  } transition-colors duration-200`}
                  onClick={() =>
                    toast({
                      title: "操作成功",
                      description: "存储设置已更新。",
                    })
                  }
                >
                  保存设置
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
