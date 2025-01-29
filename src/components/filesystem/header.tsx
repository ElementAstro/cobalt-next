"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  List,
  Grid,
  ArrowUpDown,
  Upload,
  Share2,
  Clock,
  Tag,
  RefreshCw,
  Archive,
  Cloud,
  Lock,
  Trash2,
  Settings,
  Filter,
  MoreVertical,
  Menu,
  Home,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { cn } from "@/lib/utils";
import { FileOperation } from "@/types/filesystem";

interface HeaderProps {
  currentPath: string[];
  setCurrentPath: (path: string[] | string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "name" | "size" | "lastModified";
  sortOrder: "asc" | "desc";
  setSortBy: (sort: "name" | "size" | "type" | "date") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  toggleSortOrder: () => void;
  openModals: {
    settings: () => void;
    upload: () => void;
    search: () => void;
    share: () => void;
    versionHistory: () => void;
    tagManager: () => void;
    realtimeCollaboration: () => void;
    fileCompression: () => void;
    cloudIntegration: () => void;
    advancedSearch: () => void;
    authModal: () => void;
    trashBin: () => void;
    fileEncryption: () => void;
  };
  selectedFiles: string[];
  handleDelete: () => void;
  onBatchOperation: (operation: FileOperation) => void;
  isBatchProcessing: boolean;
  lastActions: string[];
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  setCurrentPath,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  openModals,
  selectedFiles,
  handleDelete,
  onBatchOperation,
  isBatchProcessing,
  lastActions,
}) => {
  const { isMultiSelectMode, toggleMultiSelectMode } = useFilesystemStore();

  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);

  const handleSort = () => {
    if (sortBy === "name") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy("name");
      setSortOrder("asc");
    }
  };

  const handlePathClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
  };

  const toolbarButtons = [
    {
      icon: <List className="w-5 h-5" />,
      label: "视图",
      onClick: () => setViewMode(viewMode === "grid" ? "list" : "grid"),
      priority: "high",
    },
    {
      icon: <ArrowUpDown className="w-5 h-5" />,
      label: "排序",
      onClick: handleSort,
      priority: "high",
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: "上传",
      onClick: openModals.upload,
      priority: "high",
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: "分享",
      onClick: openModals.share,
      priority: "medium",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "历史",
      onClick: openModals.versionHistory,
      priority: "medium",
    },
    {
      icon: <Tag className="w-5 h-5" />,
      label: "标签",
      onClick: openModals.tagManager,
      priority: "medium",
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      label: "同步",
      onClick: openModals.realtimeCollaboration,
      priority: "low",
    },
    {
      icon: <Archive className="w-5 h-5" />,
      label: "压缩",
      onClick: openModals.fileCompression,
      priority: "low",
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      label: "云端",
      onClick: openModals.cloudIntegration,
      priority: "low",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: "加密",
      onClick: openModals.fileEncryption,
      priority: "low",
    },
  ];

  const visibleButtons = toolbarButtons.filter((button) =>
    isToolbarExpanded ? true : button.priority === "high"
  );

  const moreButtons = toolbarButtons.filter(
    (button) => !isToolbarExpanded && button.priority !== "high"
  );

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      }}
      className="bg-gray-800/95 backdrop-blur-sm p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between shadow-md sticky top-0 z-50"
    >
      <div className="flex items-center w-full md:w-auto gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 mt-4">
              <Button
                onClick={openModals.settings}
                variant="ghost"
                size="sm"
                className="justify-start"
              >
                <Settings className="w-5 h-5 mr-2" /> Settings
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Button
          onClick={() => setCurrentPath(currentPath.slice(0, -1))}
          variant="outline"
          size="sm"
          disabled={currentPath.length === 0}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <ScrollArea className="max-w-[200px] md:max-w-none">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => setCurrentPath([])}>
                  <Home className="w-4 h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              {currentPath.map((folder, index) => (
                <React.Fragment key={folder}>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => handlePathClick(index)}>
                      {folder}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < currentPath.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </ScrollArea>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "shrink-0",
            isMultiSelectMode && "bg-blue-500/20 text-blue-500"
          )}
          onClick={toggleMultiSelectMode}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="sr-only">Toggle multi-select</span>
        </Button>
      </div>

      <div
        className={`flex items-center gap-2 w-full md:w-auto transition-all ${
          isSearchExpanded ? "flex-1" : ""
        }`}
      >
        <div
          className={`relative transition-all ${
            isSearchExpanded ? "flex-1" : "w-48 md:w-64"
          }`}
        >
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchExpanded(true)}
            onBlur={() => setIsSearchExpanded(false)}
            className="w-full bg-gray-700 text-white rounded-full px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1"
            onClick={openModals.advancedSearch}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {visibleButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              disabled={isBatchProcessing}
            >
              {button.icon}
              {isToolbarExpanded && <span>{button.label}</span>}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
          >
            {isToolbarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreButtons.map((button, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={button.onClick}
                  disabled={isBatchProcessing}
                >
                  {button.icon}
                  <span className="ml-2">{button.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isBatchProcessing && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">处理中...</span>
            </div>
          )}
        </div>

        {lastActions.length > 0 && (
          <div className="hidden md:flex items-center gap-2">
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                最近: {lastActions[lastActions.length - 1]}
              </span>
            </div>
          </div>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>工具</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 mt-4">
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    button.onClick();
                    setShowMoreTools(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  disabled={isBatchProcessing}
                >
                  {button.icon}
                  <span className="ml-2">{button.label}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  );
};
