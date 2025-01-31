"use client";

import React, { useState, useEffect } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import * as Icons from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import type { SettingGroup as SettingGroupType } from "@/types/config";
import SettingItem from "./settings-item";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AnimationConfig {
  iconRotation?: number;
  hoverScale?: number;
  transitionDuration?: number;
  staggerDelay?: number;
}

interface SettingGroupProps {
  group: SettingGroupType;
  path: string[];
  className?: string;
  animationConfig?: AnimationConfig;
}

const defaultAnimationConfig: AnimationConfig = {
  iconRotation: 180,
  hoverScale: 1.02,
  transitionDuration: 0.3,
  staggerDelay: 0.05,
};

export const SettingGroup: React.FC<SettingGroupProps> = ({
  group,
  path,
  className,
  animationConfig = defaultAnimationConfig,
}) => {
  const controls = useAnimation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mergedConfig = { ...defaultAnimationConfig, ...animationConfig };

  useEffect(() => {
    const handleAnimation = async (isOpen: boolean) => {
      await controls.start({
        rotate: isOpen ? mergedConfig.iconRotation : 0,
        transition: { duration: mergedConfig.transitionDuration },
      });
    };

    const accordion = document.querySelector(`[data-value="${group.id}"]`);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-state") {
          const isOpen =
            (mutation.target as HTMLElement).getAttribute("data-state") ===
            "open";
          handleAnimation(isOpen);
        }
      });
    });

    if (accordion) {
      observer.observe(accordion, { attributes: true });
    }

    return () => observer.disconnect();
  }, [
    controls,
    group.id,
    mergedConfig.iconRotation,
    mergedConfig.transitionDuration,
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: mergedConfig.staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AccordionItem
      value={group.id}
      className={cn(
        "border-b border-muted/20 last:border-0",
        className
      )}
      data-value={group.id}
    >
      <AccordionTrigger className="hover:no-underline group px-2">
        <motion.div
          className="flex items-center w-full py-2"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {group.icon &&
            React.createElement(
              Icons[group.icon as keyof typeof Icons] as React.ElementType,
              {
                className: "mr-2 h-5 w-5 text-primary",
                animate: controls,
              }
            )}
          <span className="text-white group-hover:text-primary transition-colors duration-200">
            {group.label}
          </span>
          {isLoading && (
            <motion.div
              className="ml-2"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Icons.Loader2 className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          )}
        </motion.div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-4 pr-2 pb-2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3"
          >
            {group.settings.map((item, index) =>
              "settings" in item ? (
                <Accordion key={item.id} type="single" collapsible>
                  <SettingGroup
                    group={item}
                    path={[...path, group.id]}
                    animationConfig={mergedConfig}
                  />
                </Accordion>
              ) : (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="mb-4"
                >
                  <SettingItem
                    item={item}
                    path={[...path, group.id]}
                    onError={(err) => {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: err,
                      });
                    }}
                    onSuccess={() => {
                      toast({
                        title: "Success",
                        description: "Settings saved successfully!",
                      });
                    }}
                  />
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
