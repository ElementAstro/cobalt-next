"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useLanguage } from "../../../../contexts/LanguageContext";

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
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
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy size={16} className="text-white" />
        )}
      </button>
    </div>
  );
};

export default function BuildInstructions() {
  const { t } = useLanguage();

  return (
    <section
      id="build"
      className="py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white animate-fade-in">
          {t("buildInstructions")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="animate-slide-in" style={{ animationDelay: "200ms" }}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t("windowsMSYS2")}
            </h3>
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
          </div>
          <div className="animate-slide-in" style={{ animationDelay: "400ms" }}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t("ubuntuDebian")}
            </h3>
            <CodeBlock
              language="bash"
              code={`
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install build-essential cmake libcfitsio-dev zlib1g-dev libssl-dev libzip-dev libfmt-dev
              `}
            />
          </div>
        </div>
        <div
          className="mt-8 animate-slide-in"
          style={{ animationDelay: "600ms" }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t("buildingSteps")}
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-800 dark:text-gray-200">
            <li>
              {t("createBuildDirectory")}:{" "}
              <CodeBlock language="bash" code="mkdir build && cd build" />
            </li>
            <li>
              {t("configureProject")}:{" "}
              <CodeBlock language="bash" code="cmake .." />
            </li>
            <li>
              {t("compileAndExecute")}:{" "}
              <CodeBlock language="bash" code="make -jN" /> or{" "}
              <CodeBlock language="bash" code="cmake --build . --parallel N" />
            </li>
            <li>
              {t("launchProgram")}:{" "}
              <CodeBlock language="bash" code="./lithium_server" />
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
