import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FilterAdjusterProps {
  filters: {
    blur: number
    brightness: number
    contrast: number
    grayscale: number
    hueRotate: number
    saturate: number
  }
  onChange: (filters: FilterAdjusterProps['filters']) => void
}

export function FilterAdjuster({ filters, onChange }: FilterAdjusterProps) {
  const handleChange = (key: keyof FilterAdjusterProps['filters'], value: number) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="blur">模糊: {filters.blur}px</Label>
        <Slider
          id="blur"
          min={0}
          max={20}
          step={1}
          value={[filters.blur]}
          onValueChange={(value) => handleChange('blur', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="brightness">亮度: {filters.brightness}%</Label>
        <Slider
          id="brightness"
          min={0}
          max={200}
          step={1}
          value={[filters.brightness]}
          onValueChange={(value) => handleChange('brightness', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="contrast">对比度: {filters.contrast}%</Label>
        <Slider
          id="contrast"
          min={0}
          max={200}
          step={1}
          value={[filters.contrast]}
          onValueChange={(value) => handleChange('contrast', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="grayscale">灰度: {filters.grayscale}%</Label>
        <Slider
          id="grayscale"
          min={0}
          max={100}
          step={1}
          value={[filters.grayscale]}
          onValueChange={(value) => handleChange('grayscale', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="hueRotate">色相旋转: {filters.hueRotate}°</Label>
        <Slider
          id="hueRotate"
          min={0}
          max={360}
          step={1}
          value={[filters.hueRotate]}
          onValueChange={(value) => handleChange('hueRotate', value[0])}
        />
      </div>
      <div>
        <Label htmlFor="saturate">饱和度: {filters.saturate}%</Label>
        <Slider
          id="saturate"
          min={0}
          max={200}
          step={1}
          value={[filters.saturate]}
          onValueChange={(value) => handleChange('saturate', value[0])}
        />
      </div>
    </div>
  )
}

