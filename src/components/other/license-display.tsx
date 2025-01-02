"use client";

import { useState, useEffect } from "react";
import {
  fetchLicense,
  parseLicense,
  searchLicense,
  SUPPORTED_LICENSES,
  type License,
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
import { Search, Sun, Moon, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export function LicenseDisplay() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<string>("gpl-3.0");
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
  const [compareSections, setCompareSections] = useState<
    Array<{ id: string; title: string; content: string }>
  >([]);

  useEffect(() => {
    async function loadLicenses() {
      try {
        const licensePromises = SUPPORTED_LICENSES.map(async (license) => {
          const licenseText = await fetchLicense(license.id);
          return parseLicense(licenseText, license.id, license.name);
        });

        const loadedLicenses = await Promise.all(licensePromises);
        setLicenses(loadedLicenses);
        loadLicense("gpl-3.0");
      } catch (err) {
        setError("无法加载许可证。请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    }

    loadLicenses();
  }, []);

  async function loadLicense(licenseId: string) {
    try {
      const license = licenses.find((l) => l.id === licenseId);
      if (license) {
        setLicenseSections(license.sections);
        setDisplayedSections(license.sections);
      }
    } catch (err) {
      setError(`无法加载 ${licenseId} 许可证。`);
    }
  }

  useEffect(() => {
    if (selectedLicense) {
      loadLicense(selectedLicense);
    }
  }, [selectedLicense]);

  useEffect(() => {
    if (isComparing && compareLicense) {
      const license = licenses.find((l) => l.id === compareLicense);
      if (license) {
        setCompareSections(license.sections);
      }
    }
  }, [isComparing, compareLicense, licenses]);

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

  const handleCopySection = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "已复制",
      description: "许可证部分已复制到剪贴板",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center p-4 dark:text-gray-200">加载许可证中...</div>
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
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant={isComparing ? "default" : "outline"}
            onClick={() => setIsComparing(!isComparing)}
          >
            {isComparing ? "停止比较" : "比较许可证"}
          </Button>

          <div className="flex items-center gap-2">
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
          </div>
        </motion.div>
      </div>

      {isComparing && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Select
            value={compareLicense || ""}
            onValueChange={setCompareLicense}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="选择要比较的许可证" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>比较许可证</SelectLabel>
                {licenses
                  .filter((l) => l.id !== selectedLicense)
                  .map((license) => (
                    <SelectItem key={license.id} value={license.id}>
                      {license.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLicense + (compareLicense || "")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: isComparing ? "1fr 1fr" : "1fr" }}
          >
            <div>
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
                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                            {section.content}
                          </pre>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => handleCopySection(section.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>

            {isComparing && compareLicense && (
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {compareSections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: 50 }}
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
                          <motion.div
                            className="relative"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                              {section.content}
                            </pre>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => handleCopySection(section.content)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
