"use client";

import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { MountControlPanel } from "./MountControlPanel";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw } from "lucide-react";
import styles from "./TelescopeControlPage.module.css";

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
      <div
        className={`${styles.pageContainer} ${
          isLandscape ? styles.landscape : ""
        }`}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>望远镜控制系统</h1>
          <div className={styles.headerControls}>
            <Button variant="outline" onClick={toggleFullscreen}>
              {fullscreen ? "退出全屏" : "全屏"}
            </Button>
          </div>
        </div>

        <div className={styles.mainContent}>
          <Tabs defaultValue="live" className={styles.contentTabs}>
            <TabsList>
              <TabsTrigger value="live">实时图像</TabsTrigger>
              <TabsTrigger value="status">状态信息</TabsTrigger>
              <TabsTrigger value="guide">导星</TabsTrigger>
            </TabsList>

            <TabsContent value="live" className={styles.tabContent}>
              <div className={styles.imageContainer}>
                <div className={styles.telescopeView}>
                  <p>实时望远镜图像</p>
                  <Button variant="outline" className={styles.refreshButton}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    刷新
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="status" className={styles.tabContent}>
              <div className={styles.statusGrid}>{/* 添加状态信息网格 */}</div>
            </TabsContent>

            <TabsContent value="guide" className={styles.tabContent}>
              <div className={styles.guideContainer}>
                {/* 添加导星控制界面 */}
              </div>
            </TabsContent>
          </Tabs>

          {!isLandscape && (
            <Alert className={styles.rotateAlert}>
              <AlertDescription>建议横屏使用以获得最佳体验</AlertDescription>
            </Alert>
          )}
        </div>

        {showControlPanel && <MountControlPanel isLandscape={isLandscape} />}
      </div>
    </DndContext>
  );
};
