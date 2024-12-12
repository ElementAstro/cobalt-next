import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BlendModePickerProps {
  blendMode: string
  onChange: (blendMode: string) => void
}

export function BlendModePicker({ blendMode, onChange }: BlendModePickerProps) {
  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
  ]

  return (
    <div>
      <Label htmlFor="blend-mode">混合模式</Label>
      <Select value={blendMode} onValueChange={onChange}>
        <SelectTrigger id="blend-mode">
          <SelectValue placeholder="选择混合模式" />
        </SelectTrigger>
        <SelectContent>
          {blendModes.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {mode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

