"use client";

import { useState, useEffect } from "react";
import {
  fetchGPL3License,
  parseGPL3License,
  searchLicense,
} from "@/utils/gpl3Parser";
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
import { Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GPL3LicenseDisplay() {
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
    <div
      className={`mx-auto p-4 ${
        isLandscape ? "landscape" : ""
      } bg-white dark:bg-gray-800 transition-colors duration-300`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Input
            type="text"
            placeholder="搜索许可证..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2 flex-1 dark:bg-gray-700 dark:text-white"
          />
          <Button variant="outline" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
                  className="border-b dark:border-gray-700"
                >
                  <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.pre
                      className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300"
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
    </div>
  );
}
