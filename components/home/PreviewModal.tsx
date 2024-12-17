import React from "react";
import { Site } from "@/types/home";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomIframe } from "@/components/custom/Iframe";
import { Loader2 } from "lucide-react";

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

  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0.3, 1, 0.3]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.y) > 100) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ y, opacity }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-indigo-900/90 dark:bg-gray-900/90 rounded-lg shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">
            {site.name} 预览
          </h2>
          <Button onClick={onClose} variant="ghost" className="text-gray-100">
            关闭
          </Button>
        </div>
        <div className="p-4 h-[calc(90vh-8rem)] overflow-hidden">
          <CustomIframe
            src={site.url}
            title={`${site.name} 预览`}
            className="w-full h-full rounded-md border border-indigo-600/30"
            allowFullScreen={true}
            height="100%"
            loadingComponent={
              <div className="flex items-center justify-center space-x-2 h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>加载中...</span>
              </div>
            }
            errorComponent={
              <div className="flex items-center justify-center text-red-500 h-full">
                加载失败，请检查网址是否正确或稍后重试
              </div>
            }
            allowScripts={true}
            timeout={15000}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
