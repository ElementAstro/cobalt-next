"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  switchLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: "Lithium",
    subtitle: "The Lightweight Suite for Astronomical Imaging",
    overview: "Overview",
    features: "Features",
    build: "Build",
    getStarted: "Get Started",
    security: "A+ Security",
    linesOfCode: "50k+ LOC",
    rating: "4.8 Rating",
    keyFeatures: "Key Features",
    versatileFunctionality: "Versatile Functionality",
    versatileFunctionalityDesc:
      "Supports full-spectrum application from image acquisition to device management and system operations.",
    modernCpp: "Modern C++ Standard",
    modernCppDesc:
      "Built using the latest C++20 standard with compatibility for select C++23 features.",
    dynamicModuleLoading: "Dynamic Module Loading",
    dynamicModuleLoadingDesc:
      "Enables hot updates through C++ dynamic libraries for instant expansion of capabilities.",
    embeddedScripting: "Embedded Scripting",
    embeddedScriptingDesc:
      "Integrates a high-performance pocketpy interpreter supporting Python scripts.",
    crossPlatform: "Cross-Platform",
    crossPlatformDesc:
      "Fully supports Windows and Linux environments, with partial support for macOS.",
    comprehensiveAPIs: "Comprehensive APIs",
    comprehensiveAPIsDesc:
      "Offers a wide range of APIs and functional components for diverse astronomical imaging needs.",
    openSource: "Open-Source",
    openSourceDesc:
      "Adheres to the GPLv3 license, fostering community sharing and collaboration.",
    educational: "Educational",
    educationalDesc:
      "Encourages learning and innovation through high-quality code examples and documentation.",
    buildInstructions: "Building Instructions",
    windowsMSYS2: "Windows (MSYS2)",
    ubuntuDebian: "Ubuntu/Debian",
    buildingSteps: "Building Steps",
    createBuildDirectory: "Create Build Directory",
    configureProject: "Configure Project",
    compileAndExecute: "Compile and Execute",
    launchProgram: "Launch the program",
    footer: "Lithium - Advancing the frontiers of astronomical imaging",
    allRightsReserved: "All rights reserved.",
  },
  zh: {
    title: "Lithium",
    subtitle: "轻量级天文成像套件",
    overview: "概览",
    features: "特性",
    build: "构建",
    getStarted: "开始使用",
    security: "A+ 安全性",
    linesOfCode: "50k+ 代码行",
    rating: "4.8 评分",
    keyFeatures: "主要特性",
    versatileFunctionality: "多功能性",
    versatileFunctionalityDesc:
      "支持从图像采集到设备管理和系统操作的全方位应用。",
    modernCpp: "现代 C++ 标准",
    modernCppDesc: "使用最新的 C++20 标准构建，并兼容部分 C++23 特性。",
    dynamicModuleLoading: "动态模块加载",
    dynamicModuleLoadingDesc: "通过 C++ 动态库实现热更新，即时扩展功能。",
    embeddedScripting: "嵌入式脚本",
    embeddedScriptingDesc: "集成高性能 pocketpy 解释器，支持 Python 脚本。",
    crossPlatform: "跨平台",
    crossPlatformDesc: "全面支持 Windows 和 Linux 环境，部分支持 macOS。",
    comprehensiveAPIs: "全面的 API",
    comprehensiveAPIsDesc:
      "提供广泛的 API 和功能组件，满足多样化的天文成像需求。",
    openSource: "开源",
    openSourceDesc: "遵循 GPLv3 许可，促进社区共享和协作。",
    educational: "教育性",
    educationalDesc: "通过高质量的代码示例和文档鼓励学习和创新。",
    buildInstructions: "构建说明",
    windowsMSYS2: "Windows (MSYS2)",
    ubuntuDebian: "Ubuntu/Debian",
    buildingSteps: "构建步骤",
    createBuildDirectory: "创建构建目录",
    configureProject: "配置项目",
    compileAndExecute: "编译和执行",
    launchProgram: "启动程序",
    footer: "Lithium - 推进天文成像的前沿",
    allRightsReserved: "版权所有。",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const switchLanguage = () => {
    const newLanguage = language === "en" ? "zh" : "en";
    setLanguage(newLanguage);
    router.push(pathname.replace(`/${language}`, `/${newLanguage}`));
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, switchLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
