"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Frown, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { useOrientation } from "@/hooks/use-orientation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const config404 = {
  errorCode: "404_PAGE_NOT_FOUND",
  errorMessage: "页面未找到",
  collectingInfoText: "正在收集错误信息...",
  homeButtonText: "返回首页",
  reloadButtonText: "重新加载页面",
  backgroundColor: "bg-blue-600",
  textColor: "text-white",
  errorDetailsText: "查看详细错误信息",
  feedbackText: "提交错误反馈",
};

interface BlueScreen404Props {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  isErrorBoundary?: boolean;
}

export default function BlueScreen404({
  error,
  errorInfo,
  isErrorBoundary = false,
}: BlueScreen404Props) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const isLandscape = useOrientation();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showContent]);

  const errorDetails = `
    错误时间: ${new Date().toLocaleString()}
    浏览器: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
    页面URL: ${typeof window !== "undefined" ? window.location.href : ""}
    错误代码: ${
      isErrorBoundary ? error?.name || "UNKNOWN_ERROR" : config404.errorCode
    }
    错误信息: ${error?.message || config404.errorMessage}
    ${errorInfo ? `\n组件堆栈:\n${errorInfo.componentStack}` : ""}
    ${error?.stack ? `\n错误堆栈:\n${error.stack}` : ""}
  `.trim();

  return (
    <div
      className={`min-h-screen ${config404.backgroundColor} ${config404.textColor} p-4 sm:p-8 flex flex-col justify-center items-center transition-opacity duration-1000 ease-in-out overflow-hidden`}
      style={{ opacity: showContent ? 1 : 0 }}
    >
      <div
        className={`w-full ${
          isLandscape ? "max-w-full" : "max-w-2xl"
        } space-y-4 sm:space-y-8`}
      >
        <div className="flex items-center space-x-4 animate-pulse">
          <Frown className="h-8 w-8 sm:h-12 sm:w-12" />
          <h1 className="text-2xl sm:text-4xl font-bold">:(</h1>
        </div>
        <div className="space-y-2 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {isErrorBoundary
              ? "你的应用遇到了致命错误，需要重新启动。"
              : "你的电脑遇到了问题，需要重新启动。"}
          </h2>
          <p className="text-base sm:text-lg">
            错误代码:{" "}
            {isErrorBoundary
              ? error?.name || "UNKNOWN_ERROR"
              : config404.errorCode}
          </p>
          <p className="text-base sm:text-lg">
            错误信息: {error?.message || config404.errorMessage}
          </p>
        </div>
        <div className="space-y-2">
          <div className="bg-blue-500 h-2 rounded-full overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm sm:text-base">
            {config404.collectingInfoText} {progress}% 完成
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="error-details">
            <AccordionTrigger className="text-sm sm:text-base">
              查看详细错误信息
            </AccordionTrigger>
            <AccordionContent>
              <pre className="whitespace-pre-wrap text-xs sm:text-sm">
                {errorDetails}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div
          className={`space-y-2 sm:space-y-0 ${
            isLandscape ? "sm:space-x-4 sm:flex" : "grid grid-cols-2 gap-2"
          }`}
        >
          <Button asChild className="w-full" variant="secondary">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {config404.homeButtonText}
            </Link>
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {config404.reloadButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
