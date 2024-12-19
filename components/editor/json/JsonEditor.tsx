"use client";

import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JsonNode from "./JsonNode";
import AddNodeDialog from "./AddNodeDialog";
import {
  parseJson,
  stringifyJson,
  reorderNodes,
  parseInputData,
} from "./json-utils";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JsonEditorProps {
  initialData?: any;
  onChange?: (data: any) => void;
}

export default function JsonEditor({ initialData, onChange }: JsonEditorProps) {
  const [json, setJson] = useState<any>(
    parseInputData(initialData) || { example: "value" }
  );
  const [isLowCodeMode, setIsLowCodeMode] = useState(true);
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [highlightedJson, setHighlightedJson] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setHistory((prev) => [...prev.slice(0, historyIndex), json]);
    setHistoryIndex((prev) => prev + 1);
  }, [json]);

  const undo = useCallback(() => {
    if (historyIndex > 1) {
      setHistoryIndex(historyIndex - 1);
      setJson(history[historyIndex - 2]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length) {
      setJson(history[historyIndex]);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const handleExport = () => {
    const blob = new Blob([stringifyJson(json)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedJson = parseJson(e.target?.result as string);
          setJson(importedJson);
        } catch (error) {
          console.error("导入的JSON无效:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const highlighted = Prism.highlight(
      stringifyJson(json),
      Prism.languages.json,
      "json"
    );
    setHighlightedJson(highlighted);
    if (onChange) {
      onChange(json);
    }
  }, [json, onChange]);

  const handleJsonChange = (newJson: string) => {
    try {
      const parsedJson = parseJson(newJson);
      setJson(parsedJson);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  const handleNodeChange = (path: string[], value: any) => {
    setJson((prevJson: any) => {
      const newJson = { ...prevJson };
      let current = newJson;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newJson;
    });
  };

  const handleAddNode = (key: string, value: any) => {
    setJson((prevJson: any) => {
      const newJson = { ...prevJson };
      let current = newJson;
      for (const pathPart of currentPath) {
        current = current[pathPart];
      }
      current[key] = value;
      return newJson;
    });
    setIsAddNodeDialogOpen(false);
  };

  const handleDeleteNode = (path: string[]) => {
    setJson((prevJson: any) => {
      const newJson = { ...prevJson };
      let current = newJson;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      delete current[path[path.length - 1]];
      return newJson;
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourcePath = result.source.droppableId.split(",");
    const destinationPath = result.destination.droppableId.split(",");

    setJson((prevJson: any) => {
      return reorderNodes(
        prevJson,
        sourcePath,
        destinationPath,
        result.source.index,
        result.destination.index
      );
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className={`${isDarkMode ? "dark" : ""} w-full px-2 md:px-4 py-2`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full bg-card shadow-lg">
        <CardHeader className="space-y-4">
          <CardTitle className="flex flex-col gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  JSON Editor
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10">
                        <span className="text-sm">暗色模式</span>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>切换暗色模式</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10">
                        <span className="text-sm">低代码模式</span>
                        <Switch
                          checked={isLowCodeMode}
                          onCheckedChange={setIsLowCodeMode}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>切换编辑模式</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-wrap gap-2"
            >
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  onClick={undo}
                  disabled={historyIndex <= 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> 撤销
                </Button>
                <Button
                  variant="outline"
                  onClick={redo}
                  disabled={historyIndex >= history.length}
                >
                  重做 <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="flex space-x-1">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-1" /> 导出
                </Button>
                <label htmlFor="import-json">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-1" /> 导入
                    </span>
                  </Button>
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-json"
                />
              </div>
            </motion.div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none sm:rounded-lg">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:bg-primary"
              >
                编辑器
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-primary"
              >
                预览
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="editor" className="mt-0">
                <AnimatePresence mode="wait">
                  {isLowCodeMode ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <ScrollArea className="h-96 md:h-[600px]">
                          <Droppable droppableId="root">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                <JsonNode
                                  data={json}
                                  path={[]}
                                  onchange={handleNodeChange}
                                  ondelete={handleDeleteNode}
                                  onAddChild={(path) => {
                                    setCurrentPath(path);
                                    setIsAddNodeDialogOpen(true);
                                  }}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </ScrollArea>
                      </DragDropContext>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Textarea
                        value={stringifyJson(json)}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        className="h-96 md:h-[600px] font-mono dark:bg-gray-800 dark:text-gray-100"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={() => {
                      setCurrentPath([]);
                      setIsAddNodeDialogOpen(true);
                    }}
                    className="mt-4"
                  >
                    添加根节点
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ScrollArea className="h-96 md:h-[600px] bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-100">
                      <code
                        dangerouslySetInnerHTML={{ __html: highlightedJson }}
                      />
                    </pre>
                  </ScrollArea>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        <AddNodeDialog
          isOpen={isAddNodeDialogOpen}
          onClose={() => setIsAddNodeDialogOpen(false)}
          onAdd={handleAddNode}
        />
      </Card>
    </motion.div>
  );
}
