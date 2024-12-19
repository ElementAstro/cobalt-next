"use client";

import { Shield, Code, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background/10 to-background/80 dark:from-background/50 dark:to-background py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t("title")}
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { icon: Shield, text: t("security"), variant: "default" },
              { icon: Code, text: t("linesOfCode"), variant: "secondary" },
              { icon: Star, text: t("rating"), variant: "outline" },
            ].map((item, index) => (
              <Badge
                key={index}
                variant={item.variant as any}
                className="text-sm py-1.5 px-4 gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.text}
              </Badge>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t("getStarted")}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
