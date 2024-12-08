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

type CaptchaType = "math" | "image" | "slider";

export function Captcha() {
  const [captchaType, setCaptchaType] = useState<CaptchaType>("math");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDisabled && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [isDisabled, timeLeft]);

  const handleError = () => {
    setErrorCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 5) {
        setIsDisabled(true);
        setTimeLeft(30);
      }
      return newCount;
    });
  };

  const handleSuccess = () => {
    setErrorCount(0);
  };

  const renderCaptcha = () => {
    const props = {
      isDarkMode,
      isHighContrast,
      onError: handleError,
      onSuccess: handleSuccess,
      isDisabled,
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
    <div
      className={`flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4`}
    >
      <Card
        className={`w-full max-w-sm ${
          isDarkMode ? "dark" : ""
        } shadow-lg rounded-lg`}
      >
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl">增强型人机验证</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode" className="text-sm">
              暗黑模式
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={() => setIsDarkMode((prev) => !prev)}
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
    </div>
  );
}
