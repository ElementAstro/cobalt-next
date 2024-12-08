"use client";

import { useEffect } from "react";
import { HardDrive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useStorageStore } from "@/lib/store/system";

export default function StorageSettings() {
  const { toast } = useToast();
  const {
    defaultStorage,
    storageUsage,
    setDefaultStorage,
    updateStorageUsage,
  } = useStorageStore();

  useEffect(() => {
    // 模拟获取存储使用情况
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center p-4"
      >
        <Card className="w-full max-w-md dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 shadow-lg rounded-lg">
          <div className="p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <HardDrive className="mr-2" />
                  默认存储
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant={
                      defaultStorage === "internal" ? "default" : "outline"
                    }
                    className={`flex-1 ${
                      defaultStorage === "internal"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    } transition-colors duration-200`}
                    onClick={() => handleStorageChange("internal")}
                  >
                    内置存储
                  </Button>
                  <Button
                    variant={defaultStorage === "sd" ? "default" : "outline"}
                    className={`flex-1 ${
                      defaultStorage === "sd"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    } transition-colors duration-200`}
                    onClick={() => handleStorageChange("sd")}
                  >
                    SD卡
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  存储空间使用情况
                </div>
                <Progress
                  value={(storageUsage.used / storageUsage.total) * 100}
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  已使用 {storageUsage.used}GB / 总共 {storageUsage.total}GB
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  className="w-full bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200"
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
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
