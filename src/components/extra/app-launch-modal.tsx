"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CustomIframe } from "@/components/home/iframe";
import { App } from "@/types/extra";
import { AppSchema } from "@/types/extra/validation";
import { useAppLaunchStore } from "@/store/extra/app-launch-store";
import { toast } from "@/hooks/use-toast";

interface AppLaunchModalProps {
  app: App | null;
  onClose: () => void;
}

export function AppLaunchModal({ app, onClose }: AppLaunchModalProps) {
  const {
    retryCount,
    maxRetries,
    isLoading,
    error,
    incrementRetry,
    resetRetry,
    setLoading,
    setError,
  } = useAppLaunchStore();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!app) return;

    // Validate app data
    try {
      AppSchema.parse(app);
    } catch (err) {
      setError("Invalid app configuration");
      return;
    }

    resetRetry();
    setLoading(true);
    setError(null);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 200);

    const timer = setTimeout(() => {
      setLoading(false);
      clearInterval(interval);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [app, resetRetry, setError, setLoading]);

  if (!app) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card p-6 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] relative"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {error ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-bold text-destructive">加载失败</h2>
              <p className="text-muted-foreground text-center">
                {error}
                <br />
                重试次数: {retryCount}/{maxRetries}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (retryCount < maxRetries) {
                      incrementRetry();
                      setLoading(true);
                      setError(null);
                    } else {
                      onClose();
                    }
                  }}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  {retryCount < maxRetries ? "重试" : "关闭"}
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              </motion.div>
              <h2 className="text-2xl font-bold">{app.name}</h2>
              <Progress value={progress} className="w-[60%]" />
              <p className="text-muted-foreground">正在启动应用...</p>
            </div>
          ) : (
            <CustomIframe
              src={`${app.url}`}
              title={app.name}
              className="w-full h-full"
              allowFullScreen={true}
              showDeviceSelector={true}
              showZoomControls={true}
              showInfoPanel={true}
              allowScripts={true}
              lazy={false}
              timeout={10000}
              refreshInterval={0}
              loadingComponent={
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">加载中...</p>
                </div>
              }
              errorComponent={
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <p className="text-destructive">加载失败</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    重试
                  </Button>
                </div>
              }
              onLoad={() => {
                setError(null);
                setLoading(false);
                toast({
                  title: "应用加载成功",
                  description: `${app.name} 已准备就绪`,
                  action: <CheckCircle className="h-6 w-6 text-green-500" />,
                });
              }}
              onError={() => {
                setError("无法加载应用内容");
                setLoading(false);
                toast({
                  title: "应用加载失败",
                  description: "请检查网络连接或应用配置",
                  variant: "destructive",
                  action: <AlertCircle className="h-6 w-6 text-destructive" />,
                });
              }}
              onDeviceChange={(device) => {
                console.log("切换设备:", device);
              }}
              onScreenshot={(dataUrl) => {
                console.log("截图:", dataUrl);
              }}
              customStyles={{
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius)",
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
