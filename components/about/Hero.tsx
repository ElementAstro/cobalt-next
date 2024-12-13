"use client";

import { Shield, Code, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import styled from "styled-components";

const ParallaxSection = styled(motion.section)`
  position: relative;
  overflow: hidden;
  
  @media (orientation: landscape) {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
`;

export default function Hero() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <ParallaxSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-20 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300"
    >
      <motion.div className="container mx-auto px-4" variants={itemVariants}>
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in"
          variants={itemVariants}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 animate-slide-in"
          style={{ animationDelay: "200ms" }}
          variants={itemVariants}
        >
          {t("subtitle")}
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          variants={itemVariants}
        >
          {[
            { icon: Shield, text: t("security"), color: "bg-blue-600" },
            { icon: Code, text: t("linesOfCode"), color: "bg-green-600" },
            { icon: Star, text: t("rating"), color: "bg-yellow-600" },
          ].map((item, index) => (
            <motion.span
              key={item.text}
              className={`${item.color} text-white px-3 py-1 rounded-full text-sm flex items-center animate-scale`}
              style={{ animationDelay: `${index * 100 + 400}ms` }}
              variants={itemVariants}
            >
              <item.icon className="w-4 h-4 mr-1" />
              {item.text}
            </motion.span>
          ))}
        </motion.div>
        <motion.a
          href="#build"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors hover-effect animate-fade-in"
          style={{ animationDelay: "700ms" }}
          variants={itemVariants}
        >
          {t("getStarted")}
        </motion.a>
      </motion.div>
    </ParallaxSection>
  );
}
