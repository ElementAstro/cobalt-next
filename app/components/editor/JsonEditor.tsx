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
import "prismjs/themes/prism.css";
import "prismjs/components/prism-json";

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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>JSON Editor</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Low Code Mode</span>
            <Switch
              checked={isLowCodeMode}
              onCheckedChange={setIsLowCodeMode}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={undo} disabled={historyIndex <= 1}>
              撤销
            </Button>
            <Button onClick={redo} disabled={historyIndex >= history.length}>
              重做
            </Button>
            <Button onClick={handleExport}>导出JSON</Button>
            <input type="file" accept=".json" onChange={handleImport} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            {isLowCodeMode ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <ScrollArea className="h-[400px] md:h-[600px]">
                  <Droppable droppableId="root">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
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
            ) : (
              <Textarea
                value={stringifyJson(json)}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="h-[400px] md:h-[600px] font-mono"
              />
            )}
            <Button
              onClick={() => {
                setCurrentPath([]);
                setIsAddNodeDialogOpen(true);
              }}
              className="mt-4"
            >
              Add Root Node
            </Button>
          </TabsContent>
          <TabsContent value="preview">
            <ScrollArea className="h-[400px] md:h-[600px]">
              <pre className="whitespace-pre-wrap">
                <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <AddNodeDialog
        isOpen={isAddNodeDialogOpen}
        onClose={() => setIsAddNodeDialogOpen(false)}
        onAdd={handleAddNode}
      />
    </Card>
  );
}
