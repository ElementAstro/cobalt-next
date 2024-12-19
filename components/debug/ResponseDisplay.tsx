"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { useState } from "react";
import { ClipboardCopyIcon } from "lucide-react";

interface ResponseDisplayProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    timing?: {
      start: number;
      end: number;
    };
  } | null;
  loading: boolean;
}

export default function ResponseDisplay({
  response,
  loading,
}: ResponseDisplayProps) {
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">尚未有响应。发送请求以查看结果。</p>
        </CardContent>
      </Card>
    );
  }

  const highlightCode = (code: string) => {
    return Prism.highlight(code, Prism.languages.json, "json");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const highlightSearchTerm = (content: string) => {
    if (!searchTerm) return content;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return content.replace(regex, "<mark>$1</mark>");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-6"
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-semibold flex items-center">
            <div className="flex-1">响应结果</div>
            {response?.timing && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                响应时间: {(response.timing.end - response.timing.start).toFixed(2)}ms
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, staggerChildren: 0.2 }}
            className="space-y-6"
          >
            <Input
              placeholder="搜索响应内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">状态:</h3>
                <button
                  onClick={() =>
                    copyToClipboard(`${response.status} ${response.statusText}`)
                  }
                  className="text-gray-400 hover:text-gray-200"
                >
                  <ClipboardCopyIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-300">
                {response.status} {response.statusText}
              </p>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Headers:</h3>
                <button
                  onClick={() => setShowHeaders(!showHeaders)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  {showHeaders ? "隐藏" : "显示"}
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(response.headers, null, 2))
                  }
                  className="ml-2 text-gray-400 hover:text-gray-200"
                >
                  <ClipboardCopyIcon className="h-5 w-5" />
                </button>
              </div>
              <AnimatePresence>
                {showHeaders && (
                  <motion.div
                    className="p-4 bg-gray-50 dark:bg-gray-900/50"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <motion.pre
                      className="language-json bg-gray-800 p-4 rounded mt-2 overflow-auto"
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(
                          JSON.stringify(response.headers, null, 2)
                        ),
                      }}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Body:</h3>
                <button
                  onClick={() => setShowBody(!showBody)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  {showBody ? "隐藏" : "显示"}
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(response.data, null, 2))
                  }
                  className="ml-2 text-gray-400 hover:text-gray-200"
                >
                  <ClipboardCopyIcon className="h-5 w-5" />
                </button>
              </div>
              <AnimatePresence>
                {showBody && (
                  <motion.pre
                    className="language-json bg-gray-800 p-4 rounded mt-2 overflow-auto"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(
                        highlightCode(JSON.stringify(response.data, null, 2))
                      ),
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
