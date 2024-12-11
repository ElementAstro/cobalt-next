"use client";

import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { MountControlPanel } from "./MountControlPanel";
import { Button } from "@/components/ui/button";
import styles from "./TelescopeControlPage.module.css";

export const TelescopeControlPage: React.FC = () => {
  const [showControlPanel, setShowControlPanel] = useState(true);

  const handleToggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };

  return (
    <DndContext>
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Telescope Control System</h1>
        <div className={styles.mainContent}>
          <div className={styles.imageContainer}>
            {/* This is a placeholder for the telescope view or status display */}
            <div className={styles.telescopeView}>
              <p>Telescope View Placeholder</p>
            </div>
          </div>
          <Button variant="default" onClick={handleToggleControlPanel}>
            {showControlPanel ? "Hide Control Panel" : "Show Control Panel"}
          </Button>
        </div>
        {showControlPanel && <MountControlPanel />}
      </div>
    </DndContext>
  );
};
