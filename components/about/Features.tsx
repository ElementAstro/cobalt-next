"use client";

import { Cpu, Code, Rocket, BookOpen, Globe, Github } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "../../contexts/LanguageContext";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  padding: 4rem 0;
  background-color: ${({ theme }) => theme.featuresBackground};
  transition: background-color 0.3s;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 1.5rem;
  border-radius: 0.5rem;
  transition: transform 0.3s, background-color 0.3s;
  background: ${({ theme }) =>
    theme.dark ? 'linear-gradient(145deg, #1e2837, #2a3548)' : 'white'};
  box-shadow: ${({ theme }) =>
    theme.dark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'};

  @media (orientation: landscape) and (max-width: 768px) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export default function Features() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    }
  };

  const features = [
    {
      icon: Cpu,
      title: t("versatileFunctionality"),
      description: t("versatileFunctionalityDesc"),
    },
    { icon: Code, title: t("modernCpp"), description: t("modernCppDesc") },
    {
      icon: Rocket,
      title: t("dynamicModuleLoading"),
      description: t("dynamicModuleLoadingDesc"),
    },
    {
      icon: BookOpen,
      title: t("embeddedScripting"),
      description: t("embeddedScriptingDesc"),
    },
    {
      icon: Globe,
      title: t("crossPlatform"),
      description: t("crossPlatformDesc"),
    },
    {
      icon: Code,
      title: t("comprehensiveAPIs"),
      description: t("comprehensiveAPIsDesc"),
    },
    { icon: Github, title: t("openSource"), description: t("openSourceDesc") },
    {
      icon: BookOpen,
      title: t("educational"),
      description: t("educationalDesc"),
    },
  ];

  return (
    <Section id="features" ref={ref}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white animate-fade-in">
          {t("keyFeatures")}
        </h2>
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </div>
    </Section>
  );
}
