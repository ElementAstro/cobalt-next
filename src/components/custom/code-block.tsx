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
      className={`relative group p-4 rounded-lg shadow ${
        customBackground ? `bg-[${customBackground}]` : "bg-gray-800"
      } overflow-auto`}
    >
      <pre
        ref={codeRef}
        className={`${showLineNumbersState ? "line-numbers" : ""} ${
          fontSizes[currentFontSize]
        } ${
          isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-gray-900 p-4" : ""
        } ${isWordWrap ? "whitespace-pre-wrap" : "whitespace-pre"} ${
          isFolded ? "max-h-32 overflow-hidden" : ""
        } ${
          currentTheme === "dark" ? "text-white" : "text-black"
        } ${className}`}
        data-line={highlightLines.join(",")}
        style={{ backgroundColor: customBackground || undefined }}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>

      {/* Top Right Controls */}
      <div className="absolute right-2 top-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
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
          variant="ghost"
          size="icon"
          onClick={resetCode}
          aria-label="Reset code"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
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

      {/* Bottom Left Controls */}
      <div className="absolute left-2 bottom-2 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 bg-opacity-80 p-2 rounded-lg">
        {/* Line Numbers Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="line-numbers"
            checked={showLineNumbersState}
            onCheckedChange={(checked) => setShowLineNumbersState(!!checked)}
          />
          <Label htmlFor="line-numbers">Line Numbers</Label>
        </div>

        {/* Theme Selector */}
        <Select
          value={currentTheme}
          onValueChange={(value) =>
            setCurrentTheme(value as typeof currentTheme)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="coy">Coy</SelectItem>
            <SelectItem value="twilight">Twilight</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size Selector */}
        <Select
          value={currentFontSize}
          onValueChange={(value) =>
            setCurrentFontSize(value as typeof currentFontSize)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">XS</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
          </SelectContent>
        </Select>

        {/* Word Wrap Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="word-wrap"
            checked={isWordWrap}
            onCheckedChange={() => setIsWordWrap(!isWordWrap)}
          />
          <Label htmlFor="word-wrap">Word Wrap</Label>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-32 h-8"
              aria-label="Search code"
            />
            <Search className="h-4 w-4 text-gray-300" />
          </div>
        )}

        {/* Fold/Unfold */}
        {showFold && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFolded(!isFolded)}
            aria-label={isFolded ? "Unfold code" : "Fold code"}
            className="flex items-center gap-1"
          >
            {isFolded ? (
              <Check className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isFolded ? "Unfold" : "Fold"}
          </Button>
        )}

        {/* Export */}
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
            aria-label="Export code"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}

        {/* Background Color Picker */}
        <Input
          type="color"
          value={customBackground || "#1e293b"}
          onChange={(e) => setCustomBackground(e.target.value)}
          className="w-6 h-6 p-0 border-none"
          aria-label="Select background color"
        />
      </div>
    </div>
  );
}
