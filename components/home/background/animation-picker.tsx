import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Clock,
  Activity,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AnimationPickerProps {
  animation: {
    type: string;
    duration: number;
    direction: string;
    delay: number;
    repeat: number;
    ease: string;
  };
  onChange: (animation: AnimationPickerProps["animation"]) => void;
}

export function AnimationPicker({ animation, onChange }: AnimationPickerProps) {
  const handleChange = (
    key: keyof AnimationPickerProps["animation"],
    value: string | number
  ) => {
    onChange({ ...animation, [key]: value });
  };

  const animationTypes = [
    "none",
    "pulse",
    "bounce",
    "fade",
    "slide",
    "scale",
    "rotate",
    "flip",
    "shake",
    "swing",
  ];

  const directions = ["normal", "reverse", "alternate", "alternate-reverse"];
  const easings = [
    "linear",
    "easeIn",
    "easeOut",
    "easeInOut",
    "circIn",
    "circOut",
    "circInOut",
    "backIn",
    "backOut",
    "backInOut",
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full bg-slate-900 text-slate-100 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              动画设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div layout className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="animation-type" className="text-slate-200">
                  动画类型
                </Label>
                <Select
                  value={animation.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger
                    id="animation-type"
                    className="bg-slate-800 border-slate-700"
                  >
                    <SelectValue placeholder="选择动画类型" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {animationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {animation.type !== "none" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="animation-duration"
                      className="text-slate-200 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      持续时间: {animation.duration}s
                    </Label>
                    <Slider
                      id="animation-duration"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={[animation.duration]}
                      className="py-2"
                      onValueChange={(value) =>
                        handleChange("duration", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="animation-delay" className="text-slate-200">
                      延迟时间: {animation.delay}s
                    </Label>
                    <Slider
                      id="animation-delay"
                      min={0}
                      max={5}
                      step={0.1}
                      value={[animation.delay]}
                      className="py-2"
                      onValueChange={(value) => handleChange("delay", value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="animation-repeat"
                      className="text-slate-200 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重复次数:{" "}
                      {animation.repeat === -1 ? "无限" : animation.repeat}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="animation-repeat"
                        min={-1}
                        max={10}
                        step={1}
                        value={[animation.repeat]}
                        className="py-2"
                        onValueChange={(value) =>
                          handleChange("repeat", value[0])
                        }
                      />
                      <Switch
                        checked={animation.repeat === -1}
                        onCheckedChange={(checked) =>
                          handleChange("repeat", checked ? -1 : 1)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="animation-direction"
                      className="text-slate-200"
                    >
                      动画方向
                    </Label>
                    <Select
                      value={animation.direction}
                      onValueChange={(value) =>
                        handleChange("direction", value)
                      }
                    >
                      <SelectTrigger
                        id="animation-direction"
                        className="bg-slate-800 border-slate-700"
                      >
                        <SelectValue placeholder="选择动画方向" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {directions.map((direction) => (
                          <SelectItem key={direction} value={direction}>
                            {direction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="animation-ease" className="text-slate-200">
                      缓动函数
                    </Label>
                    <Select
                      value={animation.ease}
                      onValueChange={(value) => handleChange("ease", value)}
                    >
                      <SelectTrigger
                        id="animation-ease"
                        className="bg-slate-800 border-slate-700"
                      >
                        <SelectValue placeholder="选择缓动函数" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {easings.map((ease) => (
                          <SelectItem key={ease} value={ease}>
                            {ease}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {animation.type !== "none" && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-4 border-t border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">预览动画</Label>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: animation.duration,
                      delay: animation.delay,
                      repeat: animation.repeat,
                      ease: animation.ease as any,
                      direction: animation.direction as any,
                    }}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                  />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
