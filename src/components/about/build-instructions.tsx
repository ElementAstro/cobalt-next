"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/custom/code-block";
import { CheckCircle, Copy } from "lucide-react";

export default function BuildInstructions() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="build" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("buildInstructions")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("buildInstructionsSubtitle")}
            </p>
          </div>

          <Tabs defaultValue="windows" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="windows">Windows (MSYS2)</TabsTrigger>
              <TabsTrigger value="ubuntu">Ubuntu/Debian</TabsTrigger>
            </TabsList>

            <TabsContent value="windows" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("windowsMSYS2")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ubuntu" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("ubuntuDebian")}</CardTitle>
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

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t("buildingSteps")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6 list-decimal list-inside">
                <li>
                  {t("createBuildDirectory")}:
                  <CodeBlock
                    language="bash"
                    code="mkdir build && cd build"
                    theme="dark"
                    showLineNumbers={false}
                    fontSize="small"
                    className="mt-2"
                  />
                </li>
                <li>
                  {t("configureProject")}:
                  <CodeBlock
                    language="bash"
                    code="cmake .."
                    theme="dark"
                    showLineNumbers={false}
                    fontSize="small"
                    className="mt-2"
                  />
                </li>
                <li>
                  {t("compileAndExecute")}:
                  <div className="flex gap-2 mt-2">
                    <CodeBlock
                      language="bash"
                      code="make -jN"
                      theme="dark"
                      showLineNumbers={false}
                      fontSize="small"
                    />
                    <span className="self-center">or</span>
                    <CodeBlock
                      language="bash"
                      code="cmake --build . --parallel N"
                      theme="dark"
                      showLineNumbers={false}
                      fontSize="small"
                    />
                  </div>
                </li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {t("launchProgram")}:
                  <div className="relative mt-2">
                    <CodeBlock
                      language="bash"
                      code="./lithium_server"
                      theme="dark"
                      showLineNumbers={false}
                      fontSize="small"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 hover:bg-background/50"
                      onClick={() => handleCopy("./lithium_server")}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </motion.li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
