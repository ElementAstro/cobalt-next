"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CustomIframe } from "@/components/home/iframe";
import { App } from "@/types/extra";

interface AppLaunchModalProps {
  app: App | null;
  onClose: () => void;
}

export function AppLaunchModal({ app, onClose }: AppLaunchModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (app) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // 2秒加载时间

      return () => clearTimeout(timer);
    }
  }, [app]);

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

          {isLoading ? (
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
                console.log("应用加载完成");
              }}
              onError={() => {
                console.error("应用加载失败");
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
