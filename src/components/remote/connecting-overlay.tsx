"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Monitor, Wifi, Shield, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConnectingOverlayProps {
  isConnecting: boolean;
  connectionStage:
    | "initializing"
    | "authenticating"
    | "establishing"
    | "connected";
  progress: number;
}

const stages = {
  initializing: {
    icon: Monitor,
    text: "初始化连接...",
    color: "text-blue-400",
  },
  authenticating: {
    icon: Shield,
    text: "验证身份...",
    color: "text-purple-400",
  },
  establishing: { icon: Wifi, text: "建立通信...", color: "text-green-400" },
  connected: {
    icon: CheckCircle,
    text: "连接成功！",
    color: "text-emerald-400",
  },
};

const ConnectingOverlay: React.FC<ConnectingOverlayProps> = ({
  isConnecting,
  connectionStage,
  progress,
}) => {
  const CurrentIcon = stages[connectionStage].icon;
  const iconColor = stages[connectionStage].color;

  return (
    <AnimatePresence>
      {isConnecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-card/95 p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-6 max-w-md w-full mx-4 border border-white/10"
          >
            <div className="relative w-20 h-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Loader2 className="h-full w-full text-primary/20" />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CurrentIcon
                  className={`h-10 w-10 ${iconColor} relative z-10`}
                />
              </motion.div>
            </div>

            <motion.div
              className="text-center space-y-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold">
                {stages[connectionStage].text}
              </h3>
              <p className="text-sm text-muted-foreground">
                请保持网络连接稳定...
              </p>
            </motion.div>

            <motion.div
              className="w-full space-y-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Progress
                value={progress}
                className="h-2 bg-background/50 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/80"
              />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(progress)}%
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectingOverlay;
