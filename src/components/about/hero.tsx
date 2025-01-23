"use client";

import {
  Star,
  Telescope,
  Moon,
  Camera,
  Satellite,
  CloudMoon,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Hero() {
  const { t } = useLanguage();

  const iconItems = [
    { icon: Telescope, label: "天文观测", color: "text-blue-400" },
    { icon: Camera, label: "摄影捕捉", color: "text-green-400" },
    { icon: Moon, label: "月相追踪", color: "text-yellow-400" },
    { icon: Star, label: "星体定位", color: "text-purple-400" },
    { icon: Satellite, label: "卫星跟踪", color: "text-red-400" },
    { icon: CloudMoon, label: "天气监测", color: "text-cyan-400" },
  ];

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4 bg-gradient-to-b from-background/10 to-background/80 overflow-hidden">
      {/* 动态图标背景 */}
      {iconItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute opacity-5"
          initial={{
            x: Math.random() * 1000,
            y: Math.random() * 1000,
          }}
          animate={{
            x: Math.random() * 1000,
            y: Math.random() * 1000,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <item.icon size={48} />
        </motion.div>
      ))}

      <div className="container mx-auto max-w-5xl z-10">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex justify-center items-center gap-2 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Image
              src="/atom.png"
              alt="Lithium Logo"
              width={128}
              height={128}
              className="animate-pulse-slow drop-shadow-2xl"
              priority
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-clip-text text-muted-foreground bg-gradient-to-r from-primary via-primary/80 to-primary/50">
              {t("title")}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <TooltipProvider>
              {iconItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 cursor-pointer transition-colors duration-200 ${item.color} hover:bg-white/10`}
                    >
                      <item.icon className="w-6 h-6" />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={4}
                    className="bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              size="lg"
              className="rounded-full group relative overflow-hidden backdrop-blur-sm"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />
              <span className="relative flex items-center gap-2">
                {t("getStarted")}
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* 底部装饰 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      />
    </section>
  );
}
