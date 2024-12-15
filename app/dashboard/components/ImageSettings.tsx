import {
  Accordion,
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
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Crosshair,
  ImageIcon,
  Settings,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function ImageSettingsPanel() {
  const [filePath, setFilePath] = useState("C:/Users/Documents/Images");
  const [filePattern, setFilePattern] = useState(
    "$$DATEMINUS12$$_$$IMAGETYPE$$_$$FRAMENR$$"
  );
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState(5);

  const isLandscape = useMediaQuery({
    query: "(orientation: landscape) and (max-width: 768px)",
  });

  useEffect(() => {
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
    // Here you would typically update your app's theme
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
        <AccordionItem value="time">
          <AccordionTrigger>
            <span className="font-medium flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Time Parameters
            </span>
          </AccordionTrigger>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">$$DATE$$</label>
                    <p className="text-sm text-muted-foreground">
                      Date with format YYYY-MM-DD
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">$$TIME$$</label>
                    <p className="text-sm text-muted-foreground">
                      Time with format HH-mm-ss
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </AccordionItem>

        <AccordionItem value="camera">
          <AccordionTrigger>
            <span className="font-medium flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Camera Settings
            </span>
          </AccordionTrigger>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">$$CAMERA$$</label>
                    <p className="text-sm text-muted-foreground">Camera name</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">$$GAIN$$</label>
                    <p className="text-sm text-muted-foreground">Camera gain</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      $$SENSORTEMP$$
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Camera temperature
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </AccordionItem>

        <AccordionItem value="image">
          <AccordionTrigger>
            <span className="font-medium flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Image Properties
            </span>
          </AccordionTrigger>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      $$EXPOSURETIME$$
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Camera exposure time, in seconds
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">$$FRAMENR$$</label>
                    <p className="text-sm text-muted-foreground">
                      # of the frame with format ####
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">$$IMAGETYPE$$</label>
                    <p className="text-sm text-muted-foreground">
                      Light, Flat, Dark, Bias, Snapshot
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </AccordionItem>

        <AccordionItem value="guider">
          <AccordionTrigger>
            <span className="font-medium flex items-center">
              <Crosshair className="w-5 h-5 mr-2" />
              Guider Settings
            </span>
          </AccordionTrigger>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">$$PEAKDEC$$</label>
                    <p className="text-sm text-muted-foreground">
                      Peak Dec guiding error during exposure in pixels
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">$$PEAKRA$$</label>
                    <p className="text-sm text-muted-foreground">
                      Peak RA guiding error during exposure in pixels
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
