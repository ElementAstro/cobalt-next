"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative">
      <div className="rounded-lg overflow-hidden bg-muted">
        <pre className="p-4 overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-2 right-2 p-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function BuildInstructions() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("windows");

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
                  {t("createBuildDirectory")}:{" "}
                  <CodeBlock
                    language="bash"
                    code="mkdir build && cd build"
                  />
                </li>
                <li>
                  {t("configureProject")}:{" "}
                  <CodeBlock language="bash" code="cmake .." />
                </li>
                <li>
                  {t("compileAndExecute")}:{" "}
                  <CodeBlock language="bash" code="make -jN" /> or{" "}
                  <CodeBlock
                    language="bash"
                    code="cmake --build . --parallel N"
                  />
                </li>
                <li>
                  {t("launchProgram")}:{" "}
                  <CodeBlock language="bash" code="./lithium_server" />
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
