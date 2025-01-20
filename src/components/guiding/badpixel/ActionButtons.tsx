"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Plus } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const pixelSchema = z.number()
  .min(0, "像素坐标不能小于0")
  .max(4144 * 2822 - 1, "像素坐标超出范围");

interface ActionButtonsProps {
  resetCorrectionLevels: () => void;
  generateBadPixels: () => Promise<void>;
  handleManualAddPixel: (pixel: number) => void;
  manualPixel: string;
  setManualPixel: (value: string) => void;
}

export default function ActionButtons({
  resetCorrectionLevels,
  generateBadPixels,
  handleManualAddPixel,
  manualPixel,
  setManualPixel,
}: ActionButtonsProps) {
  const { toast } = useToast();

  const handleAddPixel = async () => {
    try {
      const parsedPixel = pixelSchema.parse(Number(manualPixel));
      await handleManualAddPixel(parsedPixel);
      setManualPixel("");
      toast({
        title: "成功添加坏点",
        description: `坐标 ${parsedPixel} 已添加`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "输入错误",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "添加失败",
          description: "未知错误",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="flex justify-between space-x-2"
    >
      <Button 
        variant="outline" 
        size="sm" 
        onClick={resetCorrectionLevels}
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        重置
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={generateBadPixels}
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Play className="mr-2 h-4 w-4" />
        生成
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAddPixel}
        disabled={!manualPixel}
        className="hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        增加坏点
      </Button>
    </motion.div>
  );
}
