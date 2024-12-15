import React, { useState } from "react";
import { Wifi, RefreshCw, Cog } from "lucide-react";
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
import WifiList from "@/components/setting/WiFiList";
import { useNetworkStore } from "@/lib/store/settings";
import { NetworkBridgeConfigModal } from "@/components/setting/NetworkBridgeConfigModal";

interface NetworkSettingsProps {
  isDarkMode: boolean;
}

export default function NetworkSettings({ isDarkMode }: NetworkSettingsProps) {
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showBridgeConfigModal, setShowBridgeConfigModal] = useState(false);
  const { resetSettings } = useNetworkStore();

  const handleNetworkReset = () => {
    resetSettings();
    toast({
      title: "网络设置已重置",
      description: "请重新配置您的网络连接",
    });
    setShowResetDialog(false);
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
        exit={{ opacity: 0, y: 20 }}
        variants={containerVariants}
        className="space-y-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Button
            className={`flex-1 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors duration-200 flex items-center justify-center`}
            onClick={() => setShowBridgeConfigModal(true)}
          >
            <Cog className="mr-2 h-4 w-4" />
            修改
          </Button>
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button
                className={`flex-1 ${
                  isDarkMode
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
                } transition-colors duration-200 flex items-center justify-center`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重置
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } rounded-lg p-6`}
            >
              <DialogHeader>
                <DialogTitle>确认重置网络设置</DialogTitle>
                <DialogDescription>
                  此操作将重置所有网络设置。您确定要继续吗？
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResetDialog(false)}
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  取消
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleNetworkReset}
                >
                  确认重置
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
        <motion.div variants={itemVariants}>
          <WifiList />
        </motion.div>
      </motion.div>
      <NetworkBridgeConfigModal
        isOpen={showBridgeConfigModal}
        onClose={() => setShowBridgeConfigModal(false)}
        onSave={(config) => {
          // 保存配置逻辑
          console.log("保存配置", config);
          setShowBridgeConfigModal(false);
        }}
      />
    </AnimatePresence>
  );
}
