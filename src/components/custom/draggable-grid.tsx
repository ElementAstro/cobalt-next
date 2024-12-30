"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppGroup, App } from "@/types/extra/index";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimation,
  Modifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { create } from "zustand";

// Zustand store for managing selected app
interface AppStore {
  selectedApp: App | null;
  setSelectedApp: (app: App | null) => void;
}

const useAppStore = create<AppStore>((set) => ({
  selectedApp: null,
  setSelectedApp: (app) => set({ selectedApp: app }),
}));

interface SortableAppProps {
  app: App;
  itemClassName?: string;
}

function SortableApp({ app, itemClassName }: SortableAppProps) {
  const { setSelectedApp } = useAppStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transform ? 'transform 150ms ease' : transition,
    zIndex: isDragging ? 1 : 0,
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
  };

  const modifiers: Modifier[] = [
    ({ transform }) => ({
      ...transform,
      scaleX: 1.05,
      scaleY: 1.05,
    }),
  ];

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-move",
          itemClassName
        )}
        onClick={() => setSelectedApp(app)}
      >
        <Image
          src={app.icon}
          alt={app.name}
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
        <span className="text-sm text-gray-600 text-center line-clamp-1">
          {app.name}
        </span>
      </Button>
    </div>
  );
}

export function AppGrid({
  title = "收藏夹",
  apps,
  onAppChange,
  onClose,
  columns = 3,
  className,
  itemClassName,
}: AppGroup) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedApp = useAppStore((state) => state.selectedApp);
  const setSelectedApp = useAppStore((state) => state.setSelectedApp);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  function handleDragStart(event: DragEndEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = apps.findIndex((app) => app.id === active.id);
      const newIndex = apps.findIndex((app) => app.id === over?.id);

      const newFavorites = arrayMove(apps, oldIndex, newIndex);
      onAppChange(newFavorites);
    }
    setActiveId(null);
  }

  const activeApp = apps.find((app) => app.id === activeId);

  return (
    <>
      <Card
        className={cn(
          "w-full max-w-md mx-auto bg-gray-800/80 backdrop-blur-sm",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              {title}
            </CardTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={apps.map((app) => app.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className={cn(
                  "grid gap-4",
                  columns === 2 && "grid-cols-2",
                  columns === 3 && "grid-cols-3",
                  columns === 4 && "grid-cols-4"
                )}
              >
                {apps.map((app) => (
                  <SortableApp
                    key={app.id}
                    app={app}
                    itemClassName={itemClassName}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay
              dropAnimation={{
                ...defaultDropAnimation,
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}
            >
              {activeApp ? (
                <div className="transform scale-105">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-lg",
                      itemClassName
                    )}
                  >
                    <Image
                      src={activeApp.icon}
                      alt={activeApp.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-sm text-gray-600 text-center line-clamp-1">
                      {activeApp.name}
                    </span>
                  </Button>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* App Detail Dialog */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle>{selectedApp.name}</DialogTitle>
              <DialogDescription>
                <Image
                  src={selectedApp.icon}
                  alt={selectedApp.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain mx-auto mb-4"
                />
                <p>类别: {selectedApp.category}</p>
                {selectedApp.lastOpened && (
                  <p>上次打开: {selectedApp.lastOpened}</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Button
                onClick={() => window.open(selectedApp.url, "_blank")}
                className="bg-teal-500 text-white"
              >
                打开应用
              </Button>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
