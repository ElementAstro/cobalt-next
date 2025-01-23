"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/custom/code-block";
import { BoxReveal } from "@/components/ui/box-reveal";
import { SparklesText } from "@/components/ui/sparkles-text";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Copy,
  Terminal,
  Code,
  FileCode,
  Cpu,
  Server,
} from "lucide-react";

export default function BuildInstructions() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen px-4 overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* 轨道图背景层 - 居中定位 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="opacity-50 transform-gpu">
            <OrbitingCircles
              radius={window.innerWidth < 768 ? 160 : 240}
              iconSize={window.innerWidth < 768 ? 24 : 32}
              speed={0.3}
            >
              <Terminal className="text-blue-400" />
              <Code className="text-green-400" />
              <FileCode className="text-purple-400" />
              <Cpu className="text-red-400" />
              <Server className="text-yellow-400" />
            </OrbitingCircles>
          </div>
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl">
          <motion.div
            className="mt-8 sm:mt-12 space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Tabs defaultValue="windows" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                <TabsTrigger value="windows">Windows (MSYS2)</TabsTrigger>
                <TabsTrigger value="ubuntu">Ubuntu/Debian</TabsTrigger>
              </TabsList>

              
                <TabsContent value="windows" className="m-0">
                  <Card className="border-none shadow-lg bg-gray-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-400" />
                        {t("windowsMSYS2")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CodeBlock
                        language="bash"
                        code={`
# Add Tsinghua University mirror source
sed -i 's|https://mirror.msys2.org/|https://mirrors.tuna.tsinghua.edu.cn/msys2/|g' /etc/pacman.d/mirrorlist.mingw64

# Update system packages and install dependencies
pacman -Syu
pacman -S mingw-w64-x86_64-toolchain mingw-w64-x86_64-dlfcn mingw-w64-x86_64-cfitsio mingw-w64-x86_64-cmake mingw-w64-x86_64-libzip mingw-w64-x86_64-zlib mingw-w64-x86_64-fmt mingw-w64-x86_64-libnova make mingw-w64-x86_64-gtest
                      `}
                        theme="dark"
                        showLineNumbers={true}
                        className="rounded-none"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ubuntu" className="m-0">
                  <Card className="border-none shadow-lg bg-gray-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-green-400" />
                        {t("ubuntuDebian")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CodeBlock
                        language="bash"
                        code={`
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install build-essential cmake libcfitsio-dev zlib1g-dev libssl-dev libzip-dev libfmt-dev
                      `}
                        theme="dark"
                        showLineNumbers={true}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
            </Tabs>

            <BoxReveal>
              <Card className="border-none shadow-lg bg-gray-900/50 backdrop-blur">
                <CardHeader className="border-b border-gray-800/50 sm:py-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    {t("buildingSteps")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ol className="divide-y divide-gray-800/50">
                    {/* 构建步骤项 - 调整间距和响应式 */}
                    <motion.li
                      className="p-4 sm:p-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm text-gray-400">
                        {t("createBuildDirectory")}:
                      </p>
                      <div className="relative">
                        <CodeBlock
                          language="bash"
                          code="mkdir build && cd build"
                          theme="dark"
                          showLineNumbers={false}
                          fontSize="small"
                          className="w-full rounded-md text-xs sm:text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 hover:bg-background/50"
                          onClick={() => handleCopy("mkdir build && cd build")}
                        >
                          {copied ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </div>
                    </motion.li>

                    <motion.li
                      className="p-4 sm:p-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm text-gray-400">
                        {t("configureProject")}:
                      </p>
                      <div className="relative">
                        <CodeBlock
                          language="bash"
                          code="cmake .."
                          theme="dark"
                          showLineNumbers={false}
                          fontSize="small"
                          className="w-full rounded-md text-xs sm:text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 hover:bg-background/50"
                          onClick={() => handleCopy("cmake ..")}
                        >
                          {copied ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </div>
                    </motion.li>

                    <motion.li
                      className="p-4 sm:p-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm text-gray-400">
                        {t("compileAndExecute")}:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="relative">
                          <CodeBlock
                            language="bash"
                            code="make -jN"
                            theme="dark"
                            showLineNumbers={false}
                            fontSize="small"
                            className="w-full rounded-md text-xs sm:text-sm"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1 hover:bg-background/50"
                            onClick={() => handleCopy("make -jN")}
                          >
                            {copied ? (
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="relative">
                          <CodeBlock
                            language="bash"
                            code="cmake --build . --parallel N"
                            theme="dark"
                            showLineNumbers={false}
                            fontSize="small"
                            className="w-full rounded-md text-xs sm:text-sm"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1 hover:bg-background/50"
                            onClick={() =>
                              handleCopy("cmake --build . --parallel N")
                            }
                          >
                            {copied ? (
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.li>

                    <motion.li
                      className="p-4 sm:p-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm text-gray-400">
                        {t("launchProgram")}:
                      </p>
                      <div className="relative">
                        <CodeBlock
                          language="bash"
                          code="./lithium_server"
                          theme="dark"
                          showLineNumbers={false}
                          fontSize="small"
                          className="w-full rounded-md text-xs sm:text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 hover:bg-background/50"
                          onClick={() => handleCopy("./lithium_server")}
                        >
                          {copied ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </div>
                    </motion.li>
                  </ol>
                </CardContent>
              </Card>
            </BoxReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
