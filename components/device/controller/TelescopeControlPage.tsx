"use client";

import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { MountControlPanel } from "./MountControlPanel";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RotateCcw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Camera,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export const TelescopeControlPage: React.FC = () => {
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <DndContext>
      <div className="min-h-screen bg-background dark:bg-slate-900 text-foreground dark:text-white">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <h1 className="text-lg font-semibold">望远镜控制系统</h1>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {fullscreen ? "退出" : "全屏"}
              </Button>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>{/* 设置面板内容 */}</DrawerContent>
              </Drawer>
            </div>
          </div>
        </header>

        <main className="container py-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <Card className="col-span-1 md:col-span-2">
              <Tabs defaultValue="live" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="live">实时图像</TabsTrigger>
                  <TabsTrigger value="status">状态信息</TabsTrigger>
                  <TabsTrigger value="guide">导星</TabsTrigger>
                </TabsList>

                <TabsContent value="live">
                  <CardContent className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Camera className="mx-auto h-12 w-12 text-muted" />
                        <p className="text-muted-foreground">等待图像输入...</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button size="sm" variant="secondary">
                        <ZoomIn className="h-4 w-4 mr-1" />
                        放大
                      </Button>
                      <Button size="sm" variant="secondary">
                        <ZoomOut className="h-4 w-4 mr-1" />
                        缩小
                      </Button>
                      <Button size="sm" variant="secondary">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="status" className="tabContent">
                  <div className="statusGrid">{/* 添加状态信息网格 */}</div>
                </TabsContent>

                <TabsContent value="guide" className="tabContent">
                  <div className="guideContainer">{/* 添加导星控制界面 */}</div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </main>

        {!isLandscape && (
          <Alert className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto">
            <AlertDescription>建议横屏使用以获得最佳体验</AlertDescription>
          </Alert>
        )}

        <MountControlPanel isLandscape={isLandscape} />
      </div>
    </DndContext>
  );
};
