"use client";

import React from "react";
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
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

interface HeaderProps {
  currentPath: string[];
  setCurrentPath: (path: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "name" | "size" | "lastModified";
  sortOrder: "asc" | "desc";
  setSortBy: (by: "name" | "size" | "lastModified") => void;
  setSortOrder: (order: "asc" | "desc") => void;
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
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const handleSort = () => {
    if (sortBy === "name") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy("name");
      setSortOrder("asc");
    }
  };

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
        {/* 移动端菜单 */}
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
              {/* 移动端工具栏项目 */}
              <Button
                onClick={openModals.settings}
                variant="ghost"
                size="sm"
                className="justify-start"
              >
                <Settings className="w-5 h-5 mr-2" /> Settings
              </Button>
              {/* ... 其他工具栏项目 ... */}
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
                    <BreadcrumbLink
                      onClick={() =>
                        setCurrentPath(currentPath.slice(0, index + 1))
                      }
                    >
                      {folder}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < currentPath.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </ScrollArea>
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

        {/* 桌面端工具栏 */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            variant="ghost"
            size="sm"
          >
            {viewMode === "grid" ? (
              <List className="w-5 h-5" />
            ) : (
              <Grid className="w-5 h-5" />
            )}
          </Button>
          <Button onClick={handleSort} variant="ghost" size="sm">
            <ArrowUpDown className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.upload} variant="ghost" size="sm">
            <Upload className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.search} variant="ghost" size="sm">
            <Search className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.share} variant="ghost" size="sm">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.versionHistory} variant="ghost" size="sm">
            <Clock className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.tagManager} variant="ghost" size="sm">
            <Tag className="w-5 h-5" />
          </Button>
          <Button
            onClick={openModals.realtimeCollaboration}
            variant="ghost"
            size="sm"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
          <Button
            onClick={openModals.fileCompression}
            variant="ghost"
            size="sm"
          >
            <Archive className="w-5 h-5" />
          </Button>
          <Button
            onClick={openModals.cloudIntegration}
            variant="ghost"
            size="sm"
          >
            <Cloud className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.authModal} variant="ghost" size="sm">
            <Lock className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.trashBin} variant="ghost" size="sm">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button onClick={openModals.fileEncryption} variant="ghost" size="sm">
            <Lock className="w-5 h-5" />
          </Button>
          {selectedFiles.length > 0 && (
            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* 更多选项下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* ... 更多选项菜单项 ... */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};
