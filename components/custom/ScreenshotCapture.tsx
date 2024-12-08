"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Edit, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface ScreenshotCaptureProps {
  onCapture: (screenshot: string) => void;
  onEdit: () => void;
  onShare: () => void;
}

const ScreenshotCapture: React.FC<ScreenshotCaptureProps> = ({
  onCapture,
  onEdit,
  onShare,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({});
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")!
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      const screenshot = canvas.toDataURL("image/png");
      onCapture(screenshot);

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
    setIsCapturing(false);
  };

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button onClick={captureScreen} disabled={isCapturing}>
        <Camera className="mr-2 h-4 w-4" />
        {isCapturing ? "Capturing..." : "Capture Screenshot"}
      </Button>
      <Button onClick={onEdit} variant="outline">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button onClick={onShare} variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </motion.div>
  );
};

export default ScreenshotCapture;
