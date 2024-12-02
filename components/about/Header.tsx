"use client";

import Image from "next/image";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useLanguage } from "../../../../contexts/LanguageContext";
import { useState } from "react";
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background-color: ${({ theme }) => theme.background};
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color 0.3s;
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

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  return (
    <HeaderWrapper>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/placeholder.svg"
            alt="Lithium Logo"
            width={40}
            height={40}
            className="animate-pulse-slow"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
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
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300 hover-effect"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
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
      {isMenuOpen && (
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
      )}
    </HeaderWrapper>
  );
}
