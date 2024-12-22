"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Undo,
  Redo,
  Search,
  Settings,
  Eye,
  GripVertical,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FileSaver from "file-saver";

interface INIKey {
  id: string;
  key: string;
  value: string;
  comment?: string;
}

interface INISection {
  id: string;
  name: string;
  keys: INIKey[];
  comment?: string;
}

interface INIEditorProps {
  initialSections?: INISection[];
  onSave?: (sections: INISection[]) => void;
}

export default function INIEditor({
  initialSections = [],
  onSave,
}: INIEditorProps) {
  const [sections, setSections] = useState<INISection[]>(initialSections);
  const [iniContent, setIniContent] = useState("");
  const [history, setHistory] = useState<INISection[][]>([initialSections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("edit");
  const [settings, setSettings] = useState({
    showComments: true,
    indentSize: 2,
    quoteValues: false,
    sortKeys: false,
  });

  const addToHistory = useCallback(
    (newSections: INISection[]) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newSections]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const updateSections = useCallback(
    (newSections: INISection[]) => {
      setSections(newSections);
      addToHistory(newSections);
      onSave?.(newSections);
    },
    [addToHistory, onSave]
  );

  const addSection = () => {
    const newSection: INISection = {
      id: Date.now().toString(),
      name: "",
      keys: [],
    };
    updateSections([...sections, newSection]);
  };

  const addKey = (sectionIndex: number) => {
    const newSections = [...sections];
    const newKey: INIKey = { id: Date.now().toString(), key: "", value: "" };
    newSections[sectionIndex].keys.push(newKey);
    updateSections(newSections);
  };

  const updateSection = (index: number, name: string, comment?: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], name, comment };
    updateSections(newSections);
  };

  const updateKey = (
    sectionIndex: number,
    keyIndex: number,
    key: string,
    value: string,
    comment?: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].keys[keyIndex] = {
      ...newSections[sectionIndex].keys[keyIndex],
      key,
      value,
      comment,
    };
    updateSections(newSections);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    updateSections(newSections);
  };

  const removeKey = (sectionIndex: number, keyIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].keys = newSections[sectionIndex].keys.filter(
      (_, i) => i !== keyIndex
    );
    updateSections(newSections);
  };

  const generateINI = useCallback(() => {
    let ini = "";
    const indent = " ".repeat(settings.indentSize);
    sections.forEach((section) => {
      if (settings.showComments && section.comment) {
        ini += `; ${section.comment}\n`;
      }
      ini += `[${section.name}]\n`;
      let keys = section.keys;
      if (settings.sortKeys) {
        keys = [...keys].sort((a, b) => a.key.localeCompare(b.key));
      }
      keys.forEach((keyValue) => {
        if (settings.showComments && keyValue.comment) {
          ini += `${indent}; ${keyValue.comment}\n`;
        }
        const value = settings.quoteValues
          ? `"${keyValue.value}"`
          : keyValue.value;
        ini += `${indent}${keyValue.key}=${value}\n`;
      });
      ini += "\n";
    });
    setIniContent(ini.trim());
  }, [sections, settings]);

  useEffect(() => {
    generateINI();
  }, [sections, settings, generateINI]);

  const importINI = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split("\n");
        let currentSection: INISection | null = null;
        const newSections: INISection[] = [];

        lines.forEach((line) => {
          line = line.trim();
          if (line.startsWith("[") && line.endsWith("]")) {
            if (currentSection) {
              newSections.push(currentSection);
            }
            currentSection = {
              id: Date.now().toString(),
              name: line.slice(1, -1),
              keys: [],
            };
          } else if (line.startsWith(";")) {
            if (currentSection) {
              currentSection.comment =
                (currentSection.comment || "") + line.slice(1).trim() + "\n";
            }
          } else if (line.includes("=")) {
            const [key, ...valueParts] = line.split("=");
            const value = valueParts.join("=").trim();
            if (currentSection) {
              currentSection.keys.push({
                id: Date.now().toString(),
                key: key.trim(),
                value: value.replace(/^"(.*)"$/, "$1"),
              });
            }
          }
        });

        if (currentSection) {
          newSections.push(currentSection);
        }

        updateSections(newSections);
      };
      reader.readAsText(file);
    }
  };

  const exportINI = () => {
    const blob = new Blob([iniContent], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "config.ini");
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newSections = Array.from(sections);
    const [reorderedItem] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedItem);

    updateSections(newSections);
  };

  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.keys.some(
        (key) =>
          key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          key.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">INI Editor</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div className="flex items-center w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>
        <TabsContent value="edit">
          <div className="flex flex-wrap gap-2 mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={addSection} variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new section to the INI file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="import-ini">
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" /> Import INI
                    </Button>
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import an existing INI file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              id="import-ini"
              type="file"
              accept=".ini"
              onChange={importINI}
              className="hidden"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={exportINI} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export INI
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export the current INI content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    variant="outline"
                  >
                    <Undo className="mr-2 h-4 w-4" /> Undo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo the last action</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    variant="outline"
                  >
                    <Redo className="mr-2 h-4 w-4" /> Redo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo the last undone action</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredSections.map((section, sectionIndex) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={sectionIndex}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-6 border-l-4 border-blue-500 transition-all duration-200 hover:shadow-md"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center mb-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 cursor-move"
                                >
                                  <GripVertical className="h-5 w-5 text-gray-500" />
                                </div>
                                <Input
                                  value={section.name}
                                  onChange={(e) =>
                                    updateSection(
                                      sectionIndex,
                                      e.target.value,
                                      section.comment
                                    )
                                  }
                                  placeholder="Section Name"
                                  className="flex-grow mr-2"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeSection(sectionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {settings.showComments && (
                                <Input
                                  value={section.comment || ""}
                                  onChange={(e) =>
                                    updateSection(
                                      sectionIndex,
                                      section.name,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Section Comment"
                                  className="mb-4"
                                />
                              )}
                              {section.keys.map((keyValue, keyIndex) => (
                                <div
                                  key={keyValue.id}
                                  className="flex flex-col sm:flex-row items-start sm:items-center mb-4"
                                >
                                  <Input
                                    value={keyValue.key}
                                    onChange={(e) =>
                                      updateKey(
                                        sectionIndex,
                                        keyIndex,
                                        e.target.value,
                                        keyValue.value,
                                        keyValue.comment
                                      )
                                    }
                                    placeholder="Key"
                                    className="flex-grow mr-2 mb-2 sm:mb-0"
                                  />
                                  <Input
                                    value={keyValue.value}
                                    onChange={(e) =>
                                      updateKey(
                                        sectionIndex,
                                        keyIndex,
                                        keyValue.key,
                                        e.target.value,
                                        keyValue.comment
                                      )
                                    }
                                    placeholder="Value"
                                    className="flex-grow mr-2 mb-2 sm:mb-0"
                                  />
                                  {settings.showComments && (
                                    <Input
                                      value={keyValue.comment || ""}
                                      onChange={(e) =>
                                        updateKey(
                                          sectionIndex,
                                          keyIndex,
                                          keyValue.key,
                                          keyValue.value,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Comment"
                                      className="flex-grow mr-2 mb-2 sm:mb-0"
                                    />
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      removeKey(sectionIndex, keyIndex)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                onClick={() => addKey(sectionIndex)}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                <Plus className="mr-2 h-4 w-4" /> Add Key
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent>
              <Textarea
                value={iniContent}
                readOnly
                className="w-full h-[calc(100vh-250px)] font-mono text-sm"
                placeholder="Generated INI content will appear here"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-comments" className="text-base">
                  Show Comments
                </Label>
                <Switch
                  id="show-comments"
                  checked={settings.showComments}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showComments: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="indent-size" className="text-base">
                  Indent Size
                </Label>
                <Select
                  value={settings.indentSize.toString()}
                  onValueChange={(value) =>
                    setSettings({ ...settings, indentSize: parseInt(value) })
                  }
                >
                  <SelectTrigger id="indent-size" className="w-[180px]">
                    <SelectValue placeholder="Select indent size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="quote-values" className="text-base">
                  Quote Values
                </Label>
                <Switch
                  id="quote-values"
                  checked={settings.quoteValues}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, quoteValues: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sort-keys" className="text-base">
                  Sort Keys Alphabetically
                </Label>
                <Switch
                  id="sort-keys"
                  checked={settings.sortKeys}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, sortKeys: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
