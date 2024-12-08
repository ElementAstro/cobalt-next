"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ScreenshotEditorProps {
  src: string;
  onSave: (editedScreenshot: string) => void;
  onCancel: () => void;
}

const ScreenshotEditor: React.FC<ScreenshotEditorProps> = ({
  src,
  onSave,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyFilters();
    };
    img.src = src;
  }, [src, brightness, contrast]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = src;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const editedScreenshot = canvas.toDataURL("image/png");
    onSave(editedScreenshot);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 max-w-2xl w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2 className="text-2xl font-bold mb-4">Edit Screenshot</h2>
        <div className="mb-4 overflow-auto max-h-[60vh]">
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brightness
            </label>
            <Slider
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              max={200}
              step={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contrast
            </label>
            <Slider
              value={[contrast]}
              onValueChange={(value) => setContrast(value[0])}
              max={200}
              step={1}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScreenshotEditor;
