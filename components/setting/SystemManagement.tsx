"use client";

import { RefreshCw, Power } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSystemManagementStore } from "@/lib/store/settings";
import { Span } from "@/components/custom/Span";
import { SystemOverview } from "./SystemOverview";
import { ConfirmDialog } from "@/components/modal/ConfirmDialog";
import { useState } from "react";

interface SystemManagementProps {
  isDarkMode: boolean;
}

export default function SystemManagement({
  isDarkMode,
}: SystemManagementProps) {
  const { toast } = useToast();
  const { isRestartOpen, isShutdownOpen, setRestartOpen, setShutdownOpen } =
    useSystemManagementStore();

  const handleRestart = () => {
    toast({
      title: "重启中",
      description: "Lithium 正在重新启动，请稍候...",
    });
    setRestartOpen(false);
  };

  const handleShutdown = () => {
    toast({
      title: "关机中",
      description: "Lithium 正在安全关闭，请稍候...",
    });
    setShutdownOpen(false);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckUpdate = () => {
    // 检查更新的逻辑
  };

  const sdkVersions = {
    sdk1: "1.0.0",
    sdk2: "2.1.0",
    sdk3: "3.3.5",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card
          className={`border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } p-2 rounded-lg shadow-lg`}
        >
          <CardContent>
            <div className="space-y-4">
              {/* 系统操作 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 重启按钮 */}
                  <Button
                    className={`w-full flex items-center justify-center space-x-2 ${
                      isDarkMode
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    } text-white rounded-lg`}
                    onClick={() => setRestartOpen(true)}
                  >
                    <Power className="h-4 w-4" />
                    <span>重启</span>
                  </Button>

                  {/* 关机按钮 */}
                  <Button
                    className={`w-full flex items-center justify-center space-x-2 ${
                      isDarkMode
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white rounded-lg`}
                    onClick={() => setShutdownOpen(true)}
                  >
                    <Power className="h-4 w-4" />
                    <span>关机</span>
                  </Button>
                  <ConfirmDialog
                    isOpen={isShutdownOpen}
                    onClose={() => setShutdownOpen(false)}
                    title="确认关闭 Lithium"
                    message="此操作将关闭 Lithium。所有未保存的数据可能会丢失。您确定要继续吗？"
                    onConfirm={handleShutdown}
                    confirmText="确认关机"
                    cancelText="取消"
                    danger={true}
                  />
                </div>
              </div>

              <SystemOverview />

              {/* Lithium 版本 */}
              <div className="space-y-4">
                <div className="text-lg font-medium">Lithium 版本</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">App</span>
                    <Span variant="default" className="text-gray-500">
                      v1.0.2.20240816
                    </Span>
                  </div>
                  <motion.div
                    className="flex flex-col cursor-pointer"
                    onClick={handleToggleExpand}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-500">Core</span>
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } animate-spin`}
                      />
                    </div>
                    {isExpanded && (
                      <div className="mt-2">
                        {Object.entries(sdkVersions).map(([sdk, version]) => (
                          <div
                            key={sdk}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {sdk}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {version}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">SDK</span>
                    <Span variant="default" className="text-gray-500">
                      v3.0.1
                    </Span>
                  </div>
                  <Button
                    className={`w-full flex items-center justify-center space-x-2 ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white rounded-lg`}
                    onClick={handleCheckUpdate}
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>检查更新</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ConfirmDialog
          isOpen={isRestartOpen}
          onClose={() => setRestartOpen(false)}
          title="确认重启 Lithium"
          message="此操作将重启 Lithium。所有未保存的数据可能会丢失。您确定要继续吗？"
          onConfirm={handleRestart}
          confirmText="确认重启"
          cancelText="取消"
          danger={true}
        />
      </motion.div>
    </AnimatePresence>
  );
}
