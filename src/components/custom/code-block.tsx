"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Check,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-highlight/prism-line-highlight.js";
import "prismjs/plugins/line-highlight/prism-line-highlight.css";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
  theme?: "light" | "dark" | "material" | "coy" | "twilight";
  fontSize?: "xs" | "small" | "medium" | "large" | "xl";
  wordWrap?: boolean;
  showExport?: boolean;
  background?: string;
  highlightLines?: number[];
  showSearch?: boolean;
  showFold?: boolean;
}

const themes = {
  light: "prism",
  dark: "prism-dark",
  material: "prism-material",
  coy: "prism-coy",
  twilight: "prism-twilight",
};

const fontSizes = {
  xs: "text-xs",
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  xl: "text-xl",
};

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  className,
  theme = "light",
  fontSize = "medium",
  wordWrap = false,
  showExport = true,
  background,
  highlightLines = [],
  showSearch = true,
  showFold = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [showLineNumbersState, setShowLineNumbersState] =
    useState(showLineNumbers);
  const [isWordWrap, setIsWordWrap] = useState(wordWrap);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFolded, setIsFolded] = useState(false);
  const [customBackground, setCustomBackground] = useState(background || "");
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    Prism.highlightAll();
    if (highlightLines.length > 0) {
      const lines = highlightLines.join(",");
      codeRef.current?.setAttribute("data-line", lines);
    } else {
      codeRef.current?.removeAttribute("data-line");
    }
  }, [code, language, currentTheme, highlightLines]);

  useEffect(() => {
    const existingLink = document.getElementById(
      "prism-theme"
    ) as HTMLLinkElement;
    if (existingLink) {
      existingLink.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/${themes[currentTheme]}.min.css`;
    } else {
      const link = document.createElement("link");
      link.id = "prism-theme";
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/${themes[currentTheme]}.min.css`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, [currentTheme]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const resetCode = () => {
    if (codeRef.current) {
      codeRef.current.textContent = code;
      Prism.highlightElement(codeRef.current);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      codeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (codeRef.current) {
      const text = codeRef.current.textContent || "";
      if (query === "") {
        codeRef.current.innerHTML = Prism.highlight(
          text,
          Prism.languages[language],
          language
        );
      } else {
        const regex = new RegExp(`(${query})`, "gi");
        const highlighted = text.replace(
          regex,
          `<span class="bg-yellow-200">$1</span>`
        );
        codeRef.current.innerHTML = highlighted;
        Prism.highlightElement(codeRef.current);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative group rounded-lg shadow-lg overflow-hidden",
        customBackground ? `bg-[${customBackground}]` : "bg-gray-800/95"
      )}
    >
      {/* 代码区域 */}
      <div className="relative">
        <pre
          ref={codeRef}
          className={cn(
            "p-4",
            showLineNumbersState && "line-numbers",
            fontSizes[currentFontSize],
            isWordWrap ? "whitespace-pre-wrap" : "whitespace-pre",
            isFolded && "max-h-32",
            currentTheme === "dark" ? "text-white" : "text-black",
            isFullscreen &&
              "fixed inset-0 z-50 bg-gray-900/95 overflow-auto p-6",
            className
          )}
          data-line={highlightLines.join(",")}
          style={{ backgroundColor: customBackground || undefined }}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>

        {/* 顶部工具栏 - 始终可见 */}
        <div className="absolute top-0 right-0 p-2 flex items-center space-x-2 bg-gray-800/80 backdrop-blur rounded-bl-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 底部工具栏 - 悬停时显示 */}
      <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        <div className="p-2 bg-gray-800/95 backdrop-blur flex flex-wrap gap-2 items-center justify-between">
          {/* 左侧控件组 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="line-numbers"
                checked={showLineNumbersState}
                onCheckedChange={(checked) =>
                  setShowLineNumbersState(!!checked)
                }
              />
              <Label htmlFor="line-numbers" className="text-xs text-gray-300">
                Lines
              </Label>
            </div>

            <Select
              value={currentTheme}
              onValueChange={(value) =>
                setCurrentTheme(value as typeof currentTheme)
              }
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(themes).map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentFontSize}
              onValueChange={(value) =>
                setCurrentFontSize(value as typeof currentFontSize)
              }
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(fontSizes).map((size) => (
                  <SelectItem key={size} value={size}>
                    {size.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 右侧控件组 */}
          <div className="flex flex-wrap items-center gap-2">
            {showSearch && (
              <div className="flex items-center gap-2 min-w-[8rem]">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="h-8 text-sm"
                />
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            )}

            {showFold && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFolded(!isFolded)}
                className="h-8"
              >
                {isFolded ? "Unfold" : "Fold"}
              </Button>
            )}

            {showExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const blob = new Blob([code], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `code.${language}`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}

            <Input
              type="color"
              value={customBackground || "#1e293b"}
              onChange={(e) => setCustomBackground(e.target.value)}
              className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
