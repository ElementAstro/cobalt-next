import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePluginStore } from "@/lib/store/plugin";

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface VerticalTabsProps {
  tabs: Tab[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function VerticalTabs({ tabs }: VerticalTabsProps) {
  const activeTab = usePluginStore((state) => state.activeTab);
  const setActiveTab = usePluginStore((state) => state.setActiveTab);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = async (value: string) => {
    setIsLoading(true);
    await setActiveTab(value);
    setIsLoading(false);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-900"
    >
      <motion.div
        variants={itemVariants}
        className="w-full sm:w-1/4 mb-4 sm:mb-0"
      >
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "ghost"}
            className={`w-full justify-start text-left mb-2 text-white dark:text-gray-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleTabChange(tab.value)}
            disabled={isLoading}
          >
            {tab.label}
            {isLoading && activeTab === tab.value && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-2"
              >
                ⭕
              </motion.div>
            )}
          </Button>
        ))}
      </motion.div>
      <motion.div variants={itemVariants} className="w-full sm:w-3/4 sm:pl-4">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </motion.div>
    </motion.div>
  );
}
