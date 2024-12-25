"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CopyIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  RefreshCwIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand 商店定义
interface PackageJsonState {
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  dependencyTree: DependencyNode | null;
  setDependencyTree: (tree: DependencyNode | null) => void;
}

const usePackageJsonStore = create<PackageJsonState>()(
  persist(
    (set) => ({
      isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
      setIsDarkMode: (mode) => set({ isDarkMode: mode }),
      dependencyTree: null,
      setDependencyTree: (tree) => set({ dependencyTree: tree }),
    }),
    {
      name: "package-json-store",
    }
  )
);

interface PackageJsonRendererProps {
  packageJson: Record<string, any>;
  theme?: "light" | "dark" | "auto";
  initialTab?: "structured" | "raw" | "tree";
}

interface DependencyNode {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, DependencyNode>;
}

export default function PackageJsonRenderer({
  packageJson,
  theme = "auto",
  initialTab = "structured",
}: PackageJsonRendererProps) {
  const { isDarkMode, setIsDarkMode, dependencyTree, setDependencyTree } =
    usePackageJsonStore();

  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDependencies, setShowDependencies] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filterTerm, setFilterTerm] = useState("");

  useEffect(() => {
    if (theme === "auto") {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDarkMode(theme === "dark");
    }
  }, [theme, setIsDarkMode]);

  useEffect(() => {
    const simulateFetchDependencyTree = () => {
      const tree: DependencyNode = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        dependencies: {},
      };

      const addDependencies = (
        node: DependencyNode,
        deps: Record<string, string>
      ) => {
        for (const [name, version] of Object.entries(deps)) {
          node.dependencies![name] = {
            name,
            version,
            description: `Description for ${name}`,
          };
        }
      };

      if (packageJson.dependencies) {
        addDependencies(tree, packageJson.dependencies);
      }
      if (packageJson.devDependencies) {
        addDependencies(tree, packageJson.devDependencies);
      }

      setDependencyTree(tree);
    };

    simulateFetchDependencyTree();
  }, [packageJson, setDependencyTree]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(packageJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filterPackageJson = (obj: Record<string, any>): Record<string, any> => {
    if (!showDependencies) {
      const { dependencies, devDependencies, ...rest } = obj;
      return rest;
    }
    return obj;
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderValue = (value: any): JSX.Element => {
    if (typeof value === "object" && value !== null) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pl-4 border-l border-gray-200 dark:border-gray-700"
        >
          {Object.entries(value).map(([key, val]) => (
            <motion.div
              key={key}
              className="mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {highlightSearchTerm(key)}:
              </span>{" "}
              {renderValue(val)}
            </motion.div>
          ))}
        </motion.div>
      );
    }
    return (
      <span className="text-green-600 dark:text-green-400">
        {highlightSearchTerm(JSON.stringify(value))}
      </span>
    );
  };

  const renderDependencyTree = (node: DependencyNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.name);
    return (
      <Collapsible
        key={node.name}
        open={isExpanded}
        onOpenChange={() => {
          const newExpandedNodes = new Set(expandedNodes);
          if (isExpanded) {
            newExpandedNodes.delete(node.name);
          } else {
            newExpandedNodes.add(node.name);
          }
          setExpandedNodes(newExpandedNodes);
        }}
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center space-x-2 w-full text-left py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
            <span className="font-semibold">{node.name}</span>
            <Badge variant="secondary">{node.version}</Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-auto">
                    <Button variant="ghost" size="sm" aria-label="View on npm">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on npm</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {node.description}
          </p>
          {node.dependencies &&
            Object.values(node.dependencies).map((dep) =>
              renderDependencyTree(dep, depth + 1)
            )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const refreshPackageJson = () => {
    // 模拟刷新操作
    // 在实际应用中，应从服务器重新获取 package.json 数据
    alert("Package.json 已刷新！");
  };

  return (
    <Card
      className={`w-full max-w-4xl ${
        isDarkMode ? "dark bg-gray-900" : "bg-white"
      }`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>package.json</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refreshPackageJson}
              aria-label="刷新"
              title="刷新 package.json"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="切换暗模式"
            />
          </div>
        </CardTitle>
        <CardDescription>查看和管理您的 package.json 文件内容</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
          <Input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow mb-2 sm:mb-0"
            aria-label="搜索 package.json"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDependencies(!showDependencies)}
            title={showDependencies ? "隐藏依赖项" : "显示依赖项"}
            aria-label="切换依赖项显示"
          >
            {showDependencies ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            title={copied ? "已复制" : "复制到剪贴板"}
            aria-label="复制到剪贴板"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab as any}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="structured">结构化视图</TabsTrigger>
            <TabsTrigger value="raw">原始视图</TabsTrigger>
            <TabsTrigger value="tree">依赖树</TabsTrigger>
            <TabsTrigger value="stats">统计信息</TabsTrigger>
          </TabsList>
          <TabsContent value="structured">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 overflow-auto">
              <AnimatePresence>
                {Object.entries(filterPackageJson(packageJson))
                  .filter(([key]) =>
                    key.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(([key, value]) => (
                    <motion.div
                      key={key}
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {highlightSearchTerm(key)}:
                      </span>{" "}
                      {renderValue(value)}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="raw">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(filterPackageJson(packageJson), null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="tree">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 overflow-auto">
              {dependencyTree && renderDependencyTree(dependencyTree)}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-dependencies-footer"
            checked={showDependencies}
            onCheckedChange={setShowDependencies}
            aria-label="切换依赖项显示"
          />
          <Label htmlFor="show-dependencies-footer">显示依赖项</Label>
        </div>
        <Button onClick={copyToClipboard}>
          {copied ? (
            <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="mr-2 h-4 w-4" />
          )}
          {copied ? "已复制!" : "复制到剪贴板"}
        </Button>
      </CardFooter>
    </Card>
  );
}
