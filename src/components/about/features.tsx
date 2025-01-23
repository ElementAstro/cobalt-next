"use client";

import {
  Cpu,
  Code,
  Rocket,
  BookOpen,
  Globe,
  Github,
  Car,
  Camera,
  Microscope,
  Telescope,
  Mountain,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/ui/sparkles-text";
import { BoxReveal } from "@/components/ui/box-reveal";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";

export default function Features() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 驱动使用示例数据
  const usageExamples = [
    "Canon EOS R5",
    "Nikon Z9",
    "Sony α7 IV",
    "Fujifilm X-T4",
    "Leica SL2",
    "Hasselblad X2D",
    "Pentax K-3 Mark III",
    "Olympus OM-1",
    "Panasonic S5",
    "Sigma fp L",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
      },
    },
  };

  const features = [
    {
      icon: Camera,
      title: t("versatileFunctionality"),
      description: t("versatileFunctionalityDesc"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code,
      title: t("modernCpp"),
      description: t("modernCppDesc"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Rocket,
      title: t("dynamicModuleLoading"),
      description: t("dynamicModuleLoadingDesc"),
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Microscope,
      title: t("embeddedScripting"),
      description: t("embeddedScriptingDesc"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Globe,
      title: t("crossPlatform"),
      description: t("crossPlatformDesc"),
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: Telescope,
      title: t("comprehensiveAPIs"),
      description: t("comprehensiveAPIsDesc"),
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: Github,
      title: t("openSource"),
      description: t("openSourceDesc"),
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Mountain,
      title: t("educational"),
      description: t("educationalDesc"),
      color: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="py-16 md:py-24 bg-gradient-to-b from-background/50 to-background overflow-hidden"
    >
      <div className="container px-4 mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants} className="group">
              <MagicCard
                className="h-full"
                gradientFrom={feature.color.split(" ")[1]}
                gradientTo={feature.color.split(" ")[3]}
                gradientSize={150}
                gradientOpacity={0.15}
              >
                <div className="p-6 h-full flex flex-col">
                  <motion.div
                    className={cn(
                      "w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br",
                      feature.color
                    )}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </motion.div>

        {/* 使用 Marquee 组件替换原有实现 */}
        <div className="w-full bg-black/10 backdrop-blur-sm">
          <Marquee className="py-4" pauseOnHover={true} repeat={2}>
            {usageExamples.map((item, index) => (
              <div
                key={index}
                className="mx-8 flex items-center space-x-2 text-primary/80"
              >
                <Camera className="w-4 h-4" />
                <span>{item}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
