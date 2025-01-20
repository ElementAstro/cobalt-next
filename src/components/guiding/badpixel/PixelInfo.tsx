"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const pixelSchema = z.number()
  .min(0, "像素坐标不能小于0")
  .max(4144 * 2822 - 1, "像素坐标超出范围");

interface PixelInfoProps {
  data: any;
  visualMode: "table" | "graph";
  isLandscape: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onManualAddPixel: (pixel: number) => void;
  manualPixel: string;
  setManualPixel: (value: string) => void;
}

export default function PixelInfo({ 
  data, 
  visualMode,
  isLandscape,
  expanded,
  onToggleExpand,
  onManualAddPixel,
  manualPixel,
  setManualPixel
}: PixelInfoProps) {
  const { toast } = useToast();

  const handleAddPixel = async () => {
    try {
      const parsedPixel = pixelSchema.parse(Number(manualPixel));
      await onManualAddPixel(parsedPixel);
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

  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  const totalPixels = data.width * data.height;
  const hotPixelPercentage = (data.hotPixelCount / totalPixels) * 100;
  const coldPixelPercentage = (data.coldPixelCount / totalPixels) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 统计信息卡片 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">相机信息</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">相机型号</TableCell>
                <TableCell>{data.simulator}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">分辨率</TableCell>
                <TableCell>{data.width} x {data.height}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">时间戳</TableCell>
                <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 坏点统计 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">坏点统计</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">热噪点</span>
              <Badge variant="destructive">{data.hotPixelCount}</Badge>
            </div>
            <Progress value={hotPixelPercentage} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">冷噪点</span>
              <Badge variant="secondary">{data.coldPixelCount}</Badge>
            </div>
            <Progress value={coldPixelPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* 手动添加坏点 */}
      <div className="space-y-2">
        <Label htmlFor="manual-pixel">手动添加坏点</Label>
        <div className="flex gap-2">
          <Input
            id="manual-pixel"
            value={manualPixel}
            onChange={(e) => setManualPixel(e.target.value)}
            placeholder="输入像素坐标 (0 - 11696767)"
            className="flex-1"
          />
          <Button 
            onClick={handleAddPixel}
            disabled={!manualPixel}
          >
            添加
          </Button>
        </div>
      </div>

      {/* 扩展按钮 */}
      {!isLandscape && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="w-full"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 mr-2" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-2" />
          )}
          {expanded ? "收起" : "展开"}
        </Button>
      )}
    </motion.div>
  );
}
