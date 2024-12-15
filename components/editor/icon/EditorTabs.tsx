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

type EditorTabsProps = {
  editState: any;
  updateEditState: (state: any) => void;
  applyPreset: (preset: string) => void;
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
      className={`${isLandscape ? "h-[calc(100%-4rem)]" : "mt-4"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Tabs defaultValue="transform" className="w-full">
        <TabsList className={`grid ${isLandscape ? "grid-cols-1" : "grid-cols-4"}`}>
          <TabsTrigger value="transform">变换</TabsTrigger>
          <TabsTrigger value="filters">滤镜</TabsTrigger>
          <TabsTrigger value="effects">效果</TabsTrigger>
          <TabsTrigger value="presets">预设</TabsTrigger>
        </TabsList>
        <TabsContent value="transform" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rotation-slider">旋转</Label>
            <Slider
              id="rotation-slider"
              min={0}
              max={360}
              step={1}
              value={[editState.rotation]}
              onValueChange={([value]) => updateEditState({ rotation: value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scale-slider">缩放</Label>
            <Slider
              id="scale-slider"
              min={0.5}
              max={2}
              step={0.1}
              value={[editState.scale]}
              onValueChange={([value]) => updateEditState({ scale: value })}
            />
          </div>
        </TabsContent>
        <TabsContent value="filters" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brightness-slider">亮度</Label>
            <Slider
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
            <Label htmlFor="contrast-slider">对比度</Label>
            <Slider
              id="contrast-slider"
              min={0}
              max={200}
              step={1}
              value={[editState.contrast]}
              onValueChange={([value]) => updateEditState({ contrast: value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hue-slider">色相旋转</Label>
            <Slider
              id="hue-slider"
              min={0}
              max={360}
              step={1}
              value={[editState.hue]}
              onValueChange={([value]) => updateEditState({ hue: value })}
            />
          </div>
        </TabsContent>
        <TabsContent value="effects" className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                高级效果
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blur-slider">模糊</Label>
                  <Slider
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
                  <Label htmlFor="border-width-slider">边框宽度</Label>
                  <Slider
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
                  <Label htmlFor="border-color">边框颜色</Label>
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
                  <Label htmlFor="overlay-color">覆盖颜色</Label>
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
        </TabsContent>
        <TabsContent value="presets" className="space-y-4">
          <Select onValueChange={(value: string) => applyPreset(value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择一个预设" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无</SelectItem>
              <SelectItem value="vintage">复古</SelectItem>
              <SelectItem value="cool">冷色</SelectItem>
              <SelectItem value="warm">暖色</SelectItem>
              <SelectItem value="sharp">锐化</SelectItem>
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
