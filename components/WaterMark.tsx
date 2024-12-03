import React, { useEffect, useRef, useState, useCallback } from "react";
import { createWatermark } from "@/hooks/create-watermark";
import { WatermarkProps } from "@/types/watermark";

export const Watermark: React.FC<WatermarkProps> = ({
  content,
  cross = false,
  debug = false,
  fontSize = 14,
  fontFamily,
  fontStyle = "normal",
  fontVariant = "",
  fontWeight = 400,
  fontColor = "rgba(128, 128, 128, .3)",
  fullscreen = false,
  globalRotate = 0,
  lineHeight = 14,
  height = 32,
  image,
  imageHeight,
  imageOpacity = 1,
  imageWidth,
  rotate = 0,
  selectable = true,
  textAlign = "left",
  width = 32,
  xGap = 0,
  xOffset = 0,
  yGap = 0,
  yOffset = 0,
  zIndex = 10,
  children,
  customStyle = {},
  onClick,
  density = "medium",
  responsive = false,
  opacity = 0.3,
  position = "center",
  animation = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const getDensityMultiplier = useCallback(() => {
    switch (density) {
      case "low":
        return 1.5;
      case "high":
        return 0.5;
      default:
        return 1;
    }
  }, [density]);

  const updateWatermark = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = fullscreen
        ? document.documentElement
        : containerRef.current;
      setContainerSize({ width: clientWidth, height: clientHeight });

      const densityMultiplier = getDensityMultiplier();
      const adjustedWidth = responsive
        ? Math.max(width, clientWidth / 10)
        : width;
      const adjustedHeight = responsive
        ? Math.max(height, clientHeight / 10)
        : height;

      const url = createWatermark({
        content: typeof content === "function" ? content() : content,
        width: adjustedWidth,
        height: adjustedHeight,
        rotate,
        globalRotate,
        fontSize: responsive ? Math.max(fontSize, clientWidth / 100) : fontSize,
        fontFamily,
        fontStyle,
        fontVariant,
        fontWeight,
        fontColor,
        lineHeight,
        image,
        imageWidth,
        imageHeight,
        imageOpacity,
        textAlign,
        canvasWidth: clientWidth,
        canvasHeight: clientHeight,
        xGap: xGap * densityMultiplier,
        yGap: yGap * densityMultiplier,
        xOffset,
        yOffset,
        debug,
      });
      setWatermarkUrl(url);
    }
  }, [
    content,
    width,
    height,
    rotate,
    globalRotate,
    fontSize,
    fontFamily,
    fontStyle,
    fontVariant,
    fontWeight,
    fontColor,
    lineHeight,
    image,
    imageWidth,
    imageHeight,
    imageOpacity,
    textAlign,
    xGap,
    yGap,
    xOffset,
    yOffset,
    fullscreen,
    debug,
    density,
    responsive,
  ]);

  useEffect(() => {
    updateWatermark();
    window.addEventListener("resize", updateWatermark);
    return () => window.removeEventListener("resize", updateWatermark);
  }, [updateWatermark]);

  useEffect(() => {
    const interval = setInterval(updateWatermark, 1000);
    return () => clearInterval(interval);
  }, [updateWatermark]);

  const watermarkStyle: React.CSSProperties = {
    position: fullscreen ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: watermarkUrl ? `url(${watermarkUrl})` : "none",
    backgroundRepeat: cross ? "repeat" : "no-repeat",
    backgroundPosition: position,
    pointerEvents: "none",
    zIndex,
    opacity,
    animation: animation ? "watermark-animation 5s infinite" : "none",
    ...customStyle,
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    userSelect: selectable ? "auto" : "none",
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {children}
      <div
        style={watermarkStyle}
        onClick={
          onClick
            ? (e) => {
                e.stopPropagation();
                onClick(e);
              }
            : undefined
        }
      />
    </div>
  );
};

// Add keyframes for watermark animation
const styleSheet = document.styleSheets[0];
const keyframes = `@keyframes watermark-animation {
    0% { transform: translate(0, 0); }
    50% { transform: translate(10px, 10px); }
    100% { transform: translate(0, 0); }
  }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
