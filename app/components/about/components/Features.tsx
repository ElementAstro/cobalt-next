"use client";

import { Cpu, Code, Rocket, BookOpen, Globe, Github } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "../../../../contexts/LanguageContext";

export default function Features() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    <section
      id="features"
      ref={ref}
      className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white animate-fade-in">
          {t("keyFeatures")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-100 dark:bg-gray-800 p-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                inView ? "animate-slide-in opacity-100" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
