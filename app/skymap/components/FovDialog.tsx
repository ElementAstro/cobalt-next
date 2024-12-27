"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Calculator, Download, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface FovDataType {
  x_pixels: number;
  x_pixel_size: number;
  y_pixels: number;
  y_pixel_size: number;
  focal_length: number;
}

interface FOVDialogProps {
  fov_data: FovDataType;
  rotation: number;
  open_dialog: boolean;
  on_fov_change: (fov_data: FovDataType) => void;
  on_rotation_change: (rotation: number) => void;
}

interface FOVPreset {
  name: string;
  x_pixels: number;
  y_pixels: number;
  x_pixel_size: number;
  y_pixel_size: number;
  focal_length: number;
}

const commonPresets: FOVPreset[] = [
  {
    name: "ASI294MM Pro",
    x_pixels: 4144,
    y_pixels: 2822,
    x_pixel_size: 4.63,
    y_pixel_size: 4.63,
    focal_length: 2600,
  },
  {
    name: "Canon EOS R5",
    x_pixels: 8192,
    y_pixels: 5464,
    x_pixel_size: 3.76,
    y_pixel_size: 3.76,
    focal_length: 850,
  },
  // 更多预设...
];

const additionalPresets: FOVPreset[] = [
  {
    name: "ZWO ASI2600MM Pro",
    x_pixels: 6248,
    y_pixels: 4176,
    x_pixel_size: 3.76,
    y_pixel_size: 3.76,
    focal_length: 1000,
  },
  // ...更多预设
];

const schema = yup.object().shape({
  x_pixels: yup
    .number()
    .required("必填")
    .positive("必须为正数")
    .integer("必须为整数"),
  x_pixel_size: yup.number().required("必填").positive("必须为正数"),
  y_pixels: yup
    .number()
    .required("必填")
    .positive("必须为正数")
    .integer("必须为整数"),
  y_pixel_size: yup.number().required("必填").positive("必须为正数"),
  focal_length: yup.number().required("必填").positive("必须为正数"),
  rotation: yup.number().min(0, "最小为0°").max(360, "最大为360°").required("必填"),
});

