import { Button } from "@/components/ui/button"

interface Template {
  name: string
  backgroundColor: string
  backgroundImage: string
  gradient: {
    color1: string
    color2: string
    type: string
    angle: number
  }
  blendMode: string
  backgroundPattern: string
  filters: {
    blur: number
    brightness: number
    contrast: number
    grayscale: number
    hueRotate: number
    saturate: number
  }
  animation: {
    type: string
    duration: number
    direction: string
  }
  imageSize: string
  imagePosition: string
  imageRotation: number
  imageOpacity: number
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const templates: Template[] = [
    {
      name: "渐变天空",
      backgroundColor: "#87CEEB",
      backgroundImage: "",
      gradient: {
        color1: "#87CEEB",
        color2: "#E0F6FF",
        type: "linear",
        angle: 180
      },
      blendMode: "normal",
      backgroundPattern: "no-repeat",
      filters: {
        blur: 0,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        hueRotate: 0,
        saturate: 100
      },
      animation: {
        type: "none",
        duration: 5,
        direction: "normal"
      },
      imageSize: "cover",
      imagePosition: "center center",
      imageRotation: 0,
      imageOpacity: 1
    },
    {
      name: "动感波纹",
      backgroundColor: "#4A90E2",
      backgroundImage: "",
      gradient: {
        color1: "#4A90E2",
        color2: "#1E3A8A",
        type: "radial",
        angle: 0
      },
      blendMode: "overlay",
      backgroundPattern: "repeat",
      filters: {
        blur: 2,
        brightness: 110,
        contrast: 110,
        grayscale: 0,
        hueRotate: 0,
        saturate: 100
      },
      animation: {
        type: "pulse",
        duration: 3,
        direction: "alternate"
      },
      imageSize: "cover",
      imagePosition: "center center",
      imageRotation: 0,
      imageOpacity: 1
    },
    {
      name: "霓虹灯光",
      backgroundColor: "#000000",
      backgroundImage: "",
      gradient: {
        color1: "#FF00FF",
        color2: "#00FFFF",
        type: "linear",
        angle: 45
      },
      blendMode: "screen",
      backgroundPattern: "no-repeat",
      filters: {
        blur: 5,
        brightness: 120,
        contrast: 120,
        grayscale: 0,
        hueRotate: 0,
        saturate: 100
      },
      animation: {
        type: "fade",
        duration: 4,
        direction: "alternate"
      },
      imageSize: "cover",
      imagePosition: "center center",
      imageRotation: 0,
      imageOpacity: 1
    }
  ]

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">预设模板</h3>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <Button
            key={template.name}
            variant="outline"
            onClick={() => onSelect(template)}
          >
            {template.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

