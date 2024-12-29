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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomOptions } from "@/types/guiding";
import { useGuidingConfigStore } from "@/store/useGuidingStore";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";

export default function StarGuiding() {
  const {
    isRunning,
    setIsRunning,
    measurePeriodical,
    setMeasurePeriodical,
    customOptions,
    setCustomOptions,
    measurements,
    highFrequency,
    starPosition,
  } = useGuidingConfigStore();

  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);

  const handleCustomOptionChange = (
    option: keyof CustomOptions,
    value: number
  ) => {
    setCustomOptions({ [option]: value });
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        setIsRunning(false);
      }, customOptions.autoStopDuration);
      return () => clearTimeout(timer);
    }
  }, [isRunning, customOptions.autoStopDuration, setIsRunning]);

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
                <DialogTitle className="text-lg">自定义选项</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="snrThreshold" className="text-right text-xs">
                    SNR 阈值
                  </Label>
                  <Input
                    id="snrThreshold"
                    type="number"
                    value={customOptions.snrThreshold}
                    onChange={(e) =>
                      handleCustomOptionChange(
                        "snrThreshold",
                        Number(e.target.value)
                      )
                    }
                    className="col-span-3 h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label
                    htmlFor="measurementInterval"
                    className="text-right text-xs"
                  >
                    测量间隔 (ms)
                  </Label>
                  <Input
                    id="measurementInterval"
                    type="number"
                    value={customOptions.measurementInterval}
                    onChange={(e) =>
                      handleCustomOptionChange(
                        "measurementInterval",
                        Number(e.target.value)
                      )
                    }
                    className="col-span-3 h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label
                    htmlFor="autoStopDuration"
                    className="text-right text-xs"
                  >
                    自动停止时间 (ms)
                  </Label>
                  <Input
                    id="autoStopDuration"
                    type="number"
                    value={customOptions.autoStopDuration}
                    onChange={(e) =>
                      handleCustomOptionChange(
                        "autoStopDuration",
                        Number(e.target.value)
                      )
                    }
                    className="col-span-3 h-8 text-xs"
                  />
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
              选择一个良好的非饱和的星点(SNR{">"}
              {customOptions.snrThreshold})并开始导星。
            </p>

            <div
              className={`grid ${
                isLandscape && isMobile
                  ? "grid-cols-1 gap-2"
                  : "grid-cols-1 md:grid-cols-2 gap-3"
              }`}
            >
              {/* Measurement State Table */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-sm font-semibold mb-1">测量状态</h3>
                <Table className="text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">开始时间</TableCell>
                      <TableCell>{measurements.startTime}</TableCell>
                      <TableCell className="font-medium">曝光时间</TableCell>
                      <TableCell>{measurements.exposureTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">SNR</TableCell>
                      <TableCell>{measurements.snr.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">星点质心</TableCell>
                      <TableCell>{measurements.starCenter}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">已用时间</TableCell>
                      <TableCell>{measurements.elapsedTime}</TableCell>
                      <TableCell className="font-medium">样本数量</TableCell>
                      <TableCell>{measurements.sampleCount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </motion.div>

              {/* High Frequency Measurements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold mb-1">高频星点侧测</h3>
                <Table className="text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">赤经，RMS</TableCell>
                      <TableCell>{highFrequency.redRMS.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">赤纬，RMS</TableCell>
                      <TableCell>{highFrequency.greenRMS.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">累计，RMS</TableCell>
                      <TableCell>{highFrequency.blueRMS.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </motion.div>

              {/* Star Position Data */}
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
                <h3 className="text-sm font-semibold mb-1">其他的星点位移</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤经，峰值
                        </TableCell>
                        <TableCell>{starPosition.redPeak.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤经，峰峰值
                        </TableCell>
                        <TableCell>
                          {starPosition.bluePeak.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤经最大漂移率
                        </TableCell>
                        <TableCell>
                          {starPosition.maxDriftRate.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤纬漂移速率
                        </TableCell>
                        <TableCell>
                          {starPosition.driftSpeed.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">极轴误差</TableCell>
                        <TableCell>
                          {starPosition.polarAxisError.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤纬，峰值
                        </TableCell>
                        <TableCell>
                          {starPosition.greenPeak.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          赤经漂移率
                        </TableCell>
                        <TableCell>
                          {starPosition.driftRate.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          无导星极限曝光时间
                        </TableCell>
                        <TableCell>
                          {starPosition.noStarExposureTime.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">赤纬回差</TableCell>
                        <TableCell>
                          {starPosition.periodicalError.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <Checkbox
                  id="measure"
                  checked={measurePeriodical}
                  onCheckedChange={(checked) =>
                    setMeasurePeriodical(checked as boolean)
                  }
                />
                <label
                  htmlFor="measure"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  测量亮纬回差
                </label>
              </div>

              <Button onClick={handleStart} disabled={isRunning} size="sm">
                开始
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    查看之前的
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>历史记录 1</DropdownMenuItem>
                  <DropdownMenuItem>历史记录 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={handleStop} disabled={!isRunning} size="sm">
                停止
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
