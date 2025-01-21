"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  XCircle, 
  Loader2, 
  WifiOff, 
  Bell,
  Satellite,
  Telescope,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConnectionStore } from "@/store/useConnectionStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const AlertType = z.enum([
  "success", 
  "error", 
  "info", 
  "warning", 
  "loading", 
  "offline", 
  "connecting", 
  "weak-signal"
]);
type AlertType = z.infer<typeof AlertType>;

const alertSchema = z.object({
  showAlert: z.boolean(),
  alertType: AlertType,
  message: z.string().optional(),
  autoHideDuration: z.number().min(0).max(60000).optional()
});

interface ConnectionAlertProps {
  showAlert: boolean;
  alertType: AlertType;
  message?: string;
  autoHideDuration?: number;
}

export function ConnectionAlert({
  showAlert,
  alertType,
  message,
  autoHideDuration = 5000,
}: ConnectionAlertProps) {
  const [isVisible, setIsVisible] = useState(showAlert);
  const { connectionStrength } = useConnectionStore();

  // 验证传入的props
  useEffect(() => {
    try {
      alertSchema.parse({
        showAlert,
        alertType,
        message,
        autoHideDuration
      });
    } catch (error) {
      console.error("Invalid alert props:", error);
      return;
    }
  }, [showAlert, alertType, message, autoHideDuration]);

  const clearAlert = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(showAlert);
  }, [showAlert]);

  useEffect(() => {
    if (showAlert && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        clearAlert();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [showAlert, autoHideDuration, clearAlert]);

  const getSignalIcon = () => {
    if (connectionStrength > 75) {
      return <SignalHigh className="h-4 w-4 text-green-500" />;
    } else if (connectionStrength > 50) {
      return <SignalMedium className="h-4 w-4 text-yellow-500" />;
    } else if (connectionStrength > 25) {
      return <SignalLow className="h-4 w-4 text-orange-500" />;
    } else {
      return <SignalZero className="h-4 w-4 text-red-500" />;
    }
  };

  const alertConfig = {
    success: {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      title: "连接成功",
      description: message || "已成功建立连接",
      variant: "default" as const,
    },
    error: {
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      title: "连接错误",
      description: message || "连接过程中发生错误",
      variant: "destructive" as const,
    },
    info: {
      icon: <Info className="h-4 w-4 text-blue-500" />,
      title: "连接信息",
      description: message || "连接状态更新",
      variant: "default" as const,
    },
    warning: {
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      title: "连接警告",
      description: message || "连接可能出现问题",
      variant: "default" as const,
    },
    loading: {
      icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
      title: "连接中...",
      description: message || "正在建立连接，请稍候",
      variant: "default" as const,
    },
    offline: {
      icon: <WifiOff className="h-4 w-4 text-gray-500" />,
      title: "离线状态",
      description: message || "网络连接已断开",
      variant: "default" as const,
    },
    connecting: {
      icon: <Satellite className="h-4 w-4 text-purple-500 animate-pulse" />,
      title: "正在连接",
      description: message || "正在与天文设备建立连接",
      variant: "default" as const,
    },
    "weak-signal": {
      icon: getSignalIcon(),
      title: "信号较弱",
      description: message || `当前信号强度：${connectionStrength}%`,
      variant: "default" as const,
    }
  };

  const currentAlert = alertConfig[alertType] || alertConfig.info;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Alert variant={currentAlert.variant}>
            <div className="flex items-center space-x-2">
              {currentAlert.icon}
              <div>
                <AlertTitle>{currentAlert.title}</AlertTitle>
                <AlertDescription>{currentAlert.description}</AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={clearAlert}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            {alertType === "connecting" && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                <Telescope className="h-4 w-4" />
                <span>正在同步天文设备...</span>
              </div>
            )}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
