"use client";

import { X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGuidingStore } from "@/store/useGuidingStore";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function GuidingConfig() {
  const {
    settings,
    setSettings,
    tracking,
    setTracking,
    calibration,
    historyGraph,
  } = useGuidingStore();

  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    try {
      setIsLoading(true);

      // 验证基础设置
      if (settings.radius <= 0) {
        throw new Error("搜星半径必须大于0");
      }

      if (settings.exposureTime < 100) {
        throw new Error("曝光时间不能小于100ms");
      }

      // 验证跟踪参数
      if (tracking.mod <= 0) {
        throw new Error("修正系数必须大于0");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setSettings({ ...settings, autoGuide: true });
      toast({
        title: "启动成功",
        description: "导星程序已成功启动",
      });
    } catch (err) {
      toast({
        title: "启动失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSettings({ ...settings, autoGuide: false });
      toast({
        title: "停止成功",
        description: "导星程序已成功停止",
      });
    } catch (err) {
      toast({
        title: "停止失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`w-full mx-auto ${
        isLandscape && isMobile ? "h-screen overflow-auto" : "max-w-4xl"
      } p-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">导星助手</CardTitle>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-lg">导星设置</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="radius" className="text-right text-xs">
                    搜星半径
                  </Label>
                  <Input
                    id="radius"
                    type="number"
                    value={settings.radius}
                    onChange={(e) =>
                      setSettings({ radius: Number(e.target.value) })
                    }
                    className="col-span-3 h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="zoom" className="text-right text-xs">
                    缩放等级
                  </Label>
                  <Input
                    id="zoom"
                    type="number"
                    value={settings.zoom}
                    onChange={(e) =>
                      setSettings({ zoom: Number(e.target.value) })
                    }
                    className="col-span-3 h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="exposureTime" className="text-right text-xs">
                    曝光时间(ms)
                  </Label>
                  <Input
                    id="exposureTime"
                    type="number"
                    value={settings.exposureTime}
                    onChange={(e) =>
                      setSettings({ exposureTime: Number(e.target.value) })
                    }
                    className="col-span-3 h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="mod" className="text-right text-xs">
                    修正系数
                  </Label>
                  <Input
                    id="mod"
                    type="number"
                    value={tracking.mod}
                    onChange={(e) =>
                      setTracking({ mod: Number(e.target.value) })
                    }
                    className="col-span-3 h-8 text-xs"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="correction"
                    checked={settings.correction}
                    onCheckedChange={(checked) =>
                      setSettings({ correction: checked as boolean })
                    }
                  />
                  <Label htmlFor="correction">启用修正</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trendLine"
                    checked={settings.trendLine}
                    onCheckedChange={(checked) =>
                      setSettings({ trendLine: checked as boolean })
                    }
                  />
                  <Label htmlFor="trendLine">显示趋势线</Label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-xs text-muted-foreground">
              选择一个良好的非饱和的星点并开始导星。
            </p>

            <div
              className={`grid ${
                isLandscape && isMobile
                  ? "grid-cols-1 gap-2"
                  : "grid-cols-1 md:grid-cols-2 gap-3"
              }`}
            >
              {/* 基础设置 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-sm font-semibold mb-1">基础设置</h3>
                <Table className="text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">搜星半径</TableCell>
                      <TableCell>{settings.radius.toFixed(1)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">缩放比例</TableCell>
                      <TableCell>{settings.zoom}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">坐标刻度</TableCell>
                      <TableCell>{settings.yScale}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </motion.div>

              {/* 跟踪参数 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold mb-1">跟踪参数</h3>
                <Table className="text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">修正系数</TableCell>
                      <TableCell>{tracking.mod}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">流畅度</TableCell>
                      <TableCell>{tracking.flow}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">导星长度</TableCell>
                      <TableCell>{tracking.guideLength}ms</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </motion.div>

              {/* 校准信息 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={
                  isLandscape && isMobile
                    ? "col-span-1"
                    : "col-span-1 md:col-span-2"
                }
              >
                <h3 className="text-sm font-semibold mb-1">校准信息</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤经星点数
                        </TableCell>
                        <TableCell>{calibration.data.raStars}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">相机角度</TableCell>
                        <TableCell>{calibration.data.cameraAngle}°</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">赤经速度</TableCell>
                        <TableCell>{calibration.data.raSpeed}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤纬星点数
                        </TableCell>
                        <TableCell>{calibration.data.decStars}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">正交误差</TableCell>
                        <TableCell>
                          {calibration.data.orthogonalError}°
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">赤纬速度</TableCell>
                        <TableCell>{calibration.data.decSpeed}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between space-x-2 text-xs">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={historyGraph.exportData}
                >
                  导出数据
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => calibration.handleRecalibrate()}
                >
                  重新校准
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleStart}
                  disabled={settings.autoGuide || isLoading}
                  size="sm"
                >
                  {isLoading ? "处理中..." : "开始导星"}
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!settings.autoGuide || isLoading}
                  variant="destructive"
                  size="sm"
                >
                  停止导星
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
