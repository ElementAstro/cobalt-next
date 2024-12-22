"use client";

import React from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import {
  Camera,
  Crosshair,
  ImageIcon,
  Settings,
  Smartphone,
  X,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useImageSettingsStore } from "@/lib/store/global/imaging";

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
  <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm flex items-center space-x-2">
    <span>{tag.value}</span>
    <button
      onClick={onRemove}
      className="focus:outline-none"
      aria-label="Remove tag"
    >
      <X size={14} />
    </button>
  </div>
);

type IconName = "Settings" | "Camera" | "Image" | "Crosshair";

const iconMap: Record<IconName, React.ComponentType> = {
  Settings,
  Camera,
  Image: ImageIcon,
  Crosshair,
};

export default function ImageSettingsPanel() {
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
      className={`w-full max-w-3xl mx-auto p-6 space-y-6 rounded-lg shadow transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      {isLandscape && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <Smartphone className="w-12 h-12 mx-auto mb-2" />
            <p className="text-center">
              Please rotate your device for the best experience
            </p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-xl font-semibold">File settings</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle dark mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Save image as</label>
          <Select defaultValue="FITS">
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FITS">FITS</SelectItem>
              <SelectItem value="RAW">RAW</SelectItem>
              <SelectItem value="TIFF">TIFF</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            This setting is ignored for DSLRs when using the native driver. The
            camera's RAW format will be saved instead!
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image file path</label>
          <div className="flex gap-2">
            <Input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Browse</Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image file pattern</label>
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
          <Label htmlFor="auto-save">Auto-save settings</Label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Compression Level (1-10)
          </label>
          <Input
            type="range"
            min="1"
            max="10"
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">
            Current level: {compressionLevel}
          </p>
        </div>
      </motion.div>

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
                                <button
                                  onClick={() => addTag(tag)}
                                  className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                  {tag.value}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tag.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <p className="text-xs text-muted-foreground">
                            Click to add
                          </p>
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

      <div className="mt-6">
        <label className="text-sm font-medium">
          Load File Pattern Configuration (JSON)
        </label>
        <textarea
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          rows={4}
          placeholder="Paste your JSON configuration here"
          onChange={(e) => loadFilePatternFromJSON(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
