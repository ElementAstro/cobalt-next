"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clipboard,
  X,
  Copy,
  ClipboardPaste as PasteIcon,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Moon,
  Sun,
  Tag,
  Globe,
  ExternalLink,
  Search,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useHotkeys } from "react-hotkeys-hook";
import { Badge } from "../ui/badge";

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
  tags: string[];
  formatted?: boolean;
}

type ClipboardSize = "small" | "medium" | "large";
type ClipboardTheme = "default" | "minimal" | "glass";

export function AdvancedFloatingClipboard() {
  const [activeTab, setActiveTab] = useState("current");
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasPastePermission, setHasPastePermission] = useState<boolean | null>(null);
  const [size, setSize] = useState<ClipboardSize>("medium");
  const [theme, setTheme] = useState<ClipboardTheme>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: "w-64",
    medium: "w-96",
    large: "w-[600px]",
  };

  const themeClasses = {
    default: "bg-background",
    minimal: "bg-transparent border border-border",
    glass: "backdrop-blur-lg bg-opacity-50",
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("clipboardHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedPosition = localStorage.getItem("clipboardPosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }

    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
      localStorage.setItem("clipboardPosition", JSON.stringify(position));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, dragOffset, position]);

  useEffect(() => {
    localStorage.setItem("clipboardHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const checkClipboardPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({
        name: "clipboard-read" as PermissionName,
      });
      setHasPastePermission(result.state === "granted");
    } catch (error) {
      console.error("检查剪贴板权限错误:", error);
      setHasPastePermission(false);
    }
  }, []);

  useEffect(() => {
    checkClipboardPermission();
  }, [checkClipboardPermission]);

  const handleStart = (clientX: number, clientY: number) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) =>
    handleStart(e.clientX, e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        addToHistory(content);
        toast({
          title: "复制成功",
          description: "内容已复制到剪贴板。",
        });
      })
      .catch((err) => {
        console.error("无法复制文本: ", err);
        toast({
          title: "复制失败",
          description: "无法复制内容。",
          variant: "destructive",
        });
      });
  };

  const handlePaste = async () => {
    if (!hasPastePermission) {
      toast({
        title: "粘贴权限被拒绝",
        description: "无法访问剪贴板。",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        addToHistory(text);
        toast({
          title: "粘贴成功",
          description: "内容已粘贴。",
        });
      } else {
        throw new Error("剪贴板为空");
      }
    } catch (err) {
      console.error("无法粘贴文本: ", err);
      let errorMessage = "粘贴时发生未知错误";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast({
        title: "粘贴失败",
        description: `无法粘贴内容。错误: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const addToHistory = (text: string) => {
    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      content: text,
      timestamp: new Date(),
      tags: [],
    };
    setHistory((prevHistory) => [newItem, ...prevHistory.slice(0, 9)]);
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "历史记录已清除",
      description: "剪贴板历史已清空。",
    });
  };

  const restoreFromHistory = (item: ClipboardItem) => {
    setContent(item.content);
    setActiveTab("current");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ content, history });
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "clipboard_export.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    linkElement.remove();

    toast({
      title: "导出成功",
      description: "剪贴板数据已导出。",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setContent(importedData.content || "");
          setHistory(importedData.history || []);
          toast({
            title: "导入成功",
            description: "剪贴板数据已导入。",
          });
        } catch (error) {
          console.error("导入文件时出错:", error);
          toast({
            title: "导入失败",
            description: "无法导入文件。",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const addTag = () => {
    if (currentTag && history[0] && !history[0].tags.includes(currentTag)) {
      setHistory((prevHistory) => [
        { ...prevHistory[0], tags: [...prevHistory[0].tags, currentTag] },
        ...prevHistory.slice(1),
      ]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    if (history[0]) {
      setHistory((prevHistory) => [
        {
          ...prevHistory[0],
          tags: prevHistory[0].tags.filter((t) => t !== tag),
        },
        ...prevHistory.slice(1),
      ]);
    }
  };

  useHotkeys("ctrl+c", handleCopy, [content]);
  useHotkeys("ctrl+v", handlePaste, []);

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;

    const { selectionStart, selectionEnd } = textareaRef.current;
    const selectedText = content.slice(selectionStart, selectionEnd);

    let formattedText = selectedText;
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        break;
      case "link":
        formattedText = `[${selectedText}](https://)`;
        break;
      case "list":
        formattedText = selectedText
          .split("\n")
          .map(line => `- ${line}`)
          .join("\n");
        break;
      case "ordered-list":
        formattedText = selectedText
          .split("\n")
          .map((line, index) => `${index + 1}. ${line}`)
          .join("\n");
        break;
    }

    const newContent =
      content.slice(0, selectionStart) +
      formattedText +
      content.slice(selectionEnd);

    setContent(newContent);
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      selectionStart,
      selectionStart + formattedText.length
    );
  };

  const filteredHistory = history.filter(item =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          ref={cardRef}
          className={`fixed shadow-lg ${
            isMinimized ? "w-12" : sizeClasses[size]
          } z-50 transition-all duration-300 ease-in-out ${
            isDarkMode ? "dark" : ""
          } ${themeClasses[theme]}`}
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            transition: isDragging ? "none" : "all 0.3s ease-in-out",
            maxHeight: isFullScreen ? "calc(100vh - 40px)" : "none",
            height: isFullScreen ? "calc(100vh - 40px)" : "auto",
          }}
        >
          <motion.div
            className="bg-primary text-primary-foreground p-2 cursor-move flex justify-between items-center"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clipboard className="w-4 h-4" />
            {!isMinimized && (
              <div className="flex items-center gap-2">
                <span>剪贴板</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {isFullScreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground mr-1"
                onClick={() =>
                  setTheme(prev =>
                    prev === "default" ? "minimal" :
                    prev === "minimal" ? "glass" :
                    "default"
                  )
                }
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground mr-1"
                onClick={() => setIsDarkMode(mode => !mode)}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <ExternalLink className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          </motion.div>
          {!isMinimized && (
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">当前</TabsTrigger>
                  <TabsTrigger value="history">历史</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                  <div className="mb-2 flex items-center">
                    <Switch
                      checked={isMarkdownMode}
                      onCheckedChange={setIsMarkdownMode}
                      id="markdown-mode"
                    />
                    <Label htmlFor="markdown-mode" className="ml-2">
                      Markdown模式
                    </Label>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("bold")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("italic")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("underline")}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("link")}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("ordered-list")}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="当前内容"
                    className="mb-2"
                    rows={isFullScreen ? 12 : 4}
                  />
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Input
                      ref={inputRef}
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="添加标签"
                      className="flex-1"
                    />
                    <Button onClick={addTag} disabled={!currentTag}>
                      添加
                    </Button>
                  </div>
                  {history[0] && history[0].tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {history[0].tags.map(tag => (
                        <Badge key={tag} onClick={() => removeTag(tag)} className="cursor-pointer">
                          {tag} <X className="inline-block ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSize("small")}
                      className={size === "small" ? "bg-accent" : ""}
                    >
                      小
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSize("medium")}
                      className={size === "medium" ? "bg-accent" : ""}
                    >
                      中
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSize("large")}
                      className={size === "large" ? "bg-accent" : ""}
                    >
                      大
                    </Button>
                    <Button onClick={handleCopy} className="flex-1">
                      <Copy className="mr-2 h-4 w-4" /> 复制
                    </Button>
                    <Button
                      onClick={handlePaste}
                      variant="outline"
                      className="flex-1"
                      disabled={!hasPastePermission}
                    >
                      <PasteIcon className="mr-2 h-4 w-4" /> 粘贴
                    </Button>
                    <Button
                      onClick={handleExport}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" /> 导出
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                        <Label className="flex items-center justify-center cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        导入
                        <Input 
                        type="file" 
                        accept="application/json"
                        onChange={handleImport}
                        className="hidden"
                        />
                        </Label>
                    </Button>
                    <Button
                      onClick={clearHistory}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> 清除历史
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索历史内容"
                    className="mb-4"
                  />
                  <div className="max-h-64 overflow-y-auto">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map(item => (
                        <Card key={item.id} className="mb-2">
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <p className="text-sm">{item.content}</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => restoreFromHistory(item)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.content);
                                    toast({
                                      title: "复制成功",
                                      description: "内容已复制到剪贴板。",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map(tag => (
                                  <Badge key={tag} className="cursor-pointer" onClick={() => removeTag(tag)}>
                                    {tag} <X className="inline-block ml-1 h-3 w-3" />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p>No history found.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}