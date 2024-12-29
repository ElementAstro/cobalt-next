"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";

interface DataPoint {
  x: number;
  RA: number;
  DEC: number;
  trend?: number;
  amplitude?: number;
}

const HistoryGraph: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState("×100");
  const [yAxis, setYAxis] = useState("-/+4°");
  const [period, setPeriod] = useState(70);
  const [interval, setInterval] = useState(10);
  const [sensitivity, setSensitivity] = useState(0.37);
  const [algorithm, setAlgorithm] = useState("Agp");
  const [algorithmPeriod, setAlgorithmPeriod] = useState(100);
  const [algorithmValue, setAlgorithmValue] = useState(0.27);
  const [filterMethod, setFilterMethod] = useState("无效波段");
  const [filterStart, setFilterStart] = useState(2500);
  const [filterEnd, setFilterEnd] = useState(2500);
  const [raColor, setRaColor] = useState("#ff4444");
  const [decColor, setDecColor] = useState("#4444ff");
  const [showRaAsymptote, setShowRaAsymptote] = useState(false);
  const [showDecAsymptote, setShowDecAsymptote] = useState(false);
  const [xAxisType, setXAxisType] = useState("number");
  const [yAxisType, setYAxisType] = useState("number");
  const [xAxisDomain, setXAxisDomain] = useState<[number, number]>([0, 100]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([-4, 4]);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(1000);
  const [lineType, setLineType] = useState("monotone");
  const [dotSize, setDotSize] = useState(0);

  const generateData = useCallback((): DataPoint[] => {
    return Array.from({ length: 100 }, (_, i) => ({
      x: i,
      RA: Math.sin(i * 0.1) * 2 + Math.random() * 0.5,
      DEC: Math.cos(i * 0.1) * 2 + Math.random() * 0.5,
      trend: (Math.sin(i * 0.1) * 2 + Math.cos(i * 0.1) * 2) / 2,
      amplitude: Math.abs(Math.sin(i * 0.1) * 2 - Math.cos(i * 0.1) * 2),
    }));
  }, []);

  const data = useMemo(() => generateData(), [generateData]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const Chart = React.memo(() => {
    const chartMargins = useMemo(() => {
      // 根据容器尺寸自适应边距
      return {
        top: 5,
        right: 10, // 增加右边距以显示Y轴标签
        left: 5,  // 增加左边距以显示Y轴标签
        bottom: 0 // 增加底部边距以显示X轴标签
      };
    }, []);

    return (
      <ResponsiveContainer width="100%" height="100%" minHeight={150}>
        <LineChart
          data={data}
          margin={chartMargins}
          onMouseDown={(e) => {
            if (e && typeof e.chartX === "number") {
              const { chartX } = e;
              setXAxisDomain([chartX, chartX + 100]);
            }
          }}
          onMouseMove={(e: any) => {
            if (e && e.isTooltipActive && typeof e.chartX === "number") {
              const { chartX } = e;
              setXAxisDomain([chartX - 50, chartX + 50]);
            }
          }}
          onMouseUp={() => {
            setXAxisDomain([0, 100]); // Reset to default domain
          }}
        >
          {gridEnabled && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#333"
              horizontalPoints={[0, 25, 50, 75, 100]} // 减少网格线数量
              verticalPoints={[-4, -2, 0, 2, 4]} // 减少网格线数量
            />
          )}
          <XAxis
            dataKey="x"
            type={xAxisType as any}
            domain={xAxisDomain as any}
            stroke="#666"
            allowDataOverflow={true}
            allowDuplicatedCategory={false}
            tickFormatter={(value) => value.toString()} // 简化标签
            interval="preserveStartEnd" // 只显示首尾刻度
            height={20} // 固定高度
            tick={{fontSize: 10}} // 减小字体
          />
          <YAxis
            type={yAxisType as any}
            domain={yAxisDomain as any}
            stroke="#666"
            allowDataOverflow={true}
            tickFormatter={(value) => value.toFixed(1)} // 简化标签
            interval="preserveStartEnd" // 只显示首尾刻度
            width={30} // 固定宽度
            tick={{fontSize: 10}} // 减小字体
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #333",
              fontSize: "12px", // 减小字体
              padding: "4px" // 减小内边距
            }}
            labelStyle={{fontSize: "10px"}} // 减小标签字体
            itemStyle={{fontSize: "10px"}} // 减小项目字体
            wrapperStyle={{zIndex: 1000}} // 确保提示框显示在最上层
          />
          <Line
            type={lineType as any}
            dataKey="RA"
            stroke={raColor}
            dot={{ r: Math.max(0, dotSize - 1) }} // 减小点的大小
            strokeWidth={1}
            animationDuration={animationDuration}
            isAnimationActive={false}
          />
          <Line
            type={lineType as any}
            dataKey="DEC"
            stroke={decColor}
            dot={{ r: Math.max(0, dotSize - 1) }} // 减小点的大小
            strokeWidth={1}
            animationDuration={animationDuration}
            isAnimationActive={false}
          />
          <Line
            type={lineType as any}
            dataKey="trend"
            stroke="#44ff44"
            dot={{ r: Math.max(0, dotSize - 1) }} // 减小点的大小
            strokeWidth={1}
            strokeDasharray="5 5"
            animationDuration={animationDuration}
            isAnimationActive={false}
          />
          <ReferenceLine y={2} stroke="#666" strokeDasharray="3 3" />
          <ReferenceLine y={-2} stroke="#666" strokeDasharray="3 3" />
          {showRaAsymptote && (
            <ReferenceLine
              x={50}
              stroke={raColor}
              strokeDasharray="3 3"
              label={{
                value: "RA",  // 简化标签文本
                position: "insideTopRight",
                fontSize: 10 // 减小字体
              }}
            />
          )}
          {showDecAsymptote && (
            <ReferenceLine
              y={0}
              stroke={decColor}
              strokeDasharray="3 3"
              label={{
                value: "DEC", // 简化标签文本
                position: "insideTopRight",
                fontSize: 10 // 减小字体
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  });

  return (
    <motion.div
      className="w-full text-white p-2"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-start gap-2">
        {/* Chart Section */}
        <div className="flex-grow h-full">
            <Chart />
        </div>

        {/* Stats and Controls Panel */}
        <Card className=" border-gray-800 p-2 flex-shrink-0 ">
          <div className="text-xs text-gray-400 space-y-1 mb-2">
            <p className="font-medium text-gray-300">RMS 指标 (ppb):</p>
            <p>RA: 0.27 (0.35°)</p>
            <p>DEC: 0.31 (0.41°)</p>
            <p>Total: 0.41 (0.54°)</p>
            <p>RA Osc: 0.48</p>
          </div>
          <div className="flex flex-wrap gap-1 text-xs">
            <Input
              value={zoomLevel}
              onChange={(e) => setZoomLevel(e.target.value)}
              className="w-16 h-6 bg-transparent"
            />
            <Input
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-16 h-6 bg-transparent"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 px-2">
                  <Settings2 className="w-3 h-3 mr-1" />
                  设置
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white max-w-3xl">
                <DialogHeader>
                  <DialogTitle>图表设置</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">常规</TabsTrigger>
                    <TabsTrigger value="axis">坐标轴</TabsTrigger>
                    <TabsTrigger value="style">样式</TabsTrigger>
                    <TabsTrigger value="animation">动画</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">精度</label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={period}
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            className="h-6 bg-transparent w-12"
                          />
                          <span className="text-xs">点</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">间隔</label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={interval}
                            onChange={(e) =>
                              setInterval(Number(e.target.value))
                            }
                            className="h-6 bg-transparent w-12"
                          />
                          <span className="text-xs">秒</span>
                        </div>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">灵敏度</label>
                        <Slider
                          value={[sensitivity]}
                          onValueChange={([value]) => setSensitivity(value)}
                          min={0}
                          max={1}
                          step={0.01}
                          className="py-0.5"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">
                          算法设置
                        </label>
                        <div className="flex items-center gap-1">
                          <Select
                            value={algorithm}
                            onValueChange={setAlgorithm}
                          >
                            <SelectTrigger className="h-6 bg-transparent">
                              <SelectValue placeholder="选择算法" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Agp">Agp</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={algorithmPeriod}
                            onChange={(e) =>
                              setAlgorithmPeriod(Number(e.target.value))
                            }
                            className="h-6 bg-transparent w-12"
                          />
                          <Input
                            value={algorithmValue}
                            onChange={(e) =>
                              setAlgorithmValue(Number(e.target.value))
                            }
                            className="h-6 bg-transparent w-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">
                          净增数设置
                        </label>
                        <div className="flex items-center gap-1">
                          <Select
                            value={filterMethod}
                            onValueChange={setFilterMethod}
                          >
                            <SelectTrigger className="h-6 bg-transparent">
                              <SelectValue placeholder="选择方法" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="无效波段">无效波段</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={filterStart}
                            onChange={(e) =>
                              setFilterStart(Number(e.target.value))
                            }
                            className="h-6 bg-transparent w-12"
                          />
                          <Input
                            value={filterEnd}
                            onChange={(e) =>
                              setFilterEnd(Number(e.target.value))
                            }
                            className="h-6 bg-transparent w-12"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="axis">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">X轴类型</label>
                        <Select value={xAxisType} onValueChange={setXAxisType}>
                          <SelectTrigger className="h-6 bg-transparent">
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">数字</SelectItem>
                            <SelectItem value="category">类别</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Y轴类型</label>
                        <Select value={yAxisType} onValueChange={setYAxisType}>
                          <SelectTrigger className="h-6 bg-transparent">
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">数字</SelectItem>
                            <SelectItem value="category">类别</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">X轴范围</label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={xAxisDomain[0]}
                            onChange={(e) =>
                              setXAxisDomain([
                                Number(e.target.value),
                                xAxisDomain[1],
                              ])
                            }
                            className="h-6 bg-transparent w-12"
                          />
                          <span className="text-xs">至</span>
                          <Input
                            value={xAxisDomain[1]}
                            onChange={(e) =>
                              setXAxisDomain([
                                xAxisDomain[0],
                                Number(e.target.value),
                              ])
                            }
                            className="h-6 bg-transparent w-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">Y轴范围</label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={yAxisDomain[0]}
                            onChange={(e) =>
                              setYAxisDomain([
                                Number(e.target.value),
                                yAxisDomain[1],
                              ])
                            }
                            className="h-6 bg-transparent w-12"
                          />
                          <span className="text-xs">至</span>
                          <Input
                            value={yAxisDomain[1]}
                            onChange={(e) =>
                              setYAxisDomain([
                                yAxisDomain[0],
                                Number(e.target.value),
                              ])
                            }
                            className="h-6 bg-transparent w-12"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="style">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">
                          颜色设置
                        </label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="color"
                            value={raColor}
                            onChange={(e) => setRaColor(e.target.value)}
                            className="h-6 w-12 bg-transparent"
                          />
                          <span className="text-xs">RA</span>
                          <Input
                            type="color"
                            value={decColor}
                            onChange={(e) => setDecColor(e.target.value)}
                            className="h-6 w-12 bg-transparent"
                          />
                          <span className="text-xs">DEC</span>
                        </div>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-400">网格</label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="grid-enabled"
                            checked={gridEnabled}
                            onCheckedChange={setGridEnabled}
                          />
                          <Label htmlFor="grid-enabled">启用网格</Label>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">
                          线条类型
                        </label>
                        <Select value={lineType} onValueChange={setLineType}>
                          <SelectTrigger className="h-6 bg-transparent">
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">直线</SelectItem>
                            <SelectItem value="monotone">平滑曲线</SelectItem>
                            <SelectItem value="step">阶梯线</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">
                          数据点大小
                        </label>
                        <Input
                          type="number"
                          value={dotSize}
                          onChange={(e) => setDotSize(Number(e.target.value))}
                          className="h-6 bg-transparent w-full"
                          min="0"
                          max="10"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="animation">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">
                          动画持续时间 (毫秒)
                        </label>
                        <Input
                          type="number"
                          value={animationDuration}
                          onChange={(e) =>
                            setAnimationDuration(Number(e.target.value))
                          }
                          className="h-6 bg-transparent w-full"
                          min="0"
                          max="5000"
                          step="100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">渐近线</label>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="ra-asymptote"
                              checked={showRaAsymptote}
                              onCheckedChange={setShowRaAsymptote}
                            />
                            <Label htmlFor="ra-asymptote">RA</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="dec-asymptote"
                              checked={showDecAsymptote}
                              onCheckedChange={setShowDecAsymptote}
                            />
                            <Label htmlFor="dec-asymptote">DEC</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button variant="default" size="sm" className="w-full mt-2">
                  应用设置
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default HistoryGraph;
