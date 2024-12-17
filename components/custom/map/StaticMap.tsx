"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { constructMapUrl } from "./StaticMapUtils";
import { Loader2 } from "lucide-react";

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
}: StaticMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

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
    zoom,
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

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden bg-gray-100"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
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
      <Image
        src={mapUrl}
        alt="Static Map"
        width={width}
        height={height}
        className={`w-full h-auto ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Failed to load map
        </motion.div>
      )}
    </motion.div>
  );
}
