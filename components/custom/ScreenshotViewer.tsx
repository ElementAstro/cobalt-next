"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScreenshotCapture from "./ScreenshotCapture";
import ScreenshotEditor from "./ScreenshotEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScreenshotViewerProps {
  initialSrc?: string;
  alt: string;
  title?: string;
}

const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({
  initialSrc,
  alt,
  title = "Screenshot",
}) => {
  const [src, setSrc] = useState(
    initialSrc || "/placeholder.svg?height=400&width=800"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleCapture = (screenshot: string) => {
    setSrc(screenshot);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (editedScreenshot: string) => {
    setSrc(editedScreenshot);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleShare = () => {
    setIsSharing(true);
  };

  const handleCloseShare = () => {
    setIsSharing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gray-100 rounded-xl shadow-2xl overflow-hidden">
        {/* macOS-style title bar */}
        <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-grow text-center text-sm font-medium text-gray-600">
            {title}
          </div>
        </div>

        {/* Screenshot container */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-4"
        >
          <img
            src={src}
            alt={alt}
            className="rounded-md shadow-lg w-full h-auto"
          />
        </motion.div>
      </div>
      <div className="mt-4">
        <ScreenshotCapture
          onCapture={handleCapture}
          onEdit={handleEdit}
          onShare={handleShare}
        />
      </div>

      <AnimatePresence>
        {isEditing && (
          <ScreenshotEditor
            src={src}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </AnimatePresence>

      <Dialog open={isSharing} onOpenChange={handleCloseShare}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Screenshot</DialogTitle>
            <DialogDescription>
              Here's a link to your screenshot:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <input
              type="text"
              value={src}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ScreenshotViewer;
