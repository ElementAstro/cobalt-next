"use client";

import { Cpu, Code, Rocket, BookOpen, Globe, Github } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";

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
      transition: { type: "spring", stiffness: 50 },
    },
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
    <section id="features" ref={ref} className="py-16 md:py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("keyFeatures")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-6 rounded-xl bg-card hover:bg-card/80 transition-colors border shadow-sm hover:shadow-md"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
            >
              <div className="flex flex-col gap-4">
                <feature.icon className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
