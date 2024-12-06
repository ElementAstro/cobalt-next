import React, { useState } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BellIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface PageHeaderProps {
  extra?: string;
  subtitle?: string;
  title?: string;
  onBack?: () => void;
  children?: React.ReactNode;
  avatar?: React.ReactNode;
  header?: React.ReactNode;
  extraSlot?: React.ReactNode;
  footer?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  titleSlot?: React.ReactNode;
  backSlot?: React.ReactNode;
  collapsible?: boolean;
  theme?: "light" | "dark" | "system";
  animationPreset?: "fade" | "slide" | "scale";
}

const PageHeader: React.FC<PageHeaderProps> = ({
  extra,
  subtitle,
  title,
  onBack,
  children,
  avatar,
  header,
  extraSlot,
  footer,
  subtitleSlot,
  titleSlot,
  backSlot,
  collapsible = false,
  theme = "system",
  animationPreset = "fade",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const themeClasses =
    currentTheme === "dark"
      ? "bg-gray-800 text-white dark"
      : "bg-white text-gray-900 light";

  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
  };

  return (
    <Card className={`w-full ${themeClasses} shadow-md`}>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {backSlot ||
            (onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                aria-label="返回"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            ))}
          {avatar && <div className="flex-shrink-0">{avatar}</div>}
          <div>
            {titleSlot ||
              (title && <h1 className="text-2xl font-bold">{title}</h1>)}
            {subtitleSlot ||
              (subtitle && <p className="text-muted-foreground">{subtitle}</p>)}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <BellIcon className="h-5 w-5" />
              <span>通知</span>
              {isDropdownOpen ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
                >
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      通知 1
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      通知 2
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      通知 3
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {extraSlot ||
            (extra && <div className="text-muted-foreground">{extra}</div>)}
          <Switch
            checked={currentTheme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="切换主题"
          />
          {collapsible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              aria-expanded={!isCollapsed}
              aria-controls="page-header-content"
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronUpIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <AnimatePresence>
        {(!collapsible || !isCollapsed) && (
          <motion.div
            id="page-header-content"
            initial={animationVariants[animationPreset].initial}
            animate={animationVariants[animationPreset].animate}
            exit={animationVariants[animationPreset].exit}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              {header && <div className="mb-4">{header}</div>}
              {children}
            </CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PageHeader;
