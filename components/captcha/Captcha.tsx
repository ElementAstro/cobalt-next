"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MathCaptcha } from "./MathCaptcha";
import { ImageCaptcha } from "./ImageCaptcha";
import { SliderCaptcha } from "./SliderCaptcha";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCaptchaStore } from "@/lib/store/captcha";
import { useTheme } from "next-themes";

type CaptchaType = "math" | "image" | "slider";

export function Captcha() {
  const {
    isDarkMode,
    isHighContrast,
    errorCount,
    isDisabled,
    timeLeft,
    setDarkMode,
    incrementError,
    resetError,
    disableCaptcha,
    decrementTime,
    setIsDisabled,
  } = useCaptchaStore();

  const [captchaType, setCaptchaType] = useState<CaptchaType>("math");
  const [showSettings, setShowSettings] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState("normal");
  const { theme, setTheme } = useTheme();
  const orientation =
    typeof window !== "undefined"
      ? window.screen.orientation.type.includes("landscape")
        ? "landscape"
        : "portrait"
      : "portrait";

  // 动画配置
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDisabled && timeLeft > 0) {
      timer = setTimeout(() => decrementTime(), 1000);
    } else if (timeLeft === 0) {
      setIsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [isDisabled, timeLeft, decrementTime, setIsDisabled]);

  const handleError = () => {
    incrementError();
    if (errorCount + 1 >= 5) {
      disableCaptcha(30);
    }
  };

  const handleSuccess = () => {
    resetError();
  };

  const renderCaptcha = () => {
    const props = {
      isDarkMode,
      isHighContrast,
      onError: handleError,
      onSuccess: handleSuccess,
      isDisabled,
      setIsDisabled,
    };
    switch (captchaType) {
      case "math":
        return <MathCaptcha {...props} />;
      case "image":
        return <ImageCaptcha {...props} />;
      case "slider":
        return <SliderCaptcha {...props} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`min-h-screen ${
        orientation === "landscape" ? "lg:flex-row" : "flex-col"
      } ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className={`container mx-auto p-4 ${
          orientation === "landscape" ? "lg:flex lg:space-x-4" : ""
        }`}
      >
        <Card className="flex-1">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl">增强型人机验证</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="dark-mode" className="text-sm">
                暗黑模式
              </Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={(checked) => setDarkMode(checked)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Select
                  onValueChange={(value: CaptchaType) => setCaptchaType(value)}
                  disabled={isDisabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择验证方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">数学问题</SelectItem>
                    <SelectItem value="image">图片验证码</SelectItem>
                    <SelectItem value="slider">滑块验证</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {isDisabled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>验证已被禁用</AlertTitle>
                    <AlertDescription>
                      由于多次失败,验证已被暂时禁用。请在 {timeLeft} 秒后重试。
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={captchaType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCaptcha()}
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {showSettings && (
          <motion.div variants={itemVariants} className="mt-4 lg:mt-0 lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>高级设置</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 新增的设置选项 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>主题</Label>
                    <Select
                      value={theme}
                      onValueChange={(value) => setTheme(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择主题" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">浅色</SelectItem>
                        <SelectItem value="dark">深色</SelectItem>
                        <SelectItem value="system">跟随系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>动画速度</Label>
                    <Select
                      value={animationSpeed}
                      onValueChange={setAnimationSpeed}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择动画速度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">慢速</SelectItem>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="fast">快速</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
