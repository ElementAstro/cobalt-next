"typescript";
"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SystemManagementProps {
  isDarkMode: boolean;
}

export default function SystemManagement({
  isDarkMode,
}: SystemManagementProps) {
  const { toast } = useToast();
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isShutdownOpen, setIsShutdownOpen] = useState(false);

  const handleRestart = () => {
    toast({
      title: "重启中",
      description: "Lithium 正在重新启动，请稍候...",
    });
    setIsRestartOpen(false);
  };

  const handleShutdown = () => {
    toast({
      title: "关机中",
      description: "Lithium 正在安全关闭，请稍候...",
    });
    setIsShutdownOpen(false);
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
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  系统操作
                </div>
                <div className="flex space-x-4">
                  <Dialog open={isRestartOpen} onOpenChange={setIsRestartOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className={`flex-1 ${
                          isDarkMode
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        重启
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-white text-black"
                      }
                    >
                      <DialogHeader>
                        <DialogTitle>确认重启 Lithium</DialogTitle>
                        <DialogDescription>
                          此操作将重启
                          Lithium。所有未保存的数据可能会丢失。您确定要继续吗？
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsRestartOpen(false)}
                        >
                          取消
                        </Button>
                        <Button
                          className="bg-yellow-600 hover:bg-yellow-700"
                          onClick={handleRestart}
                        >
                          确认重启
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={isShutdownOpen}
                    onOpenChange={setIsShutdownOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className={`flex-1 ${
                          isDarkMode
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        关机
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-white text-black"
                      }
                    >
                      <DialogHeader>
                        <DialogTitle>确认关闭 Lithium</DialogTitle>
                        <DialogDescription>
                          此操作将关闭
                          Lithium。所有未保存的数据可能会丢失。您确定要继续吗？
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsShutdownOpen(false)}
                        >
                          取消
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleShutdown}
                        >
                          确认关机
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } mb-2`}
              >
                Lithium 版本
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>App</span>
                  <span>v1.0.2.20240816</span>
                </div>
                <motion.div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => {}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Core</span>
                  <RefreshCw className={`h-4 w-4 animate-spin`} />
                </motion.div>
                <div className="flex justify-between items-center">
                  <span>SDK</span>
                  <span>v3.0.1</span>
                </div>
                <Button
                  className={`w-full ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } mt-2`}
                  disabled
                >
                  检查更新
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
