"use client";

import React, { useEffect, useState, useRef } from "react";
import { Check, Copy, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
  theme?: "light" | "dark";
  fontSize?: "small" | "medium" | "large";
}

const themes = {
  light: "prism",
  dark: "prism-dark",
};

const fontSizes = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  className,
  theme = "light",
  fontSize = "medium",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language, currentTheme]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/${themes[currentTheme]}.min.css`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [currentTheme]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className={cn("relative group", className)}>
      <pre
        ref={codeRef}
        className={cn(
          "rounded-md transition-all duration-300 ease-in-out",
          { "line-numbers": showLineNumbers },
          fontSizes[currentFontSize],
          isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""
        )}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <div className="absolute right-2 top-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetCode}
          aria-label="Reset code"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="absolute left-2 bottom-2 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-2">
          <Switch
            id="line-numbers"
            checked={showLineNumbers}
            onCheckedChange={() => setShowLineNumbers(!showLineNumbers)}
          />
          <Label htmlFor="line-numbers">Line Numbers</Label>
        </div>
        <Select
          value={currentTheme}
          onValueChange={(value: "light" | "dark") => setCurrentTheme(value)}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={currentFontSize}
          onValueChange={(value: "small" | "medium" | "large") =>
            setCurrentFontSize(value)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Font Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
