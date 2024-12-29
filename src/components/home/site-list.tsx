"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import SiteCard from "./site-card";
import { Site } from "@/types/home";

interface SiteListProps {
  sites: Site[];
  onDragEnd: (newSites: Site[]) => void;
  removeSite: (site: Site) => void;
  toggleQuickAccess: (site: Site) => void;
  setEditingSite: (site: Site) => void;
  controls: any;
  onPreview: (site: Site) => void;
}

interface SortableItemProps {
  site: Site;
  removeSite: (site: Site) => void;
  toggleQuickAccess: (site: Site) => void;
  setEditingSite: (site: Site) => void;
  onPreview: (site: Site) => void;
}

const SortableItem: React.FC<SortableItemProps & { id: string }> = ({
  site,
  removeSite,
  toggleQuickAccess,
  setEditingSite,
  onPreview,
  id,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <motion.div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <SiteCard
        site={site}
        removeSite={removeSite}
        toggleQuickAccess={toggleQuickAccess}
        setEditingSite={setEditingSite}
        onPreview={onPreview}
      />
    </motion.div>
  );
};

const SiteList: React.FC<SiteListProps> = ({
  sites,
  onDragEnd,
  removeSite,
  toggleQuickAccess,
  setEditingSite,
  controls,
  onPreview,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sites.findIndex((site) => site.id === active.id);
      const newIndex = sites.findIndex((site) => site.id === over?.id);
      const newSites = arrayMove(sites, oldIndex, newIndex);
      onDragEnd(newSites);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sites.map((site) => site.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 
                landscape:md:grid-cols-2 landscape:lg:grid-cols-3 landscape:xl:grid-cols-4 
                gap-2 sm:gap-4 transition-all duration-300"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
              },
            },
            hidden: {
              transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
              },
            },
          }}
        >
          {sites.map((site) => (
            <SortableItem
              key={site.id}
              id={site.id}
              site={site}
              removeSite={removeSite}
              toggleQuickAccess={toggleQuickAccess}
              setEditingSite={setEditingSite}
              onPreview={onPreview}
            />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
};

export default SiteList;
