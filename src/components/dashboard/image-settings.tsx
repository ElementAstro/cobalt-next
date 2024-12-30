"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import {
  Camera,
  Crosshair,
  ImageIcon,
  Settings,
  Smartphone,
  X,
  Save,
  Loader2,
  ImagePlus,
  Palette,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Span } from "@/components/custom/span";
import { useImageSettingsStore } from "@/store/useImageStore";

interface TagType {
  value: string;
}

interface Section {
  title: string;
  icon: IconName;
  tags: { value: string; description: string }[];
}
interface FilePatternConfig {
  sections: Section[];
}

interface DraggableTagProps {
  tag: TagType;
  onRemove: () => void;
}

const DraggableTag = ({ tag, onRemove }: DraggableTagProps) => (
  <motion.div
    className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm flex items-center space-x-2"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Span>{tag.value}</Span>
    <button
      onClick={onRemove}
      className="focus:outline-none hover:text-red-500 transition-colors"
      aria-label="Remove tag"
    >
      <X size={14} />
    </button>
  </motion.div>
);

type IconName = "Settings" | "Camera" | "Image" | "Crosshair";

const iconMap: Record<IconName, React.ComponentType> = {
  Settings,
  Camera,
  Image: ImageIcon,
  Crosshair,
};

interface Preset {
  name: string;
  settings: {
    compressionLevel: number;
    filePattern: string;
    tags: TagType[];
  };
}

export default function ImageSettingsPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const {
    filePath,
    filePattern,
    darkMode,
    autoSave,
    compressionLevel,
    tags,
    filePatternConfig,
    setFilePath,
    setFilePattern,
    setDarkMode,
    setAutoSave,
    setCompressionLevel,
    addTag,
    removeTag,
    reorderTags,
    setFilePatternConfig,
  } = useImageSettingsStore();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLandscape = useMediaQuery({
    query: "(orientation: landscape) and (max-width: 768px)",
  });

  React.useEffect(() => {
    if (isLandscape) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLandscape]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const loadFilePatternFromJSON = (json: string) => {
    try {
      const config = JSON.parse(json);
      setFilePatternConfig(config);
    } catch (error) {
      console.error("Invalid JSON for file pattern configuration", error);
    }
  };

  return (
    <div
      className={cn(
        "w-full mx-auto p-6 space-y-6 rounded-lg shadow transition-colors duration-300",
        "lg:max-w-4xl lg:grid lg:grid-cols-[1fr_300px] lg:gap-8",
        "md:max-w-3xl",
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      )}
    >
      {/* Image Preview Section */}
      <div className="lg:col-span-2">
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <Button
                onClick={() => {
                  // TODO: Implement image upload
                }}
                variant="ghost"
                size="lg"
                className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                <ImagePlus size={32} />
                <Span>上传预览图片</Span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLandscape && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <Smartphone className="w-12 h-12 mx-auto mb-2" />
            <Span>请旋转您的设备以获得最佳体验</Span>
          </div>
        </div>
      )}

      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <Span className="text-xl font-semibold">文件设置</Span>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    variant="ghost"
                    size="icon"
                  >
                    <Palette size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <Span>自定义颜色</Span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <Span>切换暗黑模式</Span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-2">
            <Label className="text-sm font-medium">保存图片为</Label>
            <Select defaultValue="FITS">
              <SelectTrigger>
                <SelectValue placeholder="选择格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FITS">FITS</SelectItem>
                <SelectItem value="RAW">RAW</SelectItem>
                <SelectItem value="TIFF">TIFF</SelectItem>
              </SelectContent>
            </Select>
            <Span className="text-sm text-muted-foreground">
              此设置在使用原生驱动时对DSLR相机无效。相机的RAW格式将被保存！
            </Span>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">图片文件路径</Label>
            <div className="flex gap-2">
              <Input
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">浏览</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">图片文件模式</Label>
            <Input
              value={filePattern}
              onChange={(e) => setFilePattern(e.target.value)}
            />
            <div className="mt-2">
              <Reorder.Group
                axis="x"
                values={tags}
                onReorder={reorderTags}
                className="flex flex-wrap gap-2"
              >
                {tags.map((tag, index) => (
                  <Reorder.Item key={tag.value} value={tag}>
                    <DraggableTag tag={tag} onRemove={() => removeTag(index)} />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
            <Label htmlFor="auto-save">自动保存设置</Label>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">压缩级别 (1-10)</Label>
            <Input
              type="range"
              min="1"
              max="10"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
            />
            <Span className="text-sm text-muted-foreground">
              当前级别: {compressionLevel}
            </Span>
          </div>
        </motion.div>

        {/* 设置预设 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">设置预设</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["默认", "高质量", "快速捕捉", "自定义"].map((preset) => (
              <Button
                key={preset}
                onClick={() => {
                  // TODO: Implement preset loading
                  setSelectedPreset(preset);
                }}
                variant={selectedPreset === preset ? "secondary" : "outline"}
                className={cn(
                  "p-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  selectedPreset === preset
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {filePatternConfig.sections.map((section, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <span className="font-medium flex items-center w-5 h-5 mr-2">
                  {React.createElement(iconMap[section.icon as IconName], {})}
                  {section.title}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4 p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {section.tags.map((tag, tagIndex) => (
                          <div
                            key={tagIndex}
                            className="flex items-center justify-between"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => addTag(tag)}
                                    variant="link"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                  >
                                    {tag.value}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <Span>{tag.description}</Span>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Span className="text-xs text-muted-foreground">
                              点击添加
                            </Span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 space-y-4">
          <div>
            <Label className="text-sm font-medium">
              加载文件模式配置 (JSON)
            </Label>
            <Textarea
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700"
              rows={4}
              placeholder="粘贴您的JSON配置在这里"
              onChange={(e) => loadFilePatternFromJSON(e.target.value)}
            ></Textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setIsLoading(true);
                // TODO: Implement save functionality
                setTimeout(() => setIsLoading(false), 2000);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              保存设置
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}