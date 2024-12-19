"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const CodeButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #374151;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4b5563;
  }
`;

const StyledPre = styled.pre`
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  background-color: #1e293b;
  color: #cbd5e1;
`;

const CodeBlock = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => (theme.dark ? "#1a2233" : "#f8fafc")};
  border-radius: 12px;
  overflow: hidden;

  @media (orientation: landscape) {
    max-height: 80vh;
    overflow-y: auto;
  }
`;

const CopyNotification = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem;
  background: #4ade80;
  color: white;
  border-radius: 8px;
  z-index: 100;
`;

const CodeBlockComponent = ({
  code,
  language,
}: {
  code: string;
  language: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <CodeBlock
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" }}
      >
        <StyledPre>
          <Highlight
            theme={themes.nightOwl}
            code={code.trim()}
            language={language as any}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-4 rounded-lg overflow-x-auto text-sm`}
                style={style}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
          <CodeButton onClick={copyToClipboard} aria-label="Copy code">
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </CodeButton>
        </StyledPre>
      </CodeBlock>
      <AnimatePresence>
        {copied && (
          <CopyNotification
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Code copied to clipboard!
          </CopyNotification>
        )}
      </AnimatePresence>
    </>
  );
};

export default function BuildInstructions() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("windows");

  return (
    <section id="build" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-12"
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
                  <CodeBlockComponent
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
                  <CodeBlockComponent
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
                  <CodeBlockComponent
                    language="bash"
                    code="mkdir build && cd build"
                  />
                </li>
                <li>
                  {t("configureProject")}:{" "}
                  <CodeBlockComponent language="bash" code="cmake .." />
                </li>
                <li>
                  {t("compileAndExecute")}:{" "}
                  <CodeBlockComponent language="bash" code="make -jN" /> or{" "}
                  <CodeBlockComponent
                    language="bash"
                    code="cmake --build . --parallel N"
                  />
                </li>
                <li>
                  {t("launchProgram")}:{" "}
                  <CodeBlockComponent language="bash" code="./lithium_server" />
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
