import React from "react";
import { Site } from "@/types/home";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site | null;
}

export default function PreviewModal({
  isOpen,
  onClose,
  site,
}: PreviewModalProps) {
  if (!isOpen || !site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {site.name} 预览
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-900 dark:text-gray-100"
          >
            关闭
          </Button>
        </div>
        <div className="p-4">
          <iframe
            src={site.url}
            title={`${site.name} 预览`}
            className="w-full h-96 rounded-md border dark:border-gray-700"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}
