"use client";

import { motion, AnimatePresence } from "framer-motion";

interface VersionDetailsProps {
  show: boolean;
}

export default function VersionDetails({ show }: VersionDetailsProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pl-4 space-y-1"
        >
          <div>Core Version: 2.1.0</div>
          <div>Build Date: 2024-08-15</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
