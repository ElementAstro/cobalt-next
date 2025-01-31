"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { useExtraStore } from "@/store/useExtraStore";
import { SearchBar } from "@/components/custom/search-bar";
import { CategoryFilter } from "@/components/extra/category-filter";
import { AppIcon } from "@/components/extra/app-icon";
import { AddAppDialog } from "@/components/extra/add-app-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Grid,
  List,
  Pin,
  Trash2,
  Clock,
  X,
  CheckSquare,
  Settings,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppLaunchModal } from "@/components/extra/app-launch-modal";
import { Span } from "@/components/custom/span";
import { AppStatistics } from "@/components/extra/app-statistics";
import { useHotkeys } from "react-hotkeys-hook";
import { useStatistics } from "@/store/extra/statistics";
import useAnalyticsStore from "@/store/extra/analytics";
import { useSettingsStore } from "@/store/extra/settings";
import useWorkspaceStore from "@/store/extra/workspace";
import { animationVariants } from "@/config/icons";

export default function SoftwareList() {
  const {
    apps,
    searchQuery,
    selectedCategory,
    view,
    setSearchQuery,
    setSelectedCategory,
    setView,
    togglePin,
    launchApp,
    deleteApp,
    updateAppOrder,
    editAppName,
    addNewApp,
    launchedApp,
    setLaunchedApp,
    sortMode,
    gridSize,
    isSidebarOpen,
    isCompactMode,
    favorites,
    setSortMode,
    setGridSize,
    setSidebarOpen,
    setCompactMode,
    toggleFavorite,
    themeMode,
    setThemeMode,
  } = useExtraStore();

  const {
    trackAppUsage,
    addTag,
    removeTag,
    toggleFavorite: toggleFavoriteAnalytics,
    favorites: analyticsFavorites,
  } = useAnalyticsStore();

  const { appearance, shortcuts, performance, updateSettings } =
    useSettingsStore();

  const {
    workspaces,
    activeWorkspace,
    createWorkspace,
    setActiveWorkspace,
    updateWorkspaceLayout,
  } = useWorkspaceStore();

  const { addUsage } = useStatistics();

  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedApps = filteredApps.filter((app) => app.isPinned);
  const recentApps = [...apps]
    .filter((app) => app.lastOpened)
    .sort(
      (a, b) =>
        new Date(b.lastOpened!).getTime() - new Date(a.lastOpened!).getTime()
    )
    .slice(0, 4);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = apps.findIndex((app) => app.id === active.id);
      const newIndex = apps.findIndex((app) => app.id === over?.id);
      updateAppOrder(oldIndex, newIndex);
    }
  };

  useEffect(() => {
    console.log("Current view:", view);
  }, [view]);

  const handleBatchOperation = (operation: "pin" | "delete") => {
    selectedApps.forEach((appId) => {
      if (operation === "pin") {
        togglePin(appId);
      } else if (operation === "delete") {
        deleteApp(appId);
      }
    });
    setSelectedApps([]);
    setIsSelectionMode(false);
  };

  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      switch (sortMode) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return (
            new Date(b.lastOpened || 0).getTime() -
            new Date(a.lastOpened || 0).getTime()
          );
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [filteredApps, sortMode]);

  // 添加快捷键支持
  useHotkeys("ctrl+f", () => {
    // 聚焦搜索框
    const searchInput = document.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  useHotkeys("ctrl+g", () => {
    // 切换视图模式
    setView(view === "grid" ? "list" : "grid");
  });

  useHotkeys("ctrl+d", () => {
    // 切换暗色模式
    setThemeMode(themeMode === "light" ? "dark" : "light");
  });

  // 修改启动应用的处理函数
  const handleLaunchApp = (appId: string) => {
    const startTime = Date.now();
    launchApp(appId);

    // 在应用关闭时记录使用时长
    return () => {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      addUsage(appId, duration);
      trackAppUsage(appId, duration);
    };
  };

  useEffect(() => {
    if (appearance.theme !== themeMode) {
      setThemeMode(appearance.theme);
    }
  }, [appearance.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--app-animations",
      performance.animations ? "true" : "false"
    );
  }, [performance.animations]);

  if (!mounted) return null;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        }}
        className="min-h-screen bg-background flex"
      >
        <AnimatePresence mode="wait">
          {(isDesktop || isSidebarOpen) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
              }}
              exit={{
                x: -300,
                opacity: 0,
                transition: {
                  duration: 0.2,
                },
              }}
              className={cn(
                "fixed inset-y-0 left-0 z-50",
                "w-[240px] bg-background/80 backdrop-blur-sm border-r",
                "lg:relative lg:block",
                !isDesktop && "shadow-xl"
              )}
            >
              <div className="p-3 h-full flex flex-col gap-4">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  orientation="vertical"
                />
                {/* Recent Apps Section */}
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    最近使用
                  </h3>
                  <motion.div
                    className="space-y-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {recentApps.map((app) => (
                      <motion.div
                        key={app.id}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-accent/50 transition-colors"
                          onClick={() => launchApp(app.id)}
                        >
                          <Image
                            src={app.icon}
                            alt={app.name}
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          <span className="truncate">{app.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 h-screen overflow-y-auto">
          <div className="container mx-auto p-3 max-w-7xl">
            {/* Top Bar */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm -mx-3 px-3 py-2 border-b"
            >
              <div className="flex items-center gap-4 p-4 border-b">
                {!isDesktop && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SearchBar
                        initialSuggestions={apps.map((app) => app.name)}
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="搜索应用..."
                        variant="default"
                      />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelectionMode && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleBatchOperation("pin")}
                          disabled={selectedApps.length === 0}
                        >
                          <Pin className="w-4 h-4 mr-2" />
                          固定所选
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleBatchOperation("delete")}
                          disabled={selectedApps.length === 0}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除所选
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setIsSelectionMode(!isSelectionMode)}
                      className="relative"
                    >
                      {isSelectionMode ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          取消选择
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-4 h-4 mr-2" />
                          多选
                        </>
                      )}
                      {selectedApps.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                          {selectedApps.length}
                        </span>
                      )}
                    </Button>
                    <AddAppDialog onAddApp={addNewApp} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newTheme =
                          themeMode === "light" ? "dark" : "light";
                        setThemeMode(newTheme);
                      }}
                      aria-label="切换主题"
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      {themeMode === "light" ? (
                        <Moon className="h-4 w-4 transition-transform" />
                      ) : (
                        <Sun className="h-4 w-4 transition-transform" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setView(view === "grid" ? "list" : "grid")}
                      aria-label={
                        view === "grid" ? "切换到列表视图" : "切换到网格视图"
                      }
                      className="hover:scale-105 active:scale-95 transition-transform"
                    >
                      {view === "grid" ? (
                        <List className="h-4 w-4 transition-transform" />
                      ) : (
                        <Grid className="h-4 w-4 transition-transform" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* 在横屏模式下隐藏分类过滤器 */}
                <div className="landscape:hidden">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              variants={animationVariants.container}
              initial="hidden"
              animate="visible"
              className="space-y-6 mt-4"
            >
              {/* Grid/List Views */}
              <motion.div
                layout
                layoutRoot
                transition={{
                  layout: { duration: 0.3 },
                }}
                className={cn(
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                    : "space-y-1.5"
                )}
              >
                {/* Pinned Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">已固定</h2>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      全部 {">"}
                    </Link>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={pinnedApps.map((app) => app.id)}
                      strategy={
                        view === "grid"
                          ? horizontalListSortingStrategy
                          : verticalListSortingStrategy
                      }
                    >
                      <div
                        className={cn(
                          view === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full overflow-x-auto"
                            : "space-y-2"
                        )}
                      >
                        <AnimatePresence>
                          {pinnedApps.map((app) => (
                            <AppIcon
                              key={app.id}
                              id={app.id}
                              name={app.name}
                              icon={app.icon}
                              isPinned={app.isPinned}
                              category={app.category}
                              onPin={() => togglePin(app.id)}
                              onLaunch={() => launchApp(app.id)}
                              onDelete={() => deleteApp(app.id)}
                              onEdit={(newName) => editAppName(app.id, newName)}
                              view={view}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  </DndContext>
                </section>

                {/* All Apps Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">所有应用</h2>
                  </div>
                  <motion.div
                    className={cn(
                      view === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full overflow-x-auto"
                        : "space-y-2"
                    )}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    <AnimatePresence>
                      {sortedApps.map((app) => (
                        <motion.div
                          key={app.id}
                          variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: {
                              y: 0,
                              opacity: 1,
                            },
                          }}
                        >
                          <AppIcon
                            id={app.id}
                            name={app.name}
                            icon={app.icon}
                            isPinned={app.isPinned}
                            category={app.category}
                            onPin={() => togglePin(app.id)}
                            onLaunch={() => launchApp(app.id)}
                            onDelete={() => deleteApp(app.id)}
                            onEdit={(newName) => editAppName(app.id, newName)}
                            view={view}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </section>

                {/* Recent Apps Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">最近使用</h2>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      更多 {">"}
                    </Link>
                  </div>
                  <motion.div
                    className="grid gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {recentApps.map((app) => (
                      <motion.div
                        key={app.id}
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => launchApp(app.id)}
                      >
                        <Image
                          src={app.icon}
                          alt={app.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                        <div className="flex flex-col">
                          <Span size="sm" className="font-medium">
                            {app.name}
                          </Span>
                          <Span
                            size="sm"
                            variant="info"
                            className="text-muted-foreground"
                          >
                            {new Date(app.lastOpened!).toLocaleString("zh-CN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              </motion.div>
            </motion.div>
            {/* 添加统计部分 */}
            <div className="mt-6">
              <AppStatistics />
            </div>
          </div>
        </main>
      </motion.div>
      <AppLaunchModal app={launchedApp} onClose={() => setLaunchedApp(null)} />
    </TooltipProvider>
  );
}
