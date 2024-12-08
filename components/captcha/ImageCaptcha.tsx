"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ImageCaptchaProps {
  isDarkMode: boolean;
  isHighContrast: boolean;
  onError: () => void;
  onSuccess: () => void;
  isDisabled: boolean;
}

export function ImageCaptcha({
  isDarkMode,
  isHighContrast,
  onError,
  onSuccess,
  isDisabled,
}: ImageCaptchaProps) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateNewCaptcha();
  }, [isDarkMode, isHighContrast]);

  const generateNewCaptcha = () => {
    const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptchaText(newCaptcha);
    setUserInput("");
    setIsCorrect(null);
    setAttempts(0);
    setFeedback("");
    drawCaptcha(newCaptcha);
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isDarkMode ? "#1F2937" : "#F3F4F6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "30px Arial";
        ctx.fillStyle = isHighContrast
          ? isDarkMode
            ? "#FBBF24"
            : "#1E40AF"
          : isDarkMode
          ? "#E5E7EB"
          : "#1F2937";

        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(30 + i * 25, 35);
          ctx.rotate((Math.random() - 0.5) * 0.4);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }

        // Add noise
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2
          );
        }
      }
    }
  };

  const checkAnswer = () => {
    const correct = userInput.toUpperCase() === captchaText;
    setIsCorrect(correct);
    setAttempts(attempts + 1);
    if (correct) {
      setFeedback("验证成功!");
      onSuccess();
      setTimeout(generateNewCaptcha, 2000);
    } else {
      onError();
      if (attempts >= 2) {
        setFeedback(`验证失败。正确答案是 ${captchaText}。`);
        setTimeout(generateNewCaptcha, 3000);
      } else {
        setFeedback(`验证失败,还有 ${3 - attempts - 1} 次机会。`);
      }
    }
  };

  return (
    <motion.div
      className={`space-y-4 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg shadow-md max-w-md mx-auto`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width="200"
        height="70"
        className="mx-auto border"
        aria-label="图片验证码"
      ></canvas>
      <Input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="输入验证码"
        className={`w-full ${isDarkMode ? "bg-gray-700 text-white" : ""}`}
        disabled={isDisabled}
        aria-label="图片验证码答案"
      />
      <Button onClick={checkAnswer} className="w-full" disabled={isDisabled}>
        验证
      </Button>
      {feedback && (
        <motion.div
          className={`text-center ${
            isCorrect ? "text-green-500" : "text-red-500"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {feedback}
        </motion.div>
      )}
      <Button
        onClick={generateNewCaptcha}
        variant="outline"
        className="w-full"
        disabled={isDisabled}
      >
        刷新验证码
      </Button>
    </motion.div>
  );
}
