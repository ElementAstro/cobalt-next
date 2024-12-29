"use client";

import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SettingGroup } from "@/types/config";
import SettingItem from "./settings-item";

interface SettingGroupProps {
  group: SettingGroup;
  path: string[];
}

const SettingGroup: React.FC<SettingGroupProps> = ({ group, path }) => {
  return (
    <AccordionItem value={group.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center">
          {group.icon &&
            React.createElement(
              Icons[group.icon as keyof typeof Icons] as React.ElementType,
              { className: "mr-2 h-5 w-5 text-primary" }
            )}
          <span className="text-white">{group.label}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <AnimatePresence>
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
        </AnimatePresence>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SettingGroup;
