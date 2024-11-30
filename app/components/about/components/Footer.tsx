"use client";

import { Github, Star, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "../../../../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-gray-600 dark:text-gray-300 animate-fade-in">
          {t("footer")}
        </p>
        <div className="flex justify-center space-x-4 mb-4">
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Star, href: "#", label: "Star" },
            { icon: Twitter, href: "#", label: "Twitter" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
          ].map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors hover-effect animate-scale"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6" />
            </a>
          ))}
        </div>
        <p
          className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          © {new Date().getFullYear()} Lithium Project. {t("allRightsReserved")}
        </p>
      </div>
    </footer>
  );
}