const FOVSettingDialog: React.FC<FOVDialogProps> = ({
  fov_data,
  rotation,
  open_dialog,
  on_fov_change,
  on_rotation_change,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FovDataType & { rotation: number }>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...fov_data,
      rotation,
    },
  });

  const [open, setOpen] = useState<boolean>(false);
  const [aperture, setAperture] = useState<number>(0);
  const [fRatio, setFRatio] = useState<number>(0);

  useEffect(() => {
    setOpen(open_dialog);
  }, [open_dialog]);

  useEffect(() => {
    reset({
      ...fov_data,
      rotation,
    });
  }, [fov_data, rotation, reset]);

  const applyPreset = useCallback(
    (preset: FOVPreset) => {
      reset({
        x_pixels: preset.x_pixels,
        y_pixels: preset.y_pixels,
        x_pixel_size: preset.x_pixel_size,
        y_pixel_size: preset.y_pixel_size,
        focal_length: preset.focal_length,
        rotation,
      });
      toast({
        title: "预设应用",
        description: `${preset.name} 已应用。`,
      });
    },
    [reset, rotation]
  );

  const exportData = useCallback(() => {
    const data = { ...getValues() };
    const csvContent = `data:text/csv;charset=utf-8,${Object.keys(data).join(
      ","
    )}\n${Object.values(data).join(",")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fov_settings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getValues]);

  const calculateFocalLength = useCallback(
    (aperture: number, fRatio: number) => {
      return aperture * fRatio;
    },
    []
  );

  const onSubmit = useCallback(
    (data: FovDataType & { rotation: number }) => {
      on_fov_change({
        x_pixels: data.x_pixels,
        x_pixel_size: data.x_pixel_size,
        y_pixels: data.y_pixels,
        y_pixel_size: data.y_pixel_size,
        focal_length: data.focal_length,
      });
      on_rotation_change(data.rotation);
      toast({
        title: "保存成功",
        description: "视场设置已更新。",
      });
      setOpen(false);
    },
    [on_fov_change, on_rotation_change]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className="max-w-2xl landscape:max-h-[90vh] landscape:overflow-auto p-4 bg-gray-800 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 landscape:space-y-2"
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-yellow-400" />
                视场设置
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>设置相机的视场参数，包括像素数、像素大小和焦距。</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col landscape:flex-row landscape:space-x-4">
              {/* 左侧：设置表单 */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 space-y-4 landscape:space-y-2"
              >
                <div className="flex flex-wrap gap-2">
                  {commonPresets.concat(additionalPresets).map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-sm"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  {/* X Pixels */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <Label className="sm:w-1/3 text-sm">X像素数</Label>
                    <Input
                      type="number"
                      {...register("x_pixels")}
                      className="flex-1 text-black"
                      placeholder="例如: 4144"
                    />
                    <span className="text-sm">个</span>
                  </div>
                  {errors.x_pixels && (
                    <p className="text-red-400 text-xs">{errors.x_pixels.message}</p>
                  )}

                  {/* X Pixel Size */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <Label className="sm:w-1/3 text-sm">X像素大小</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("x_pixel_size")}
                      className="flex-1 text-black"
                      placeholder="例如: 4.63"
                    />
                    <span className="text-sm">µm</span>
                  </div>
                  {errors.x_pixel_size && (
                    <p className="text-red-400 text-xs">{errors.x_pixel_size.message}</p>
                  )}

                  {/* Y Pixels */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <Label className="sm:w-1/3 text-sm">Y像素数</Label>
                    <Input
                      type="number"
                      {...register("y_pixels")}
                      className="flex-1 text-black"
                      placeholder="例如: 2822"
                    />
                    <span className="text-sm">个</span>
                  </div>
                  {errors.y_pixels && (
                    <p className="text-red-400 text-xs">{errors.y_pixels.message}</p>
                  )}

                  {/* Y Pixel Size */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <Label className="sm:w-1/3 text-sm">Y像素大小</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("y_pixel_size")}
                      className="flex-1 text-black"
                      placeholder="例如: 4.63"
                    />
                    <span className="text-sm">µm</span>
                  </div>
                  {errors.y_pixel_size && (
                    <p className="text-red-400 text-xs">{errors.y_pixel_size.message}</p>
                  )}

                  {/* Focal Length */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <Label className="sm:w-1/3 text-sm">焦距</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register("focal_length")}
                      className="flex-1 text-black"
                      placeholder="例如: 2600"
                    />
                    <span className="text-sm">mm</span>
                  </div>
                  {errors.focal_length && (
                    <p className="text-red-400 text-xs">{errors.focal_length.message}</p>
                  )}

                  {/* Rotation */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <Label className="sm:w-1/3 text-sm">旋转角度</Label>
                    <Controller
                      control={control}
                      name="rotation"
                      render={({ field }) => (
                        <div className="flex-1">
                          <Slider
                            min={0}
                            max={360}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value: number[]) => field.onChange(value[0])}
                            className="mt-2"
                          />
                          <span className="text-xs">{field.value}°</span>
                        </div>
                      )}
                    />
                  </div>
                  {errors.rotation && (
                    <p className="text-red-400 text-xs">{errors.rotation.message}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="flex-1 flex items-center justify-center text-sm"
                  >
                    <Calculator className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                    className="flex-1 flex items-center justify-center text-sm"
                  >
                    重置
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={exportData}
                    className="flex-1 flex items-center justify-center text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    导出
                  </Button>
                </div>
              </form>

              {/* 右侧：预览区域 */}
              <motion.div
                className="flex-1 bg-gray-700 rounded-lg p-3 flex flex-col items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold mb-3 text-center text-sm">预览</h3>

                <div className="w-full">
                  <div className="relative aspect-video border border-gray-600 rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute inset-2 border-2 border-yellow-400 bg-yellow-400 opacity-50"
                      style={{
                        transform: `rotate(${getValues("rotation")}deg)`,
                        transformOrigin: "center",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border border-gray-500" />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="text-center">
                      <strong>视场宽度:</strong>{" "}
                      {(
                        (getValues("x_pixels") *
                          getValues("x_pixel_size") *
                          206.265) /
                        getValues("focal_length")
                      ).toFixed(2)}
                      ′
                    </div>
                    <div className="text-center">
                      <strong>视场高度:</strong>{" "}
                      {(
                        (getValues("y_pixels") *
                          getValues("y_pixel_size") *
                          206.265) /
                        getValues("focal_length")
                      ).toFixed(2)}
                      ′
                    </div>
                    <div className="text-center">
                      <strong>分辨率:</strong>{" "}
                      {(
                        (206.265 * getValues("x_pixel_size")) /
                        getValues("focal_length")
                      ).toFixed(2)}
                      ″/px
                    </div>
                    <div className="text-center">
                      <strong>采样率:</strong>{" "}
                      {(
                        (getValues("x_pixel_size") * 2) /
                        getValues("focal_length")
                      ).toFixed(2)}
                      ″/px
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 焦距计算器 */}
            <div className="mt-4 p-3 bg-gray-700 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold">焦距计算器</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="number"
                  placeholder="口径(mm)"
                  value={aperture}
                  onChange={(e) => setAperture(Number(e.target.value))}
                  className="text-black"
                />
                <Input
                  type="number"
                  placeholder="焦比"
                  value={fRatio}
                  onChange={(e) => setFRatio(Number(e.target.value))}
                  className="text-black"
                />
                <Button
                  onClick={() => {
                    const fl = calculateFocalLength(aperture, fRatio);
                    if (fl > 0) {
                      reset({ ...getValues(), focal_length: fl });
                      toast({
                        title: "计算完成",
                        description: `焦距为 ${fl.toFixed(2)} mm`,
                      });
                    } else {
                      toast({
                        title: "计算失败",
                        description: "请检查输入值是否正确。",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="flex items-center justify-center text-sm"
                >
                  计算
                </Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full text-sm">
            取消
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
};

// 使用 memo 包装组件以优化性能
export default memo(FOVSettingDialog);