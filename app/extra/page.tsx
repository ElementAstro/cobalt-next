"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store/extra/app";
import { SearchBar } from "@/components/custom/SearchBar";
import { CategoryFilter } from "./layout/CategoryFilter";
import { AppIcon } from "./layout/AppIcon";
import { AddAppDialog } from "./layout/AddAppDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Grid, List, Pin, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppLaunchModal } from "./layout/AppLaunchModal";
import type { DropResult } from "react-beautiful-dnd";
import { Span } from "@/components/custom/Span";

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
  } = useAppStore();

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

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;
    updateAppOrder(result.source.index, result.destination.index);
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

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background landscape:flex landscape:flex-row"
      >
        {/* 侧边栏 - 在横屏模式下显示 */}
        <motion.div className="hidden landscape:block w-64 border-r border-border p-4 h-screen">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            orientation="vertical"
          />
          {/* 最近使用的应用 */}
          <div className="mt-8">
            <h3 className="text-sm font-medium mb-4">最近使用</h3>
            <div className="space-y-2">
              {recentApps.map((app) => (
                <Button
                  key={app.id}
                  variant="ghost"
                  className="w-full justify-start"
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
              ))}
            </div>
          </div>
        </motion.div>

        {/* 主内容区域 */}
        <div className="flex-1 p-4 landscape:h-screen landscape:overflow-y-auto">
          {/* 顶部操作栏 */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <SearchBar
                initialSuggestions={apps.map((app) => app.name)}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="搜索应用..."
                variant="default"
                className="flex-1 min-w-[200px]"
              />
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
                >
                  {isSelectionMode ? "取消选择" : "多选"}
                </Button>
                <AddAppDialog onAddApp={addNewApp} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setView(view === "grid" ? "list" : "grid")}
                  aria-label={
                    view === "grid" ? "切换到列表视图" : "切换到网格视图"
                  }
                >
                  {view === "grid" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid className="h-4 w-4" />
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

          {/* 应用列表内容 */}
          <div className="space-y-8">
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="pinnedApps"
                  direction={view === "grid" ? "horizontal" : "vertical"}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        view === "grid"
                          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                          : "space-y-2"
                      )}
                    >
                      <AnimatePresence>
                        {pinnedApps.map((app, index) => (
                          <Draggable
                            key={app.id}
                            draggableId={app.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
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
                                  onEdit={(newName) =>
                                    editAppName(app.id, newName)
                                  }
                                  view={view}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </section>

            {/* All Apps Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">所有应用</h2>
              </div>
              <motion.div
                className={cn(
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
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
                  {filteredApps.map((app) => (
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
          </div>
        </div>
      </motion.div>
      <AppLaunchModal app={launchedApp} onClose={() => setLaunchedApp(null)} />
    </TooltipProvider>
  );
}
