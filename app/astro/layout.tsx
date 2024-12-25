"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ConnectionStatus from "@/components/astropanel/ConnectionStatus";
import { useAstroStore } from "@/lib/store/astropanel";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { showWeather, toggleWeather, isConnected, lastUpdate } =
    useAstroStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-4"
      >
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-4">
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              天文观测面板
            </motion.h1>
            <ConnectionStatus
              isConnected={isConnected}
              lastUpdate={lastUpdate}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showWeather ? "default" : "outline"}
              onClick={toggleWeather}
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
            >
              天气信息
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>设置</SheetTitle>
                </SheetHeader>
                {/* Add settings content */}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  );
}
