"use client";

import { useState, useRef } from "react";
import {
  Upload,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Undo,
  Redo,
  Palette,
  Download,
  Scissors,
  Crop as CropIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Header from ".//Header";
import Toolbar from "./Toolbar";
import EditorTabs from "./EditorTabs";
import { useOrientation } from "@/hooks/use-orientation";

type EditState = {
  rotation: number;
  scale: number;
  brightness: number;
  contrast: number;
  hue: number;
  blur: number;
  sharpen: number;
  borderWidth: number;
  borderColor: string;
  overlayColor: string;
  crop: Crop | null;
};

const initialEditState: EditState = {
  rotation: 0,
  scale: 1,
  brightness: 100,
  contrast: 100,
  hue: 0,
  blur: 0,
  sharpen: 0,
  borderWidth: 0,
  borderColor: "#000000",
  overlayColor: "rgba(0, 0, 0, 0)",
  crop: null,
};

const presets = {
  none: { ...initialEditState },
  vintage: {
    brightness: 110,
    contrast: 85,
    hue: 20,
    overlayColor: "rgba(255, 240, 220, 0.2)",
  },
  cool: {
    brightness: 100,
    contrast: 110,
    hue: 180,
    overlayColor: "rgba(0, 255, 255, 0.1)",
  },
  warm: {
    brightness: 105,
    contrast: 95,
    hue: -20,
    overlayColor: "rgba(255, 160, 0, 0.1)",
  },
  sharp: { brightness: 110, contrast: 130, sharpen: 50 },
};

export default function IconEditor() {
  const isLandscape = useOrientation();
  const [iconSrc, setIconSrc] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>(initialEditState);
  const [history, setHistory] = useState<EditState[]>([initialEditState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconSrc(e.target?.result as string);
        setEditState(initialEditState);
        setHistory([initialEditState]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEditState = (newState: Partial<EditState>) => {
    setEditState((prev) => {
      const updated = { ...prev, ...newState };
      setHistory((prevHistory) => [
        ...prevHistory.slice(0, historyIndex + 1),
        updated,
      ]);
      setHistoryIndex((prevIndex) => prevIndex + 1);
      return updated;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setEditState(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setEditState(history[historyIndex + 1]);
    }
  };

  const handleDelete = () => {
    setIconSrc(null);
    setEditState(initialEditState);
    setHistory([initialEditState]);
    setHistoryIndex(0);
  };

  const handleCropComplete = (crop: Crop) => {
    updateEditState({ crop });
  };

  const handleCropApply = () => {
    if (editState.crop && imgRef.current) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = editState.crop.width!;
      canvas.height = editState.crop.height!;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          editState.crop.x! * scaleX,
          editState.crop.y! * scaleY,
          editState.crop.width! * scaleX,
          editState.crop.height! * scaleY,
          0,
          0,
          editState.crop.width!,
          editState.crop.height!
        );
        setIconSrc(canvas.toDataURL("image/png"));
        setEditState((prev) => ({ ...prev, crop: null }));
        setIsCropping(false);
      }
    }
  };

  const applyPreset = (preset: keyof typeof presets) => {
    updateEditState(presets[preset]);
  };

  const handleExport = (size: number) => {
    if (imgRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.filter = `brightness(${editState.brightness}%) contrast(${editState.contrast}%) hue-rotate(${editState.hue}deg) blur(${editState.blur}px)`;
        ctx.translate(size / 2, size / 2);
        ctx.rotate((editState.rotation * Math.PI) / 180);
        ctx.scale(editState.scale, editState.scale);
        ctx.drawImage(imgRef.current, -size / 2, -size / 2, size, size);

        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = editState.overlayColor;
        ctx.fillRect(-size / 2, -size / 2, size, size);

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = editState.borderColor;
        ctx.lineWidth = editState.borderWidth;
        ctx.strokeRect(-size / 2, -size / 2, size, size);

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `icon-${size}x${size}.png`;
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <div
        className={`container mx-auto px-4 py-6 ${
          isLandscape
            ? "flex flex-row gap-8 h-[calc(100vh-4rem)] overflow-hidden"
            : "flex flex-col gap-6"
        }`}
      >
        <motion.div
          className={`relative flex justify-center items-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl ${
            isLandscape
              ? "w-3/5 h-full"
              : "aspect-square w-full max-w-2xl mx-auto"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {iconSrc ? (
              isCropping ? (
                <ReactCrop
                  crop={editState.crop || undefined}
                  onChange={(_, percentCrop) => handleCropComplete(percentCrop)}
                  aspect={1}
                >
                  <img src={iconSrc} alt="Icon to crop" ref={imgRef} />
                </ReactCrop>
              ) : (
                <motion.img
                  ref={imgRef}
                  src={iconSrc}
                  alt="Uploaded icon"
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `rotate(${editState.rotation}deg) scale(${editState.scale})`,
                    filter: `brightness(${editState.brightness}%) contrast(${editState.contrast}%) hue-rotate(${editState.hue}deg) blur(${editState.blur}px)`,
                    border: `${editState.borderWidth}px solid ${editState.borderColor}`,
                  }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  whileTap={{ cursor: "grabbing" }}
                />
              )
            ) : (
              <Label htmlFor="icon-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="sr-only">Upload icon</span>
              </Label>
            )}
          </AnimatePresence>
        </motion.div>
        <Input
          id="icon-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <div
          className={`${
            isLandscape
              ? "w-2/5 h-full overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              : "w-full max-w-2xl mx-auto"
          }`}
        >
          <Toolbar
            onUpload={() => fileInputRef.current?.click()}
            onDelete={handleDelete}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onCrop={() => setIsCropping(true)}
            isCropping={isCropping}
            onCropApply={handleCropApply}
            onCropCancel={() => setIsCropping(false)}
            isLandscape={isLandscape}
          />
          {iconSrc && (
            <EditorTabs
              editState={editState}
              updateEditState={updateEditState}
              applyPreset={applyPreset}
              handleExport={handleExport}
              presets={presets}
              isLandscape={isLandscape}
            />
          )}
        </div>
      </div>
    </div>
  );
}
