"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  XCircle,
  Settings,
  Download,
  Upload,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useGuidingStore } from "@/store/useGuidingStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AdvancedOptions from "./AdvancedOptions";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DarkFieldLibrary() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isExtraAdvancedOpen, setIsExtraAdvancedOpen] = useState(false);
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const store = useGuidingStore();
  const {
    minExposure,
    maxExposure,
    framesPerExposure,
    libraryType,
    isoValue,
    binningMode,
    coolingEnabled,
    targetTemperature,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    progress,
    isMockMode,
    darkFrameCount,
    gainValue,
    offsetValue,
  } = store.darkField;

  const {
    setMinExposure,
    setMaxExposure,
    setFramesPerExposure,
    setLibraryType,
    setIsoValue,
    setBinningMode,
    setCoolingEnabled,
    setTargetTemperature,
    setIsMockMode,
    setDarkFrameCount,
    setGainValue,
    setOffsetValue,
    resetSettings,
    startCreation,
    cancelCreation,
  } = store.settings;

  const isLandscape = useMediaQuery({
    query: "(orientation: landscape) and (max-width: 1024px)",
  });

  const handleFramesChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setFramesPerExposure(numValue);
    }
  };

  const handleStart = () => {
    startCreation();
  };

  const exportConfig = () => {
    const config = {
      minExposure,
      maxExposure,
      framesPerExposure,
      libraryType,
      isoValue,
      binningMode,
      coolingEnabled,
      targetTemperature,
      gainValue,
      offsetValue,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dark-field-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setMinExposure(config.minExposure);
          setMaxExposure(config.maxExposure);
          setFramesPerExposure(config.framesPerExposure);
          setLibraryType(config.libraryType);
          setIsoValue(config.isoValue);
          setBinningMode(config.binningMode);
          setCoolingEnabled(config.coolingEnabled);
          setTargetTemperature(config.targetTemperature);
          setGainValue(config.gainValue);
          setOffsetValue(config.offsetValue);
        } catch (error) {
          console.error("Invalid config file");
        }
      };
      reader.readAsText(file);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <TooltipProvider>
      <div
        className={`min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 
        dark:from-gray-800 dark:to-gray-900 transition-colors duration-500
        ${isLandscape ? "flex items-center justify-center" : "py-4"}`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}
          className={`${
            isLandscape
              ? "w-full max-w-7xl px-4"
              : "w-full max-w-2xl mx-auto px-4"
          }`}
        >
          <Card
            className={`shadow-lg rounded-lg overflow-hidden
            ${isLandscape ? "grid grid-cols-2 gap-4" : ""}`}
          >
            {/* 将内容分为左右两栏在横屏模式下 */}
            <div className={isLandscape ? "p-4 overflow-auto" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-bold">创建暗场库</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={cancelCreation}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <motion.div
                variants={contentVariants}
                custom={0}
                className="space-y-4"
              >
                {isSuccess && (
                  <Alert className="bg-green-100 border-green-500 dark:bg-green-700 dark:border-green-600">
                    <AlertTitle>成功</AlertTitle>
                    <AlertDescription>暗场库创建成功！</AlertDescription>
                  </Alert>
                )}
                {isError && (
                  <Alert variant="destructive">
                    <AlertTitle>错误</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                {isLoading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-center">{`进度: ${progress.toFixed(
                      1
                    )}%`}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>最小曝光时间:</Label>
                    <Select
                      value={minExposure.toString()}
                      onValueChange={(value) => setMinExposure(Number(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0.5, 1.0, 1.5, 2.0].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value.toFixed(1)} 秒
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>最大曝光时间:</Label>
                    <Select
                      value={maxExposure.toString()}
                      onValueChange={(value) => setMaxExposure(Number(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3.0, 4.0, 5.0, 6.0].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value.toFixed(1)} 秒
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>每种曝光时间拍摄帧数:</Label>
                    <Input
                      type="number"
                      value={framesPerExposure}
                      onChange={(e) => handleFramesChange(e.target.value)}
                      className="w-full"
                      min={1}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>暗场总数:</Label>
                    <Input
                      type="number"
                      value={darkFrameCount}
                      onChange={(e) =>
                        setDarkFrameCount(parseInt(e.target.value))
                      }
                      className="w-full"
                      min={1}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>库类型:</Label>
                  <RadioGroup
                    value={libraryType}
                    onValueChange={setLibraryType}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="modify" id="modify" />
                      <Label htmlFor="modify">修改/扩充已存在的暗场库</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="create" id="create" />
                      <Label htmlFor="create">创建全新的暗场库</Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            </div>

            <div className={isLandscape ? "p-4 overflow-auto" : ""}>
              <motion.div
                variants={contentVariants}
                custom={1}
                className="space-y-4"
              >
                <Button
                  variant="outline"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="w-full flex justify-between"
                  disabled={isLoading}
                >
                  高级选项
                  {isAdvancedOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <AnimatePresence>
                  {isAdvancedOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 mt-4"
                    >
                      <AdvancedOptions
                        isoValue={isoValue}
                        setIsoValue={setIsoValue}
                        binningMode={binningMode.toString()}
                        setBinningMode={(value: string) =>
                          setBinningMode(Number(value))
                        }
                        coolingEnabled={coolingEnabled}
                        setCoolingEnabled={setCoolingEnabled}
                        targetTemperature={targetTemperature}
                        setTargetTemperature={setTargetTemperature}
                        gainValue={gainValue}
                        setGainValue={setGainValue}
                        offsetValue={offsetValue}
                        setOffsetValue={setOffsetValue}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 space-x-4 flex justify-center flex-wrap gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={exportConfig}
                        disabled={isLoading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        导出配置
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>导出当前配置到文件</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" disabled={isLoading}>
                        <Upload className="h-4 w-4 mr-2" />
                        导入配置
                        <input
                          type="file"
                          hidden
                          onChange={importConfig}
                          accept=".json"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>从文件导入配置</p>
                    </TooltipContent>
                  </Tooltip>

                  {isLoading && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setShowProgressDetails(true)}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          查看详情
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>查看创建进度详情</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={resetSettings}
                        disabled={isLoading}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        重置
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>重置所有设置为默认值</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleStart} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? "创建中..." : "开始"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>开始创建暗场库</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={cancelCreation}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        取消
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>取消并关闭窗口</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  设置你的参数，点击"开始"按钮。
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 添加进度详情对话框 */}
      <Dialog open={showProgressDetails} onOpenChange={setShowProgressDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建进度详情</DialogTitle>
            <DialogDescription>
              <div className="space-y-2 mt-4">
                <p>
                  已完成帧数: {Math.floor((progress * darkFrameCount) / 100)}/
                  {darkFrameCount}
                </p>
                <p>当前曝光时间: {minExposure}s</p>
                <p>
                  预计剩余时间:{" "}
                  {Math.ceil(
                    ((100 - progress) *
                      darkFrameCount *
                      parseFloat(minExposure.toString())) /
                      100
                  )}
                  s
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
