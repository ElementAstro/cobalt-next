import React from "react";

export interface WatermarkProps {
  content?: string | (() => string);
  cross?: boolean;
  debug?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: "normal" | "italic" | `oblique ${number}deg`;
  fontVariant?: string;
  fontWeight?: number;
  fontColor?: string;
  fullscreen?: boolean;
  globalRotate?: number;
  lineHeight?: number;
  height?: number;
  image?: string;
  imageHeight?: number;
  imageOpacity?: number;
  imageWidth?: number;
  rotate?: number;
  selectable?: boolean;
  textAlign?: "left" | "center" | "right";
  width?: number;
  xGap?: number;
  xOffset?: number;
  yGap?: number;
  yOffset?: number;
  zIndex?: number;
  children?: React.ReactNode;
  customStyle?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  density?: "low" | "medium" | "high";
  responsive?: boolean;
  opacity?: number;
  position?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  animation?: boolean;
}

export interface WatermarkOptions
  extends Omit<
    WatermarkProps,
    | "children"
    | "cross"
    | "fullscreen"
    | "selectable"
    | "zIndex"
    | "customStyle"
    | "onClick"
    | "density"
    | "responsive"
  > {
  canvasWidth: number;
  canvasHeight: number;
}
