"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Monitor, Wifi, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConnectingOverlayProps {
  isConnecting: boolean;
  connectionStage: "initializing" | "authenticating" | "establishing" | "connected";
  progress: number;
}

const stages = {
  initializing: { icon: Monitor, text: "初始化连接..." },
  authenticating: { icon: Shield, text: "验证身份..." },
  establishing: { icon: Wifi, text: "建立通信..." },
  connected: { icon: Monitor, text: "连接成功！" },
};

const ConnectingOverlay: React.FC<ConnectingOverlayProps> = ({
  isConnecting,
  connectionStage,
  progress,
}) => {
  const CurrentIcon = stages[connectionStage].icon;

  return (
    <AnimatePresence>
      {isConnecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card p-8 rounded-lg shadow-xl flex flex-col items-center space-y-6 max-w-md w-full mx-4"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Loader2 className="h-12 w-12 text-primary" />
              </motion.div>
              <CurrentIcon className="h-8 w-8 text-primary relative z-10" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">{stages[connectionStage].text}</h3>
              <p className="text-sm text-muted-foreground">
                请保持网络连接稳定...
              </p>
            </div>

            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(progress)}%
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectingOverlay;
