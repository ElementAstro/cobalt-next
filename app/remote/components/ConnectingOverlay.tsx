"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ConnectingOverlayProps {
  isConnecting: boolean;
}

const ConnectingOverlay: React.FC<ConnectingOverlayProps> = ({ isConnecting }) => {
  return (
    <AnimatePresence>
      {isConnecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4"
          >
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg font-medium">正在连接到远程桌面...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectingOverlay;
