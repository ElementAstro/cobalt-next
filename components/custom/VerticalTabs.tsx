import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Tab {
  value: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
  disabled?: boolean;
}

interface VerticalTabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onChange?: (value: string) => void;
  orientation?: "left" | "right";
  tabWidth?: string;
  contentWidth?: string;
  tabStyle?: "default" | "outline" | "ghost";
  activeTabStyle?: React.CSSProperties;
  hoverTabStyle?: React.CSSProperties;
  animationDuration?: number;
  showBadge?: boolean;
  badgeContent?: (tab: Tab) => React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function VerticalTabs({
  tabs = [],
  defaultActiveTab,
  onChange,
  orientation = "left",
  tabWidth = "1/4",
  contentWidth = "3/4",
  tabStyle = "default",
  activeTabStyle = {},
  hoverTabStyle = {},
  animationDuration = 0.2,
  showBadge = false,
  badgeContent,
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(() => {
    if (
      defaultActiveTab &&
      tabs.some((tab) => tab.value === defaultActiveTab)
    ) {
      return defaultActiveTab;
    }
    return tabs[0]?.value || "";
  });

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  const getTabStyle = useCallback(
    (isActive: boolean, isDisabled: boolean) => {
      let style: React.CSSProperties = {
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
        padding: "0.75rem 1rem",
        transition: "all 0.2s",
        ...hoverTabStyle,
      };

      if (isActive) {
        style = { ...style, ...activeTabStyle };
      }

      if (isDisabled) {
        style.opacity = 0.5;
        style.cursor = "not-allowed";
      }

      return style;
    },
    [activeTabStyle, hoverTabStyle]
  );

  const tabButtons = useMemo(
    () =>
      tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={tabStyle}
          style={getTabStyle(activeTab === tab.value, !!tab.disabled)}
          onClick={() => !tab.disabled && handleTabChange(tab.value)}
          disabled={tab.disabled}
          aria-selected={activeTab === tab.value}
          role="tab"
          id={`tab-${tab.value}`}
        >
          {tab.icon && <tab.icon className="mr-2 h-5 w-5" />}
          <span>{tab.label}</span>
          {showBadge && badgeContent && (
            <span className="ml-auto">{badgeContent(tab)}</span>
          )}
        </Button>
      )),
    [
      tabs,
      activeTab,
      tabStyle,
      getTabStyle,
      handleTabChange,
      showBadge,
      badgeContent,
    ]
  );

  if (tabs.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400">No tabs available</div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
        orientation === "right" ? "sm:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        variants={itemVariants}
        className={`w-full sm:w-${tabWidth} bg-gray-100 dark:bg-gray-700`}
        role="tablist"
      >
        {tabButtons}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={itemVariants}
          className={`w-full sm:w-${contentWidth} p-6`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          initial={{ opacity: 0, x: orientation === "right" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: orientation === "right" ? 20 : -20 }}
          transition={{ duration: animationDuration }}
        >
          {tabs.find((tab) => tab.value === activeTab)?.content || (
            <div>No content available</div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
