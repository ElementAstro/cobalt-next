"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorDisplay } from "./error-display";

interface EnhancedPreviewProps {
  style: React.CSSProperties;
}

const previewSizes = {
  mobile: "w-full sm:w-64 h-[420px]",
  tablet: "w-full sm:w-[512px] h-[640px]",
  desktop: "w-full h-[480px]",
} as const;

const generatePreviewHTML = (style: React.CSSProperties) => `
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
      </style>
    </head>
    <body>
      <div class="background" style="${Object.entries(style)
        .filter(([_, value]) => value != null)
        .map(
          ([key, value]) =>
            `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`
        )
        .join(" ")}"></div>
      <h1>全屏预览模式</h1>
    </body>
  </html>
`;

export function EnhancedPreview({ style }: EnhancedPreviewProps) {
  const [previewSize, setPreviewSize] =
    useState<keyof typeof previewSizes>("desktop");
  const [previewContent, setPreviewContent] = useState<
    "empty" | "text" | "image"
  >("empty");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      // 只验证必要的样式属性
      if (!style || typeof style !== "object") {
        throw new Error("无效的样式对象");
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "预览出错");
    }
  }, [style]);

  const handleOpenFullscreen = useCallback(() => {
    setIsLoading(true);
    try {
      const blob = new Blob([generatePreviewHTML(style)], {
        type: "text/html",
      });
      const url = URL.createObjectURL(blob);
      const previewWindow = window.open(url, "_blank");

      // 清理 blob URL
      if (previewWindow) {
        previewWindow.onload = () => {
          URL.revokeObjectURL(url);
        };
      } else {
        URL.revokeObjectURL(url);
        setError("无法打开预览窗口，请检查浏览器设置");
      }
    } catch (err) {
      setError("创建预览失败");
    } finally {
      setIsLoading(false);
    }
  }, [style]);

  const renderPreviewContent = () => {
    switch (previewContent) {
      case "text":
        return (
          <div className="p-4 text-white">
            <h2 className="text-2xl font-bold mb-2">示例标题</h2>
            <p className="text-base">
              这是一些示例文本，用于展示背景效果。您可以根据需要调整背景以确保文本清晰可读。
            </p>
          </div>
        );
      case "image":
        return (
          <div className="flex justify-center items-center h-full">
            <img
              src="/placeholder.svg"
              alt="示例图片"
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg font-semibold">增强预览</h3>
        <div className="flex flex-wrap gap-2">
          <Select value={previewSize} onValueChange={setPreviewSize}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="选择预览大小" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">移动端</SelectItem>
              <SelectItem value="tablet">平板</SelectItem>
              <SelectItem value="desktop">桌面</SelectItem>
            </SelectContent>
          </Select>
          <Select value={previewContent} onValueChange={setPreviewContent}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="选择预览内容" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empty">空白</SelectItem>
              <SelectItem value="text">文本</SelectItem>
              <SelectItem value="image">图片</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={`relative overflow-hidden rounded-lg transition-all duration-300 ${previewSizes[previewSize]}`}
        style={style}
      >
        {renderPreviewContent()}
      </div>

      <Button
        onClick={handleOpenFullscreen}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? "正在生成预览..." : "打开全屏预览"}
      </Button>
    </div>
  );
}
