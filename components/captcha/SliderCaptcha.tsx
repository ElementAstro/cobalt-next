"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCaptchaStore } from "@/lib/store/captcha";
import { CaptchaProps } from "@/types/captcha";

export function SliderCaptcha(props: CaptchaProps) {
  const { isDarkMode, isHighContrast, onError, onSuccess, isDisabled } =
    useCaptchaStore();

  const [sliderValue, setSliderValue] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const targetValue = useRef(Math.floor(Math.random() * 81) + 10); // 10-90 范围

  useEffect(() => {
    generateNewTarget();
  }, [isDarkMode, isHighContrast]);

  const generateNewTarget = () => {
    targetValue.current = Math.floor(Math.random() * 81) + 10; // 10-90 范围
    setSliderValue(0);
    setIsCorrect(null);
    setAttempts(0);
    setFeedback("");
  };

  const checkSlider = () => {
    const correct = Math.abs(sliderValue - targetValue.current) <= 2;
    setIsCorrect(correct);
    setAttempts((prev) => prev + 1);
    if (correct) {
      setFeedback("验证成功!");
      onSuccess();
      setTimeout(generateNewTarget, 2000);
    } else {
      onError();
      if (attempts >= 2) {
        setFeedback(`验证失败。正确位置是 ${targetValue.current}%。`);
        setTimeout(generateNewTarget, 3000);
      } else {
        setFeedback(`验证失败,还有 ${3 - attempts - 1} 次机会。`);
      }
    }
  };

  const getTextColor = () => {
    if (isHighContrast) {
      return isDarkMode ? "text-yellow-300" : "text-blue-700";
    }
    return isDarkMode ? "text-gray-200" : "text-gray-800";
  };

  return (
    <motion.div
      className={`space-y-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md max-w-md mx-auto`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`text-center ${getTextColor()}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        将滑块滑到 {targetValue.current}% 的位置
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Slider
          value={[sliderValue]}
          onValueChange={(value) => setSliderValue(value[0])}
          max={100}
          step={1}
          className={`w-full ${isDarkMode ? "bg-gray-700" : ""}`}
          disabled={isDisabled}
          aria-label="滑块验证"
        />
      </motion.div>

      <motion.div
        className={`text-center ${getTextColor()}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        当前位置: {sliderValue}%
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button onClick={checkSlider} className="w-full" disabled={isDisabled}>
          验证
        </Button>
      </motion.div>

      {feedback && (
        <motion.div
          className={`text-center ${
            isCorrect ? "text-green-500" : "text-red-500"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {feedback}
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          onClick={generateNewTarget}
          variant="outline"
          className="w-full"
          disabled={isDisabled}
        >
          刷新验证码
        </Button>
      </motion.div>
    </motion.div>
  );
}
