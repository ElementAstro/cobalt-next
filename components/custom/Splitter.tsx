import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface SplitterProps {
  value?: number;
  horizontal?: boolean;
  limits?: [number, number];
  unit?: "px" | "%";
  reverse?: boolean;
  separatorClass?: string;
  separatorStyle?: React.CSSProperties;
  beforeClass?: string;
  afterClass?: string;
  beforeStyle?: React.CSSProperties;
  afterStyle?: React.CSSProperties;
  children: [React.ReactNode, React.ReactNode];
  separatorContent?: React.ReactNode;
  animationDuration?: number;
  disabled?: boolean;
  snap?: number[];
  hideWhenCollapsed?: boolean;
  collapseThreshold?: number;
  onDrag?: (size: number) => void;
  onDragEnd?: (size: number) => void;
}

const Splitter: React.FC<SplitterProps> = ({
  value = 50,
  horizontal = false,
  limits = [0, 100],
  unit = "%",
  reverse = false,
  separatorClass = "",
  separatorStyle = {},
  beforeClass = "",
  afterClass = "",
  beforeStyle = {},
  afterStyle = {},
  children,
  separatorContent,
  animationDuration = 0.3,
  disabled = false,
  snap = [],
  hideWhenCollapsed = false,
  collapseThreshold = 10,
  onDrag,
  onDragEnd,
}) => {
  const [size, setSize] = useState(value);
  const splitterRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !splitterRef.current || disabled) return;

      const rect = splitterRef.current.getBoundingClientRect();
      const pos = horizontal ? e.clientY - rect.top : e.clientX - rect.left;
      const totalSize = horizontal ? rect.height : rect.width;

      let newSize = (pos / totalSize) * 100;
      newSize = Math.max(limits[0], Math.min(limits[1], newSize));

      // Apply snapping
      const snapThreshold = 5; // 5% snap threshold
      for (const snapPoint of snap) {
        if (Math.abs(newSize - snapPoint) < snapThreshold) {
          newSize = snapPoint;
          break;
        }
      }

      if (reverse) {
        newSize = 100 - newSize;
      }

      const finalSize = unit === "px" ? (newSize * totalSize) / 100 : newSize;
      setSize(finalSize);
      onDrag && onDrag(finalSize);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        onDragEnd && onDragEnd(size);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    horizontal,
    limits,
    reverse,
    unit,
    snap,
    disabled,
    onDrag,
    onDragEnd,
    size,
  ]);

  const handleMouseDown = () => {
    if (!disabled) {
      isDragging.current = true;
    }
  };

  const beforeSize = reverse ? `calc(100% - ${size}${unit})` : `${size}${unit}`;
  const afterSize = reverse ? `${size}${unit}` : `calc(100% - ${size}${unit})`;

  const isBeforeCollapsed = size <= collapseThreshold;
  const isAfterCollapsed = 100 - size <= collapseThreshold;

  return (
    <ResizablePanelGroup
      className={`flex ${horizontal ? "flex-col" : "flex-row"}`}
      style={{ width: "100%", height: "100%" }}
      direction={horizontal ? "vertical" : "horizontal"}
    >
      <AnimatePresence>
        {(!hideWhenCollapsed || !isBeforeCollapsed) && (
          <ResizablePanel
            className={`${beforeClass}`}
            style={{
              ...beforeStyle,
              [horizontal ? "height" : "width"]: beforeSize,
              overflow: "auto",
            }}
          >
            {children[0]}
          </ResizablePanel>
        )}
      </AnimatePresence>
      <ResizableHandle
        className={`cursor-${
          horizontal ? "row" : "col"
        }-resize ${separatorClass} ${disabled ? "cursor-not-allowed" : ""}`}
        style={{
          ...separatorStyle,
          [horizontal ? "height" : "width"]: "4px",
          backgroundColor: "lightgray",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        {separatorContent}
      </ResizableHandle>
      <AnimatePresence>
        {(!hideWhenCollapsed || !isAfterCollapsed) && (
          <ResizablePanel
            className={`${afterClass}`}
            style={{
              ...afterStyle,
              [horizontal ? "height" : "width"]: afterSize,
              overflow: "auto",
            }}
          >
            {children[1]}
          </ResizablePanel>
        )}
      </AnimatePresence>
    </ResizablePanelGroup>
  );
};

export default Splitter;
