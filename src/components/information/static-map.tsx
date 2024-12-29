"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { constructMapUrl } from "./static-map-utils";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StaticMapProps {
  location: string;
  zoom: number;
  size?: string;
  scale?: number;
  markers?: string;
  labels?: string;
  paths?: string;
  traffic?: number;
  theme?: "normal" | "dark" | "light";
  features?: ("bg" | "road" | "building" | "point")[];
  opacity?: number;
  showControls?: boolean;
  showZoomButtons?: boolean;
  allowFullscreen?: boolean;
  showScale?: boolean;
  onMapClick?: (coordinates: string) => void;
}

export default function StaticMap({
  location,
  zoom,
  size = "400*300",
  scale,
  markers,
  labels,
  paths,
  traffic,
  theme = "normal",
  features = ["bg", "road", "building", "point"],
  opacity = 1,
  showControls = true,
  showZoomButtons = true,
  allowFullscreen = true,
  showScale = true,
  onMapClick,
}: StaticMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  const handleZoomIn = () => setCurrentZoom(Math.min(currentZoom + 1, 18));
  const handleZoomOut = () => setCurrentZoom(Math.max(currentZoom - 1, 3));

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const mapUrl = constructMapUrl({
    key: process.env.NEXT_PUBLIC_AMAP_KEY!,
    location,
    zoom: currentZoom,
    size: isLandscape ? "600*300" : size,
    scale,
    markers,
    labels,
    paths,
    traffic,
    style: `${theme}:${features.join(",")}`,
  });

  const [width, height] = (isLandscape ? "600*300" : size)
    .split("*")
    .map(Number);

  const handleImageClick = () => {
    if (onMapClick) {
      onMapClick(location);
    }
  };

  return (
    <motion.div
      className={`relative ${fullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ opacity }}
    >
      {showControls && (
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          {showZoomButtons && (
            <div className="flex flex-col gap-1">
              <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                +
              </Button>
              <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                -
              </Button>
            </div>
          )}
          {allowFullscreen && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? <Minimize2 /> : <Maximize2 />}
            </Button>
          )}
        </div>
      )}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </motion.div>
        )}
      </AnimatePresence>
      <div onClick={handleImageClick}>
        <Image
          src={mapUrl}
          alt="Static Map"
          width={width}
          height={height}
          className={`w-full h-auto ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-200 cursor-pointer`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>
      {hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          地图加载失败
        </motion.div>
      )}
      {showScale && scale && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          {Math.round((width * scale) / 100)}m
        </div>
      )}
      {fullscreen && (
        <Dialog open={fullscreen} onOpenChange={setFullscreen}>
          <DialogContent className="w-full h-full p-0">
            <DialogHeader>
              <DialogTitle>地图全屏视图</DialogTitle>
            </DialogHeader>
            <div className="w-full h-full">
              <Image
                src={mapUrl}
                alt="Fullscreen Map"
                width={width * 2}
                height={height * 2}
                className={`w-full h-auto ${
                  isLoading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-200`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
