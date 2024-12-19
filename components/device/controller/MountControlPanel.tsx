// components/MountControlPanel.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMountControl } from "@/hooks/use-mount-control";
import { Settings } from "./Settings";
import styles from "./MountControlPanel.module.css";
import { useMountStore } from "@/lib/store/device/telescope";

interface MountControlPanelProps {
  isLandscape: boolean;
}

export const MountControlPanel: React.FC<MountControlPanelProps> = ({
  isLandscape,
}) => {
  const [size, setSize] = useState({ width: 150, height: 240 });
  const [showSettings, setShowSettings] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const speedContentRef = useRef<HTMLButtonElement>(null);

  const {
    parkSwitch,
    trackSwitch,
    speedNum,
    handleMouseDownRA,
    handleMouseDownDEC,
    stop,
    mountPark,
    mountTrack,
    mountHome,
    mountSync,
    solveSync,
    mountSlewRateSwitch,
  } = useMountControl();

  const { isIdle, isConnected, nightMode } = useMountStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "mount-control-panel",
  });

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  useEffect(() => {
    // 根据横屏状态调整面板大小和位置
    if (isLandscape) {
      setSize({ width: 180, height: 320 });
      // 调整面板位置到右侧
      if (transform) {
        transform.x = window.innerWidth - size.width - 20;
        transform.y = 80;
      }
    } else {
      setSize({ width: 150, height: 240 });
    }
  }, [isLandscape]);

  return (
    <motion.div
      ref={setNodeRef}
      className={`${styles.mountControlPanel} ${
        nightMode ? styles.nightMode : ""
      } ${isLandscape ? styles.landscape : ""}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: CSS.Translate.toString(transform),
        transformOrigin: "top left",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: zoomLevel }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      {...attributes}
      {...listeners}
    >
      <div className={styles.dragHandle}>
        <span>拖动这里</span>
      </div>
      <div className={styles.directionBtn}>
        <motion.button
          className={styles.raPlus}
          onTouchStart={() => handleMouseDownRA("plus")}
          onTouchEnd={stop}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/images/RA+.svg" height="40" alt="RA+" />
        </motion.button>
        <motion.button
          className={styles.raMinus}
          onTouchStart={() => handleMouseDownRA("minus")}
          onTouchEnd={stop}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/images/RA-.svg" height="40" alt="RA-" />
        </motion.button>
        <motion.button
          className={styles.decPlus}
          onTouchStart={() => handleMouseDownDEC("plus")}
          onTouchEnd={stop}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/images/DEC+.svg" height="40" alt="DEC+" />
        </motion.button>
        <motion.button
          className={styles.decMinus}
          onTouchStart={() => handleMouseDownDEC("minus")}
          onTouchEnd={stop}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/images/DEC-.svg" height="40" alt="DEC-" />
        </motion.button>
      </div>

      <motion.button
        className={styles.btnStop}
        onClick={stop}
        whileTap={{ scale: 0.95 }}
      >
        <span>停止</span>
      </motion.button>

      <motion.button
        className={styles.btnSpeed}
        onClick={mountSlewRateSwitch}
        ref={speedContentRef}
        whileTap={{ scale: 0.95 }}
      >
        {speedNum}
      </motion.button>

      <motion.button
        className={parkSwitch ? styles.btnParkOn : styles.btnPark}
        onClick={mountPark}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/Park.svg" height="25" alt="Park" />
      </motion.button>
      <motion.button
        className={trackSwitch ? styles.btnTrackOn : styles.btnTrack}
        onClick={mountTrack}
        whileTap={{ scale: 0.95 }}
      >
        <span>跟踪</span>
      </motion.button>
      <motion.button
        className={styles.btnHome}
        onClick={mountHome}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/Home.svg" height="20" alt="Home" />
      </motion.button>
      <motion.button
        className={styles.btnSync}
        onClick={mountSync}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/Sync.svg" height="20" alt="Sync" />
      </motion.button>
      <motion.button
        className={styles.btnSolve}
        onClick={solveSync}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/Solve.svg" height="20" alt="Solve" />
      </motion.button>

      <div className={styles.iconContainer}>
        <motion.img
          src={isIdle ? "/images/Status-idle.svg" : "/images/Status-busy.svg"}
          height="15"
          alt={isIdle ? "空闲" : "忙碌"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.button
        className={styles.btnSettings}
        onClick={toggleSettings}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/settings.svg" height="15" alt="设置" />
      </motion.button>

      <motion.button
        className={styles.btnClose}
        onClick={() => {
          /* 关闭面板逻辑 */
        }}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/OFF.svg" height="12" alt="关闭" />
      </motion.button>

      <div
        className={`${styles.connectionStatus} ${
          useMountStore.getState().isConnected
            ? styles.connected
            : styles.disconnected
        }`}
      >
        {useMountStore.getState().isConnected ? "已连接" : "已断开"}
      </div>

      <div className={styles.zoomControls}>
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <Settings nightMode={nightMode} onClose={toggleSettings} />
        )}
      </AnimatePresence>

      {isLandscape && (
        <div className={styles.landscapeControls}>
          {/* 添加横屏专用控制按钮 */}
        </div>
      )}
    </motion.div>
  );
};
