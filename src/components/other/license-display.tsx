"use client";

import { useState, useEffect } from "react";
import {
  fetchGPL3License,
  parseGPL3License,
  searchLicense,
} from "@/utils/license-parser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface License {
  id: string;
  name: string;
  sections: Array<{ id: string; title: string; content: string }>;
}

export function LicenseDisplay() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<string>("GPL3");
  const [licenseSections, setLicenseSections] = useState<
    Array<{ id: string; title: string; content: string }>
  >([]);
  const [displayedSections, setDisplayedSections] = useState<
    Array<{ id: string; title: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareLicense, setCompareLicense] = useState<string | null>(null);

  useEffect(() => {
    async function loadLicense() {
      try {
        const licenseText = await fetchGPL3License();
        const parsedSections = parseGPL3License(licenseText);
        setLicenseSections(parsedSections);
        setDisplayedSections(parsedSections);
      } catch (err) {
        setError("无法加载 GPL3 许可证。请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    }

    loadLicense();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredSections = searchLicense(licenseSections, searchQuery);
      setDisplayedSections(filteredSections);
    } else {
      setDisplayedSections(licenseSections);
    }
  }, [searchQuery, licenseSections]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="text-center p-4 dark:text-gray-200">
        加载 GPL3 许可证中...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      className={`mx-auto p-4 ${
        isLandscape ? "landscape" : ""
      } bg-white dark:bg-gray-800 transition-colors duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Select value={selectedLicense} onValueChange={setSelectedLicense}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择许可证" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>开源许可证</SelectLabel>
                {licenses.map((license) => (
                  <SelectItem key={license.id} value={license.id}>
                    {license.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="搜索许可证..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2 flex-1 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="dark-mode" className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon className="h-5 w-5 text-yellow-400" />
            ) : (
              <Sun className="h-5 w-5 text-orange-400" />
            )}
          </Label>
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {displayedSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={section.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.pre
                      className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {section.content}
                    </motion.pre>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
