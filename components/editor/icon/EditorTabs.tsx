import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type PresetType = "none" | "vintage" | "cool" | "warm" | "sharp";

type EditorTabsProps = {
  editState: any;
  updateEditState: (state: any) => void;
  applyPreset: (preset: PresetType) => void;
  handleExport: (size: number) => void;
  presets: any;
  isLandscape: boolean;
};

export default function EditorTabs({
  editState,
  updateEditState,
  applyPreset,
  handleExport,
  presets,
  isLandscape,
}: EditorTabsProps) {
  return (
    <motion.div
      className={`rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 ${
        isLandscape ? "h-[calc(100%-4rem)]" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <Tabs defaultValue="transform" className="w-full">
        <TabsList
          className={`grid w-full mb-4 ${
            isLandscape ? "grid-cols-2" : "grid-cols-4"
          } gap-2`}
        >
          <TabsTrigger value="transform">变换</TabsTrigger>
          <TabsTrigger value="filters">滤镜</TabsTrigger>
          <TabsTrigger value="effects">效果</TabsTrigger>
          <TabsTrigger value="presets">预设</TabsTrigger>
        </TabsList>
        <div className="space-y-6 p-2">
          <TabsContent value="transform">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="rotation-slider"
                >
                  旋转
                </Label>
                <Slider
                  className="my-4"
                  id="rotation-slider"
                  min={0}
                  max={360}
                  step={1}
                  value={[editState.rotation]}
                  onValueChange={([value]) =>
                    updateEditState({ rotation: value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="scale-slider">
                  缩放
                </Label>
                <Slider
                  className="my-4"
                  id="scale-slider"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[editState.scale]}
                  onValueChange={([value]) => updateEditState({ scale: value })}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="filters">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="brightness-slider"
                >
                  亮度
                </Label>
                <Slider
                  className="my-4"
                  id="brightness-slider"
                  min={0}
                  max={200}
                  step={1}
                  value={[editState.brightness]}
                  onValueChange={([value]) =>
                    updateEditState({ brightness: value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="contrast-slider"
                >
                  对比度
                </Label>
                <Slider
                  className="my-4"
                  id="contrast-slider"
                  min={0}
                  max={200}
                  step={1}
                  value={[editState.contrast]}
                  onValueChange={([value]) =>
                    updateEditState({ contrast: value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="hue-slider">
                  色相旋转
                </Label>
                <Slider
                  className="my-4"
                  id="hue-slider"
                  min={0}
                  max={360}
                  step={1}
                  value={[editState.hue]}
                  onValueChange={([value]) => updateEditState({ hue: value })}
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="saturation-slider"
                >
                  饱和度
                </Label>
                <Slider
                  className="my-4"
                  id="saturation-slider"
                  min={0}
                  max={200}
                  step={1}
                  value={[editState.saturation]}
                  onValueChange={([value]) =>
                    updateEditState({ saturation: value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium" htmlFor="invert-toggle">
                  反相效果
                </Label>
                <Switch
                  id="invert-toggle"
                  checked={editState.invert}
                  onCheckedChange={(checked) =>
                    updateEditState({ invert: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="effects">
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    高级效果
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium"
                        htmlFor="blur-slider"
                      >
                        模糊
                      </Label>
                      <Slider
                        className="my-4"
                        id="blur-slider"
                        min={0}
                        max={10}
                        step={0.1}
                        value={[editState.blur]}
                        onValueChange={([value]) =>
                          updateEditState({ blur: value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium"
                        htmlFor="border-width-slider"
                      >
                        边框宽度
                      </Label>
                      <Slider
                        className="my-4"
                        id="border-width-slider"
                        min={0}
                        max={10}
                        step={1}
                        value={[editState.borderWidth]}
                        onValueChange={([value]) =>
                          updateEditState({ borderWidth: value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium"
                        htmlFor="border-color"
                      >
                        边框颜色
                      </Label>
                      <Input
                        id="border-color"
                        type="color"
                        value={editState.borderColor}
                        onChange={(e) =>
                          updateEditState({ borderColor: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium"
                        htmlFor="overlay-color"
                      >
                        覆盖颜色
                      </Label>
                      <Input
                        id="overlay-color"
                        type="color"
                        value={editState.overlayColor.slice(0, 7)}
                        onChange={(e) =>
                          updateEditState({
                            overlayColor: e.target.value + "80",
                          })
                        }
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium"
                  htmlFor="border-radius-slider"
                >
                  圆角
                </Label>
                <Slider
                  className="my-4"
                  id="border-radius-slider"
                  min={0}
                  max={50}
                  step={1}
                  value={[editState.borderRadius]}
                  onValueChange={([value]) =>
                    updateEditState({ borderRadius: value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="shadow">
                  阴影
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Slider
                    className="my-4"
                    id="shadow-blur"
                    min={0}
                    max={20}
                    step={1}
                    value={[editState.shadowBlur]}
                    onValueChange={([value]) =>
                      updateEditState({ shadowBlur: value })
                    }
                  />
                  <Input
                    type="color"
                    value={editState.shadowColor}
                    onChange={(e) =>
                      updateEditState({ shadowColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="presets">
            <div className="space-y-4">
              <Select onValueChange={(value: PresetType) => applyPreset(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择一个预设" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  <SelectItem value="vintage">复古</SelectItem>
                  <SelectItem value="cool">冷色</SelectItem>
                  <SelectItem value="warm">暖色</SelectItem>
                  <SelectItem value="sharp">锐化</SelectItem>
                  <SelectItem value="dramatic">戏剧化</SelectItem>
                  <SelectItem value="neon">霓虹</SelectItem>
                  <SelectItem value="monochrome">黑白</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label className="text-sm font-medium">导出尺寸</Label>
                <Select
                  onValueChange={(value: string) => handleExport(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择导出尺寸" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16x16</SelectItem>
                    <SelectItem value="32">32x32</SelectItem>
                    <SelectItem value="64">64x64</SelectItem>
                    <SelectItem value="128">128x128</SelectItem>
                    <SelectItem value="256">256x256</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
