"use client";

import { useState } from "react";
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
import WifiList from "@/components/setting/WifiList";

interface NetworkSettingsProps {
  isDarkMode: boolean;
}

export default function NetworkSettings({ isDarkMode }: NetworkSettingsProps) {
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleNetworkReset = () => {
    // Simulating network reset
    toast({
      title: "网络设置已重置",
      description: "请重新配置您的网络连接",
    });
    setShowResetDialog(false);
  };

  return (
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
          <div className="space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className={`flex-1 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  修改
                </Button>
                <Dialog
                  open={showResetDialog}
                  onOpenChange={setShowResetDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      className={`flex-1 ${
                        isDarkMode
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      重置
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
                      <DialogTitle>确认重置网络设置</DialogTitle>
                      <DialogDescription>
                        此操作将重置所有网络设置。您确定要继续吗？
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowResetDialog(false)}
                      >
                        取消
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleNetworkReset}
                      >
                        确认重置
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <WifiList />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
