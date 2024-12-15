"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import {
  Camera,
  Crosshair,
  ImageIcon,
  Settings,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useImageSettingsStore } from "@/lib/store/settings/image";

interface DraggableTagProps {
  tag: { value: string };
  onRemove: () => void;
}

const DraggableTag: React.FC<DraggableTagProps> = ({ tag, onRemove }) => (
  <div className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs flex items-center space-x-1">
    <span>{tag.value}</span>
    <button
      onClick={onRemove}
      className="focus:outline-none"
      aria-label="Remove tag"
    >
      <X size={12} />
    </button>
  </div>
);

const iconMap: { [key: string]: React.ComponentType<any> } = {
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

  const [isLandscape, setIsLandscape] = useState(false);
  const [showLandscapeWarning, setShowLandscapeWarning] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const landscapeQuery = useMediaQuery({
    query: "(orientation: landscape) and (max-width: 768px)",
  });

  useEffect(() => {
    setIsLandscape(landscapeQuery);
  }, [landscapeQuery]);

  useEffect(() => {
    if (isLandscape) {
      setShowLandscapeWarning(true);
      const timer = setTimeout(() => setShowLandscapeWarning(false), 5000);
      return () => clearTimeout(timer);
    }
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div
      className={`w-full max-w-3xl mx-auto p-4 space-y-4 rounded-lg shadow transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-lg font-semibold">File settings</h2>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="space-y-1">
          <Label className="text-sm font-medium">Save image as</Label>
          <Select defaultValue="FITS">
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FITS">FITS</SelectItem>
              <SelectItem value="RAW">RAW</SelectItem>
              <SelectItem value="TIFF">TIFF</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This setting is ignored for DSLRs when using the native driver.
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Image file path</Label>
          <div className="flex gap-2">
            <Input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="h-8 text-sm flex-1"
            />
            <Button variant="outline" className="h-8 text-sm">
              Browse
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Image file pattern</Label>
          <Input
            value={filePattern}
            onChange={(e) => setFilePattern(e.target.value)}
            className="h-8 text-sm"
          />
          <div className="mt-1">
            <Reorder.Group
              axis="x"
              values={tags}
              onReorder={reorderTags}
              className="flex flex-wrap gap-1"
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
          <Label htmlFor="auto-save" className="text-sm">
            Auto-save settings
          </Label>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">
            Compression Level (1-10)
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              type="range"
              min="1"
              max="10"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-8 text-center">
              {compressionLevel}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-2">
        {filePatternConfig.sections.map((section, index) => (
          <div key={index} className="border rounded-md overflow-hidden">
            <button
              className="w-full p-2 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => toggleSection(section.title)}
            >
              <span className="font-medium flex items-center text-sm">
                {React.createElement(
                  iconMap[section.icon as keyof typeof iconMap],
                  { className: "w-4 h-4 mr-2" }
                )}
                {section.title}
              </span>
              {expandedSection === section.title ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === section.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-2 space-y-1">
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
                                className="text-xs font-medium hover:text-primary transition-colors"
                              >
                                {tag.value}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{tag.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-xs text-muted-foreground">
                          Click to add
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Label className="text-sm font-medium">
          Load File Pattern Configuration (JSON)
        </Label>
        <Textarea
          className="mt-1"
          rows={3}
          placeholder="Paste your JSON configuration here"
          onChange={(e) => loadFilePatternFromJSON(e.target.value)}
        ></Textarea>
      </div>
    </div>
  );
}
