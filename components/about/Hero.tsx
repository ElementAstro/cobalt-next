"use client";

import { Shield, Code, Star } from "lucide-react";
import { useLanguage } from "../../../../contexts/LanguageContext";
import styled from 'styled-components';

const Section = styled.section`
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
  transition: background 0.3s;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(to bottom, #1f2937, #111827);
  }
`;

export default function Hero() {
  const { t } = useLanguage();

  return (
    <Section>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in">
          {t("title")}
        </h2>
        <p
          className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 animate-slide-in"
          style={{ animationDelay: "200ms" }}
        >
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: Shield, text: t("security"), color: "bg-blue-600" },
            { icon: Code, text: t("linesOfCode"), color: "bg-green-600" },
            { icon: Star, text: t("rating"), color: "bg-yellow-600" },
          ].map((item, index) => (
            <span
              key={item.text}
              className={`${item.color} text-white px-3 py-1 rounded-full text-sm flex items-center animate-scale`}
              style={{ animationDelay: `${index * 100 + 400}ms` }}
            >
              <item.icon className="w-4 h-4 mr-1" />
              {item.text}
            </span>
          ))}
        </div>
        <a
          href="#build"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors hover-effect animate-fade-in"
          style={{ animationDelay: "700ms" }}
        >
          {t("getStarted")}
        </a>
      </div>
    </Section>
  );
}
