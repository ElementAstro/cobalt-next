"use client";

import React, { useState } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import * as Icons from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import type { SettingGroup } from "@/types/config";
import SettingItem from "./settings-item";

interface SettingGroupProps {
  group: SettingGroup;
  path: string[];
}

const SettingGroup: React.FC<SettingGroupProps> = ({ group, path }) => {
  const controls = useAnimation();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccordionChange = async (value: string) => {
    if (value === group.id) {
      await controls.start({
        rotate: 180,
        transition: { duration: 0.2 },
      });
    } else {
      await controls.start({
        rotate: 0,
        transition: { duration: 0.2 },
      });
    }
  };
  return (
    <AccordionItem value={group.id}>
      <AccordionTrigger className="hover:no-underline group">
        <motion.div
          className="flex items-center w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
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
      <AccordionContent className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {group.settings.map((item, index) =>
              "settings" in item ? (
                <Accordion key={item.id} type="single" collapsible>
                  <SettingGroup group={item} path={[...path, group.id]} />
                </Accordion>
              ) : (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-4"
                >
                  <SettingItem item={item} path={[...path, group.id]} />
                </motion.div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SettingGroup;
