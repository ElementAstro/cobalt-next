"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  Settings,
  HelpCircle,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 动态导入校准组件以优化加载性能
const GuidingCalibration = dynamic(
  () => import("@/components/guiding/calibration/GuidingCalibration"),
  {
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function CalibrationPage() {
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // 检查设备兼容性
    const checkDeviceCompatibility = () => {
      const warnings = [];
      
      if (!window.WebGL2RenderingContext) {
        warnings.push("WebGL 2 不受支持");
      }
      
      if (!navigator.mediaDevices?.getUserMedia) {
        warnings.push("相机API不受支持");
      }

      if (warnings.length > 0) {
        toast({
          variant: "destructive",
          title: "设备兼容性警告",
          description: warnings.join(", "),
        });
      }
    };

    checkDeviceCompatibility();
  }, [toast]);

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="dark:bg-gray-900 min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md dark:bg-gray-900/50 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Home className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>返回首页</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <h1 className="text-lg font-medium">天文相机校准</h1>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsDark(!isDark)}
                      >
                        {isDark ? (
                          <Sun className="w-5 h-5" />
                        ) : (
                          <Moon className="w-5 h-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>切换主题</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>设置</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>帮助</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 pb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-7xl mx-auto dark:bg-gray-800/50 dark:border-gray-700">
              <GuidingCalibration />
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
