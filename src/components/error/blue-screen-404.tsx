"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Frown, RefreshCcw, Home, Copy, Camera } from "lucide-react";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
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
  reportErrorText: "报告错误",
  copyErrorText: "复制错误信息",
  copiedText: "已复制",
  systemInfoText: "系统信息",
  screenshotText: "截图",
  screenshotSuccessText: "截图已保存",
  screenshotErrorText: "截图失败",
  theme: "light", // light | dark
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
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [screenshotStatus, setScreenshotStatus] = useState<"idle" | "success" | "error">("idle");
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });

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

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error details:", err);
    }
  };

  const handleTakeScreenshot = async () => {
    try {
      setScreenshotStatus("idle");
      const canvas = await html2canvas(document.body);
      const link = document.createElement("a");
      link.download = `error-screenshot-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      setScreenshotStatus("success");
    } catch (error) {
      console.error("Failed to take screenshot:", error);
      setScreenshotStatus("error");
    }
  };

  const errorDetails = `
    ${t("errorTime")}: ${new Date().toLocaleString()}
    ${t("browser")}: ${
    typeof navigator !== "undefined" ? navigator.userAgent : "N/A"
  }
    ${t("pageURL")}: ${
    typeof window !== "undefined" ? window.location.href : ""
  }
    ${t("errorCode")}: ${
    isErrorBoundary ? error?.name || "UNKNOWN_ERROR" : config404.errorCode
  }
    ${t("errorMessage")}: ${error?.message || config404.errorMessage}
    ${errorInfo ? `\n${t("componentStack")}:\n${errorInfo.componentStack}` : ""}
    ${error?.stack ? `\n${t("errorStack")}:\n${error.stack}` : ""}
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
            {isErrorBoundary ? t("fatalAppError") : t("fatalSystemError")}
          </h2>
          <p className="text-base sm:text-lg">
            {t("errorCode")}:{" "}
            {isErrorBoundary
              ? error?.name || "UNKNOWN_ERROR"
              : config404.errorCode}
          </p>
          <p className="text-base sm:text-lg">
            {t("errorMessage")}: {error?.message || config404.errorMessage}
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
            {t("collectingInfoText")} {progress}% {t("completed")}
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="error-details">
            <AccordionTrigger className="text-sm sm:text-base">
              {t("viewErrorDetails")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="relative">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm bg-gray-800 p-4 rounded">
                  {errorDetails}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopyError}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? t("copiedText") : t("copyErrorText")}
                </Button>
              </div>
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
              {t("homeButtonText")}
            </Link>
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t("reloadButtonText")}
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleTakeScreenshot}
            disabled={screenshotStatus !== "idle"}
          >
            <Camera className="mr-2 h-4 w-4" />
            {screenshotStatus === "success"
              ? t("screenshotSuccessText")
              : screenshotStatus === "error"
              ? t("screenshotErrorText")
              : t("screenshotText")}
          </Button>
        </div>
      </div>
    </div>
  );
}
