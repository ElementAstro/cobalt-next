import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import styles from "./Settings.module.css";

interface SettingsProps {
  nightMode: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ nightMode, onClose }) => {
  return (
    <motion.div
      className={styles.settingsPanel}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Settings</h3>
      <div className={styles.settingItem}>
        <Label htmlFor="nightMode">Night Mode</Label>
        <Input type="checkbox" id="nightMode" checked={nightMode} />
      </div>
      <Button onClick={onClose}>Close</Button>
    </motion.div>
  );
};
