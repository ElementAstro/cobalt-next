import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Template {
  name: string;
  backgroundColor: string;
  backgroundImage: string;
  gradient: {
    color1: string;
    color2: string;
    type: string;
    angle: number;
  };
  blendMode: string;
  backgroundPattern: string;
  filters: {
    blur: number;
    brightness: number;
    contrast: number;
    grayscale: number;
    hueRotate: number;
    saturate: number;
  };
  animation: {
    type: string;
    duration: number;
    direction: string;
  };
  imageSize: string;
  imagePosition: string;
  imageRotation: number;
  imageOpacity: number;
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
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
        angle: 180,
      },
      blendMode: "normal",
      backgroundPattern: "no-repeat",
      filters: {
        blur: 0,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        hueRotate: 0,
        saturate: 100,
      },
      animation: {
        type: "none",
        duration: 5,
        direction: "normal",
      },
      imageSize: "cover",
      imagePosition: "center center",
      imageRotation: 0,
      imageOpacity: 1,
    },
    {
      name: "动感波纹",
      backgroundColor: "#4A90E2",
      backgroundImage: "",
      gradient: {
        color1: "#4A90E2",
        color2: "#1E3A8A",
        type: "radial",
        angle: 0,
      },
      blendMode: "overlay",
      backgroundPattern: "repeat",
      filters: {
        blur: 2,
        brightness: 110,
        contrast: 110,
        grayscale: 0,
        hueRotate: 0,
        saturate: 100,
      },
      animation: {
        type: "pulse",
        duration: 3,
        direction: "alternate",
      },
      imageSize: "cover",
      imagePosition: "center center",
      imageRotation: 0,
      imageOpacity: 1,
    },
    {
      name: "霓虹灯光",
      backgroundColor: "#000000",
      backgroundImage: "",
      gradient: {
        color1: "#FF00FF",
        color2: "#00FFFF",
        type: "linear",
        angle: 45,
      },
      blendMode: "screen",
      backgroundPattern: "no-repeat",
      filters: {
        blur: 5,
        brightness: 120,
        contrast: 120,
        grayscale: 0,
        hueRotate: 0,
        saturate: 100,
      },
      animation: {
        type: "fade",
        duration: 4,
        direction: "alternate",
      },
      imageSize: "cover",
      imagePosition: "center center",
      imageRotation: 0,
      imageOpacity: 1,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-gray-900/50 rounded-lg backdrop-blur-sm"
    >
      <h3 className="text-xl font-bold text-white">预设模板</h3>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {templates.map((template) => (
          <motion.div
            key={template.name}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 },
            }}
          >
            <Button
              variant="outline"
              className="w-full h-24 bg-gray-800/50 hover:bg-gray-700/50 border-gray-700"
              onClick={() => onSelect(template)}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `${
                    template.gradient.type === "linear" ||
                    template.gradient.type === "radial"
                      ? `${template.gradient.type}-gradient(${
                          template.gradient.type === "linear"
                            ? `${template.gradient.angle}deg`
                            : "circle"
                        }, ${template.gradient.color1}, ${
                          template.gradient.color2
                        })`
                      : "none"
                  }`,
                }}
              />
              <span className="relative text-white font-medium">
                {template.name}
              </span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
