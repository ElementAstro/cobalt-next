"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useState } from "react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg"
              alt="Lithium Logo"
              width={40}
              height={40}
              className="animate-pulse-slow"
            />
            <h1 className="text-xl md:text-2xl font-bold">
              {t("title")}
            </h1>
          </div>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {[t("overview"), t("features"), t("build"), "GitHub"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={
                        item === "GitHub"
                          ? "https://github.com/yourusername/lithium"
                          : `#${item.toLowerCase()}`
                      }
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Switch language"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              className="md:hidden p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-x-0 top-[65px] p-4 bg-background/95 backdrop-blur-lg border-b md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <nav>
              <ul className="flex flex-col gap-4">
                {[t("overview"), t("features"), t("build"), "GitHub"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={
                          item === "GitHub"
                            ? "https://github.com/yourusername/lithium"
                            : `#${item.toLowerCase()}`
                        }
                        className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
