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
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
  // ...可以添加更多预设
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
    props.open_dialog && setOpen(false);
  };

  const [open, setOpen] = useState(false);
  // 已移除未使用的变量: equipment, selectedEquipment

  useEffect(() => {
    reset({
      ...props.fov_data,
      rotation: props.rotation,
    });
  }, [props.fov_data, props.rotation, reset]);

  useEffect(() => {
    if (props.open_dialog > 0) {
      setOpen(true);
    }
  }, [props.open_dialog]);

  const applyPreset = (preset: FOVPreset) => {
    reset({
      x_pixels: preset.x_pixels,
      y_pixels: preset.y_pixels,
      x_pixel_size: preset.x_pixel_size,
      y_pixel_size: preset.y_pixel_size,
      focal_length: preset.focal_length,
      rotation: props.rotation,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              视场计算器
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：输入区域 */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-2 flex-wrap">
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
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机x方向的像素数量
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机x方向的像素大小
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机y方向的像素数量
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">
                    相机y方向的像素大小
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Label className="block text-sm sm:w-1/3">相机旋转角度</Label>
                  <Controller
                    control={control}
                    name="rotation"
                    render={({ field }) => (
                      <Slider
                        min={0}
                        max={360}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value: number[]) =>
                          field.onChange(value[0])
                        }
                        onValueCommit={() => {}}
                        className="flex-1"
                      />
                    )}
                  />
                  <span>{getValues("rotation")}°</span>
                </div>
                {errors.rotation && (
                  <p className="text-red-500 text-sm">
                    {errors.rotation.message}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="w-full">
                  保存修改
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => reset()}
                >
                  重置
                </Button>
              </div>
            </form>

            {/* 右侧：预览区域 */}
            <motion.div
              className="bg-muted rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-semibold mb-4">预览</h3>

              <div className="space-y-4">
                <div className="aspect-video relative border rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-2 border-2 border-primary"
                    style={{
                      transform: `rotate(${getValues("rotation")}deg)`,
                      transformOrigin: "center",
                    }}
                  />
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
                    {Array(144)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="border border-gray-500" />
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      视场宽度:{" "}
                      {(
                        (getValues("x_pixels") *
                          getValues("x_pixel_size") *
                          206.265) /
                        getValues("focal_length")
                      ).toFixed(2)}
                      ′
                    </p>
                    <p>
                      视场高度:{" "}
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
                    <p>
                      分辨率:{" "}
                      {(
                        (206.265 * getValues("x_pixel_size")) /
                        getValues("focal_length")
                      ).toFixed(2)}
                      ″/px
                    </p>
                    <p>
                      采样率:{" "}
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
        </motion.div>
      </DialogContent>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={() => setOpen(false)}>
          取消
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FOVSettingDialog;
