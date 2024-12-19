import React, { useState, useEffect } from "react";
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
import { Calculator, Download } from "lucide-react";
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
  open_dialog: number;
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

// 增加更多相机预设
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
  rotation: yup.number().min(0).max(360).required("必填"),
});

const FOVSettingDialog: React.FC<FOVDialogProps> = (props) => {
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
      ...props.fov_data,
      rotation: props.rotation,
    },
  });

  const onSubmit = (data: FovDataType & { rotation: number }) => {
    props.on_fov_change({
      x_pixels: data.x_pixels,
      x_pixel_size: data.x_pixel_size,
      y_pixels: data.y_pixels,
      y_pixel_size: data.y_pixel_size,
      focal_length: data.focal_length,
    });
    props.on_rotation_change(data.rotation);
    toast({
      title: "保存成功",
      description: "视场设置已更新。",
    });
    props.open_dialog && setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const [aperture, setAperture] = useState<number>(0);
  const [fRatio, setFRatio] = useState<number>(0);

  useEffect(() => {
    if (props.open_dialog > 0) {
      setOpen(true);
    }
  }, [props.open_dialog]);

  useEffect(() => {
    reset({
      ...props.fov_data,
      rotation: props.rotation,
    });
  }, [props.fov_data, props.rotation, reset]);

  const applyPreset = (preset: FOVPreset) => {
    reset({
      x_pixels: preset.x_pixels,
      y_pixels: preset.y_pixels,
      x_pixel_size: preset.x_pixel_size,
      y_pixel_size: preset.y_pixel_size,
      focal_length: preset.focal_length,
      rotation: props.rotation,
    });
    toast({
      title: "预设应用",
      description: `${preset.name} 已应用。`,
    });
  };

  const exportData = () => {
    const data = {
      ...getValues(),
    };
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
  };

  // 新增镜头预设计算
  const calculateFocalLength = (aperture: number, fRatio: number) => {
    return aperture * fRatio;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className="max-w-4xl landscape:max-h-[90vh] landscape:overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 landscape:space-y-3"
          >
            <DialogHeader className="landscape:py-2">
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                视场计算器
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 landscape:gap-3">
              {/* 左侧：输入区域 */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 landscape:space-y-2"
              >
                <div className="flex flex-wrap gap-2 landscape:gap-1">
                  {commonPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                  {additionalPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4 landscape:space-y-2">
                  {/* X Pixels */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Label className="block text-sm sm:w-1/3">
                      相机X方向的像素数量
                    </Label>
                    <Input
                      type="number"
                      {...register("x_pixels")}
                      className="flex-1"
                    />
                    <span>个</span>
                  </div>
                  {errors.x_pixels && (
                    <p className="text-red-500 text-sm">
                      {errors.x_pixels.message}
                    </p>
                  )}

                  {/* X Pixel Size */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Label className="block text-sm sm:w-1/3">
                      相机X方向的像素大小
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("x_pixel_size")}
                      className="flex-1"
                    />
                    <span>µm</span>
                  </div>
                  {errors.x_pixel_size && (
                    <p className="text-red-500 text-sm">
                      {errors.x_pixel_size.message}
                    </p>
                  )}

                  {/* Y Pixels */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Label className="block text-sm sm:w-1/3">
                      相机Y方向的像素数量
                    </Label>
                    <Input
                      type="number"
                      {...register("y_pixels")}
                      className="flex-1"
                    />
                    <span>个</span>
                  </div>
                  {errors.y_pixels && (
                    <p className="text-red-500 text-sm">
                      {errors.y_pixels.message}
                    </p>
                  )}

                  {/* Y Pixel Size */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Label className="block text-sm sm:w-1/3">
                      相机Y方向的像素大小
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("y_pixel_size")}
                      className="flex-1"
                    />
                    <span>µm</span>
                  </div>
                  {errors.y_pixel_size && (
                    <p className="text-red-500 text-sm">
                      {errors.y_pixel_size.message}
                    </p>
                  )}

                  {/* Focal Length */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Label className="block text-sm sm:w-1/3">望远镜焦距</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register("focal_length")}
                      className="flex-1"
                    />
                    <span>mm</span>
                  </div>
                  {errors.focal_length && (
                    <p className="text-red-500 text-sm">
                      {errors.focal_length.message}
                    </p>
                  )}

                  {/* Rotation */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Label className="block text-sm sm:w-1/3">
                      相机旋转角度
                    </Label>
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
                            onValueChange={(value: number[]) =>
                              field.onChange(value[0])
                            }
                            className="mt-2"
                          />
                          <span className="text-sm">{field.value}°</span>
                        </div>
                      )}
                    />
                  </div>
                  {errors.rotation && (
                    <p className="text-red-500 text-sm">
                      {errors.rotation.message}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    保存修改
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                    className="w-full flex items-center justify-center"
                  >
                    <span>重置</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={exportData}
                    className="w-full flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出数据
                  </Button>
                </div>
              </form>

              {/* 右侧：预览区域 */}
              <motion.div
                className="bg-muted rounded-lg p-4 landscape:p-2 flex flex-col items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold mb-4 text-center">预览</h3>

                <div className="space-y-4 landscape:space-y-2 w-full">
                  <div className="relative aspect-video border rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute inset-2 border-2 border-primary bg-primary opacity-50"
                      style={{
                        transform: `rotate(${getValues("rotation")}deg)`,
                        transformOrigin: "center",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
                      {Array(144)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="border border-gray-500" />
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-center">
                        <strong>视场宽度:</strong>{" "}
                        {(
                          (getValues("x_pixels") *
                            getValues("x_pixel_size") *
                            206.265) /
                          getValues("focal_length")
                        ).toFixed(2)}
                        ′
                      </p>
                      <p className="text-center">
                        <strong>视场高度:</strong>{" "}
                        {(
                          (getValues("y_pixels") *
                            getValues("y_pixel_size") *
                            206.265) /
                          getValues("focal_length")
                        ).toFixed(2)}
                        ′
                      </p>
                    </div>
                    <div>
                      <p className="text-center">
                        <strong>分辨率:</strong>{" "}
                        {(
                          (206.265 * getValues("x_pixel_size")) /
                          getValues("focal_length")
                        ).toFixed(2)}
                        ″/px
                      </p>
                      <p className="text-center">
                        <strong>采样率:</strong>{" "}
                        {(
                          (getValues("x_pixel_size") * 2) /
                          getValues("focal_length")
                        ).toFixed(2)}
                        ″/px
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 新增镜头计算器 */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">焦距计算器</h3>
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="口径(mm)"
                  onChange={(e) => setAperture(Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="焦比"
                  onChange={(e) => setFRatio(Number(e.target.value))}
                />
                <Button
                  onClick={() => {
                    const fl = calculateFocalLength(aperture, fRatio);
                    reset({ ...getValues(), focal_length: fl });
                  }}
                >
                  计算
                </Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
        <DialogFooter className="mt-6 landscape:mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
};

export default FOVSettingDialog;
