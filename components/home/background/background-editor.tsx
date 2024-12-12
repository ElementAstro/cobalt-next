"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "./color-picker";
import { ImageUploader } from "./image-uploader";
import { ImageAdjuster } from "./image-adjuster";
import { EnhancedPreview } from "./enhanced-preview";
import { AnimatePresence, motion } from "framer-motion";
import { GradientPicker } from "./gradient-picker";
import { BlendModePicker } from "./blend-mode-picker";
import { BackgroundPatternPicker } from "./background-pattern-picker";
import { FilterAdjuster } from "./filter-adjuster";
import { AnimationPicker } from "./animation-picker";
import { CSSExporter } from "./css-exporter";
import { TemplateSelector } from "./template-selector";
import { TemplateManager } from "./template-manager";
import ErrorBoundary from "./error-boundary";
import { ErrorDisplay } from "./error-display";
import { Template } from "./types";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function BackgroundEditor() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [imageSize, setImageSize] = useState("cover");
  const [imagePosition, setImagePosition] = useState("center center");
  const [imageRotation, setImageRotation] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [gradient, setGradient] = useState({
    color1: "#ffffff",
    color2: "#000000",
    type: "linear",
    angle: 0,
  });
  const [blendMode, setBlendMode] = useState("normal");
  const [backgroundPattern, setBackgroundPattern] = useState("no-repeat");
  const [filters, setFilters] = useState({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    saturate: 100,
  });
  const [animation, setAnimation] = useState({
    type: "none",
    duration: 5,
    direction: "normal",
  });

  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>(
    {}
  );

  useEffect(() => {
    const newStyle = {
      backgroundColor,
      ...(backgroundImage && { backgroundImage: `url(${backgroundImage})` }),
      ...(!backgroundImage &&
        gradient.type === "linear" && {
          backgroundImage: `linear-gradient(${gradient.angle}deg, ${gradient.color1}, ${gradient.color2})`,
        }),
      ...(!backgroundImage &&
        gradient.type === "radial" && {
          backgroundImage: `radial-gradient(circle, ${gradient.color1}, ${gradient.color2})`,
        }),
      ...(imageSize && { backgroundSize: imageSize }),
      ...(imagePosition && { backgroundPosition: imagePosition }),
      ...(backgroundPattern && { backgroundRepeat: backgroundPattern }),
      ...(blendMode && { mixBlendMode: blendMode }),
      ...(Object.values(filters).some((v) => v !== 0 && v !== 100) && {
        filter: [
          filters.blur && `blur(${filters.blur}px)`,
          filters.brightness !== 100 && `brightness(${filters.brightness}%)`,
          filters.contrast !== 100 && `contrast(${filters.contrast}%)`,
          filters.grayscale && `grayscale(${filters.grayscale}%)`,
          filters.hueRotate && `hue-rotate(${filters.hueRotate}deg)`,
          filters.saturate !== 100 && `saturate(${filters.saturate}%)`,
        ]
          .filter(Boolean)
          .join(" "),
      }),
      ...(animation.type !== "none" && {
        animation: `${animation.type} ${animation.duration}s ${animation.direction} ${animation.delay}s ${animation.repeat} ${animation.ease}`,
      }),
      ...(imageRotation !== 0 && { transform: `rotate(${imageRotation}deg)` }),
      ...(typeof imageOpacity === "number" &&
        imageOpacity !== 1 && { opacity: imageOpacity }),
    };

    setBackgroundStyle(newStyle);

    // 添加到历史记录
    const newTemplate: Template = {
      name: `Style ${Date.now()}`,
      backgroundColor,
      backgroundImage,
      gradient,
      blendMode,
      backgroundPattern,
      filters,
      animation,
      imageSize,
      imagePosition,
      imageRotation,
      imageOpacity,
    };

    setHistory((prev) => [newTemplate, ...prev].slice(0, 10)); // 保留最近10条记录
  }, [
    backgroundColor,
    backgroundImage,
    gradient,
    imageSize,
    imagePosition,
    backgroundPattern,
    blendMode,
    filters,
    animation,
    imageRotation,
    imageOpacity,
  ]);

  const handleTemplateSelect = (template: Template) => {
    setBackgroundColor(template.backgroundColor);
    setBackgroundImage(template.backgroundImage);
    setGradient(template.gradient);
    setBlendMode(template.blendMode);
    setBackgroundPattern(template.backgroundPattern);
    setFilters(template.filters);
    setAnimation(template.animation);
    setImageSize(template.imageSize);
    setImagePosition(template.imagePosition);
    setImageRotation(template.imageRotation);
    setImageOpacity(template.imageOpacity ?? 1);
  };

  const currentSettings: Template = {
    name: "",
    backgroundColor,
    backgroundImage,
    gradient,
    blendMode,
    backgroundPattern,
    filters,
    animation,
    imageSize,
    imagePosition,
    imageRotation,
    imageOpacity,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900"
    >
      <Card className="w-full max-w-7xl mx-auto backdrop-blur-lg bg-white/10 dark:bg-black/30">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-bold text-white text-center">
              高级网页背景编辑器
            </CardTitle>
            <p className="text-gray-400 text-center mt-2">
              创建令人惊叹的背景效果
            </p>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-6">
              <AnimatePresence mode="wait">
                <Tabs defaultValue="color" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="color">纯色</TabsTrigger>
                    <TabsTrigger value="gradient">渐变</TabsTrigger>
                    <TabsTrigger value="image">图片</TabsTrigger>
                  </TabsList>

                  <motion.div
                    variants={itemVariants}
                    className="mt-4 space-y-4"
                  >
                    <TabsContent value="color">
                      <ColorPicker
                        color={backgroundColor}
                        onChange={setBackgroundColor}
                      />
                    </TabsContent>
                    <TabsContent value="gradient">
                      <GradientPicker
                        gradient={gradient}
                        onChange={setGradient}
                      />
                    </TabsContent>
                    <TabsContent value="image">
                      <ImageUploader onUpload={setBackgroundImage} />
                      {backgroundImage && (
                        <ImageAdjuster
                          size={imageSize}
                          position={imagePosition}
                          rotation={imageRotation}
                          opacity={imageOpacity}
                          onSizeChange={setImageSize}
                          onPositionChange={setImagePosition}
                          onRotationChange={setImageRotation}
                          onOpacityChange={setImageOpacity}
                        />
                      )}
                    </TabsContent>
                  </motion.div>
                </Tabs>
              </AnimatePresence>

              <motion.div variants={itemVariants} className="space-y-4">
                <BlendModePicker
                  blendMode={blendMode}
                  onChange={setBlendMode}
                />
                <BackgroundPatternPicker
                  pattern={backgroundPattern}
                  onChange={setBackgroundPattern}
                />
                <FilterAdjuster filters={filters} onChange={setFilters} />
                <AnimationPicker
                  animation={animation}
                  onChange={setAnimation}
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <ErrorBoundary
                fallback={
                  <ErrorDisplay message="预览渲染出错，请检查您的设置" />
                }
              >
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <EnhancedPreview style={backgroundStyle} />
                </div>
              </ErrorBoundary>

              <motion.div
                variants={itemVariants}
                className="bg-gray-800/30 rounded-lg p-4"
              >
                <CSSExporter style={backgroundStyle} />
              </motion.div>

              {history.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-gray-800/30 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold mb-2">历史记录</h3>
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-2 bg-gray-700/30 rounded cursor-pointer"
                        onClick={() => handleTemplateSelect(item)}
                      >
                        历史记录 {history.length - index}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
