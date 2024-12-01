"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JsonNode from "./json-node";
import AddNodeDialog from "./add-node-dialog";
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
