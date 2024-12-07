"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
  tags: string[];
}

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
  const [hasPastePermission, setHasPastePermission] = useState<boolean | null>(
    null
  );

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("clipboardHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
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
  }, [isDragging, dragOffset]);

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
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
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

  useHotkeys("ctrl+c", handleCopy, [content]);
  useHotkeys("ctrl+v", handlePaste, []);

  return (
    <Card
      ref={cardRef}
      className={`fixed shadow-lg ${
        isMinimized ? "w-12" : "w-96"
      } z-50 transition-all duration-300 ease-in-out ${
        isDarkMode ? "dark" : ""
      }`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transition: isDragging ? "none" : "all 0.3s ease-in-out",
      }}
    >
      <div
        className="bg-primary text-primary-foreground p-2 cursor-move flex justify-between items-center"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Clipboard className="w-4 h-4" />
        {!isMinimized && <span>剪贴板</span>}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground mr-1"
            onClick={() => {
              /* 切换语言功能移除 */
            }}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground mr-1"
            onClick={() => setIsDarkMode((mode) => !mode)}
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
            {isMinimized ? <ExternalLink /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>
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
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="当前内容"
                className="mb-2"
                rows={4}
              />
              <div className="flex flex-wrap gap-2">
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
                  onClick={() =>
                    document.getElementById("import-file")?.click()
                  }
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" /> 导入
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={handleImport}
                />
              </div>
              {hasPastePermission === false && (
                <p className="text-sm text-destructive mt-2">
                  无法访问剪贴板。
                </p>
              )}
            </TabsContent>
            <TabsContent value="history">
              <div className="max-h-40 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mb-2 p-2 bg-secondary rounded"
                  >
                    <span className="truncate flex-1">{item.content}</span>
                    <div className="flex items-center">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary text-primary-foreground rounded px-1 mr-1"
                        >
                          {tag}
                        </span>
                      ))}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => restoreFromHistory(item)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center mt-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="添加标签"
                  className="mr-2"
                />
                <Button onClick={addTag} variant="outline">
                  <Tag className="mr-2 h-4 w-4" /> 添加标签
                </Button>
              </div>
              <Button
                onClick={clearHistory}
                variant="destructive"
                className="w-full mt-2"
              >
                <Trash2 className="mr-2 h-4 w-4" /> 清除历史
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
