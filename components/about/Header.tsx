"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState } from "react";
import styled from "styled-components";

const HeaderWrapper = styled(motion.header)`
  background-color: ${({ theme }) => theme.background};
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color 0.3s;
  backdrop-filter: blur(8px);
  background-color: ${({ theme }) =>
    theme.dark ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)"};
`;

const StyledMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.menuBackground};
  padding: 0.5rem 1rem;
  animation: slideIn 0.3s ease-in;

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const NavMenu = styled(motion.nav)`
  @media (orientation: landscape) and (max-width: 768px) {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 300px;
  }
`;

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
    <HeaderWrapper
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/placeholder.svg"
            alt="Lithium Logo"
            width={40}
            height={40}
            className="animate-pulse-slow"
          />
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            {t("title")}
          </h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {[t("overview"), t("features"), t("build"), "GitHub"].map(
              (item, index) => (
                <li key={item}>
                  <a
                    href={
                      item === "GitHub"
                        ? "https://github.com/yourusername/lithium"
                        : `#${item.toLowerCase()}`
                    }
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors hover-effect"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300 hover-effect"
            aria-label="Switch language"
          >
            <Globe size={20} />
          </button>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <NavMenu
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <StyledMenu>
              <ul>
                {[t("overview"), t("features"), t("build"), "GitHub"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={
                          item === "GitHub"
                            ? "https://github.com/yourusername/lithium"
                            : `#${item.toLowerCase()}`
                        }
                        className="block py-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </StyledMenu>
          </NavMenu>
        )}
      </AnimatePresence>
    </HeaderWrapper>
  );
}
