"use client";

import React, { useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Star,
} from "lucide-react";
import { usePullMenuStore } from "@/lib/store/pull-menu";

export type MenuItem = {
  icon: React.ReactNode;
  label: string;
  action?: () => void;
};

type PullMenuProps = {
  menuItems: MenuItem[];
  direction?: "top" | "bottom" | "left" | "right";
  size?: "small" | "medium" | "large" | "fullscreen";
  pullThreshold?: number;
  onMenuItemClick?: (item: MenuItem) => void;
  customStyles?: {
    menuBackground?: string;
    menuText?: string;
    menuAccent?: string;
    indicatorBackground?: string;
    indicatorText?: string;
  };
  animationConfig?: {
    type?: "spring" | "tween";
    stiffness?: number;
    damping?: number;
    duration?: number;
  };
  showSearch?: boolean;
  showPinned?: boolean;
  indicatorSize?: "small" | "medium" | "large";
};

const directionConfig = {
  top: { open: "top-0", closed: "-top-full", pull: "down", icon: ChevronDown },
  bottom: {
    open: "bottom-0",
    closed: "-bottom-full",
    pull: "up",
    icon: ChevronUp,
  },
  left: {
    open: "left-0",
    closed: "-left-full",
    pull: "right",
    icon: ChevronRight,
  },
  right: {
    open: "right-0",
    closed: "-right-full",
    pull: "left",
    icon: ChevronLeft,
  },
};

const sizeConfig = {
  small: "w-64 h-64",
  medium: "w-96 h-96",
  large: "w-[32rem] h-[32rem]",
  fullscreen: "w-screen h-screen",
};

const indicatorSizeConfig = {
  small: "w-8 h-8",
  medium: "w-12 h-12",
  large: "w-16 h-16",
};

export const PullMenu: React.FC<PullMenuProps> = ({
  menuItems,
  direction = "top",
  size = "medium",
  pullThreshold = 100,
  onMenuItemClick,
  customStyles = {},
  animationConfig = {},
  showSearch = true,
  showPinned = true,
  indicatorSize = "medium",
}) => {
  const { isOpen, setIsOpen, pinnedItems, togglePinnedItem } =
    usePullMenuStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const startPosition = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const config = directionConfig[direction];
  const sizeClass = sizeConfig[size];
  const indicatorSizeClass = indicatorSizeConfig[indicatorSize];
  const isHorizontal = direction === "left" || direction === "right";

  const pullDistance = useMotionValue(0);
  const pullProgress = useTransform(pullDistance, [0, pullThreshold], [0, 1]);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      startPosition.current = isHorizontal ? clientX : clientY;
    },
    [isHorizontal]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const currentPosition = isHorizontal ? clientX : clientY;
      const distance =
        direction === "bottom" || direction === "right"
          ? startPosition.current - currentPosition
          : currentPosition - startPosition.current;

      if (distance > 0 && distance <= pullThreshold) {
        pullDistance.set(distance);
      } else if (distance > pullThreshold) {
        setIsOpen(true);
        pullDistance.set(0);
      }
    },
    [direction, isHorizontal, pullDistance, pullThreshold, setIsOpen]
  );

  const handleEnd = useCallback(() => {
    if (pullDistance.get() > 0 && pullDistance.get() < pullThreshold) {
      pullDistance.set(0);
    }
  }, [pullDistance, pullThreshold]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) =>
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) =>
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchEnd = () => handleEnd();

    const handleMouseDown = (e: MouseEvent) =>
      handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        handleMove(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => handleEnd();

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleStart, handleMove, handleEnd]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
  }, [setIsOpen]);

  const handleMenuItemClick = useCallback(
    (item: MenuItem) => {
      if (item.action) {
        item.action();
      }
      if (onMenuItemClick) {
        onMenuItemClick(item);
      }
      closeMenu();
    },
    [closeMenu, onMenuItemClick]
  );

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PullIndicator = config.icon;

  const menuStyles = {
    backgroundColor: customStyles.menuBackground,
    color: customStyles.menuText,
  };

  const indicatorStyles = {
    backgroundColor: customStyles.indicatorBackground,
    color: customStyles.indicatorText,
  };

  return (
    <>
      <motion.div
        className={`fixed ${config.open} ${
          isHorizontal ? "h-16" : "w-16"
        } flex items-center justify-center cursor-pointer ${indicatorSizeClass}`}
        style={{
          [isHorizontal ? "x" : "y"]: pullDistance,
          zIndex: 40,
          ...(isHorizontal ? { top: 0, bottom: 0 } : { left: 0, right: 0 }),
          ...indicatorStyles,
        }}
        onClick={() => setIsOpen(true)}
      >
        <PullIndicator className={`w-6 h-6`} />
        <motion.span
          className={`ml-2 ${isHorizontal ? "rotate-90" : ""}`}
          style={{ opacity: pullProgress }}
        >
          Pull or click to open menu
        </motion.span>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              ref={menuRef}
              initial={{
                [isHorizontal ? "x" : "y"]:
                  config.closed === "-top-full" ||
                  config.closed === "-left-full"
                    ? "-100%"
                    : "100%",
              }}
              animate={{ [isHorizontal ? "x" : "y"]: 0 }}
              exit={{
                [isHorizontal ? "x" : "y"]:
                  config.closed === "-top-full" ||
                  config.closed === "-left-full"
                    ? "-100%"
                    : "100%",
              }}
              transition={
                animationConfig.type === "spring"
                  ? {
                      type: "spring",
                      stiffness: animationConfig.stiffness || 300,
                      damping: animationConfig.damping || 30,
                    }
                  : { type: "tween", duration: animationConfig.duration || 0.3 }
              }
              className={`fixed ${config.open} ${sizeClass} shadow-lg z-50 overflow-auto`}
              style={menuStyles}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-bold`}>Quick Menu</h2>
                  <button onClick={closeMenu} className="text-current">
                    <X />
                  </button>
                </div>
                {showSearch && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full p-2 rounded-lg border border-gray-300`}
                      style={{
                        backgroundColor: menuStyles.backgroundColor,
                        color: menuStyles.color,
                      }}
                    />
                  </div>
                )}
                {showPinned && pinnedItems.length > 0 && (
                  <div className="mb-4">
                    <h3 className={`text-lg font-semibold mb-2`}>
                      Pinned Items
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {menuItems
                        .filter((item) => pinnedItems.includes(item.label))
                        .map((item) => (
                          <MenuItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => handleMenuItemClick(item)}
                            onPin={() => togglePinnedItem(item.label)}
                            isPinned
                            accentColor={
                              customStyles.menuAccent || "defaultColor"
                            }
                          />
                        ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => handleMenuItemClick(item)}
                      onPin={() => togglePinnedItem(item.label)}
                      isPinned={pinnedItems.includes(item.label)}
                      accentColor={customStyles.menuAccent || "defaultColor"}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  onPin: () => void;
  isPinned: boolean;
  accentColor: string;
}> = ({ icon, label, onClick, onPin, isPinned, accentColor }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 ${accentColor} bg-opacity-10 rounded-lg cursor-pointer`}
    >
      <div className="flex items-center" onClick={onClick}>
        {icon}
        <span className={`ml-2`}>{label}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin();
        }}
        className="text-current"
      >
        <Star fill={isPinned ? "currentColor" : "none"} />
      </button>
    </div>
  );
};
