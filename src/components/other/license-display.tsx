"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Search, Sun, Moon, Copy, Star, BarChart2, X } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const controls = useAnimationControls();

  // Enhanced loading animation
  const loadingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Load licenses with error handling
  useEffect(() => {
    async function loadLicenses() {
      try {
        controls.start("animate");
        const licensePromises = SUPPORTED_LICENSES.map(async (license) => {
          const licenseText = await fetchLicense(license.id);
          return parseLicense(licenseText, license.id, license.name);
        });

        const loadedLicenses = await Promise.all(licensePromises);
        setLicenses(loadedLicenses);
        loadLicense("gpl-3.0");
      } catch (err) {
        setError("无法加载许可证。请稍后再试。");
        controls.start("exit");
      } finally {
        setIsLoading(false);
      }
    }

    loadLicenses();
  }, []);

  // Load individual license
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

  // Handle license selection
  useEffect(() => {
    if (selectedLicense) {
      loadLicense(selectedLicense);
    }
  }, [selectedLicense]);

  // Handle comparison mode
  useEffect(() => {
    if (isComparing && compareLicense) {
      const license = licenses.find((l) => l.id === compareLicense);
      if (license) {
        setCompareSections(license.sections);
      }
    }
  }, [isComparing, compareLicense, licenses]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const filteredSections = searchLicense(licenseSections, searchQuery);
      setDisplayedSections(filteredSections);
    } else {
      setDisplayedSections(licenseSections);
    }
  }, [searchQuery, licenseSections]);

  // Handle dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Handle favorites
  const toggleFavorite = (licenseId: string) => {
    setFavorites((prev) =>
      prev.includes(licenseId)
        ? prev.filter((id) => id !== licenseId)
        : [...prev, licenseId]
    );
  };

  // Copy section content
  const handleCopySection = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "已复制",
      description: "许可证部分已复制到剪贴板",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        className="grid gap-4 p-4"
        variants={loadingVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="text-center p-4 text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {error}
      </motion.div>
    );
  }

  // License statistics
  const licenseStats = useMemo(() => {
    const totalLicenses = licenses.length;
    const totalSections = licenses.reduce(
      (acc, license) => acc + license.sections.length,
      0
    );
    const avgSections = (totalSections / totalLicenses).toFixed(1);
    return { totalLicenses, totalSections, avgSections };
  }, [licenses]);

  return (
    <motion.div
      className={`mx-auto p-4 ${
        isLandscape ? "landscape" : ""
      } bg-white dark:bg-gray-800 transition-colors duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <motion.div
          className="flex items-center gap-4 flex-1"
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
                    <div className="flex items-center gap-2">
                      {license.name}
                      {favorites.includes(license.id) && (
                        <Star className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
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
            className="flex-1 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSearchQuery("")}
            >
              {searchQuery ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
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

          <Button
            variant={showStats ? "default" : "outline"}
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            统计
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

      {/* Statistics Panel */}
      {showStats && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">{licenseStats.totalLicenses}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">许可证总数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{licenseStats.totalSections}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">章节总数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{licenseStats.avgSections}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">平均章节数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{favorites.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">收藏数量</div>
          </div>
        </motion.div>
      )}

      {/* Comparison Selector */}
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

      {/* Main Content */}
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
            {/* Primary License */}
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

            {/* Comparison License */}
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
