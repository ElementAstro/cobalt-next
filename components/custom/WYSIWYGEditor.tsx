import React, { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Type,
  PaintBucket,
  Undo,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Quote,
  Minus,
  Table,
  FileImage,
  Paperclip,
} from "lucide-react";

interface EditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  customCommands?: Record<string, () => void>;
  customStyles?: React.CSSProperties;
  onImageUpload?: (file: File) => Promise<string>;
  onFileUpload?: (file: File) => Promise<string>;
}

const WYSIWYGEditor: React.FC<EditorProps> = ({
  initialValue = "",
  onChange,
  customCommands = {},
  customStyles = {},
  onImageUpload,
  onFileUpload,
}) => {
  const [content, setContent] = useState(initialValue);
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = DOMPurify.sanitize(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    }
  };

  const execCommand = (
    command: string,
    value: string | undefined = undefined
  ) => {
    document.execCommand(command, false, value);
    handleChange();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const defaultCommands = {
    insertImage: async () => {
      if (onImageUpload) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const url = await onImageUpload(file);
            execCommand("insertImage", url);
          }
        };
        input.click();
      } else {
        const url = prompt("Enter image URL:");
        if (url) {
          execCommand("insertImage", url);
        }
      }
    },
    createLink: () => {
      const url = prompt("Enter link URL:");
      if (url) {
        execCommand("createLink", url);
      }
    },
    setFontSize: (size: number) => {
      setFontSize(size);
      document.execCommand("fontSize", false, "7");
      const fontElements = document.getElementsByTagName("font");
      for (let i = 0, len = fontElements.length; i < len; ++i) {
        if (fontElements[i].size === "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = `${size}px`;
        }
      }
    },
    setFontColor: (color: string) => {
      setFontColor(color);
      execCommand("foreColor", color);
    },
    setBackgroundColor: (color: string) => {
      setBackgroundColor(color);
      execCommand("hiliteColor", color);
    },
    toggleFullscreen: () => {
      setIsFullscreen(!isFullscreen);
    },
    insertTable: () => {
      const rows = prompt("Enter number of rows:");
      const cols = prompt("Enter number of columns:");
      if (rows && cols) {
        let table = '<table border="1" style="border-collapse: collapse;">';
        for (let i = 0; i < parseInt(rows); i++) {
          table += "<tr>";
          for (let j = 0; j < parseInt(cols); j++) {
            table += '<td style="padding: 5px;">Cell</td>';
          }
          table += "</tr>";
        }
        table += "</table>";
        execCommand("insertHTML", table);
      }
    },
    uploadFile: async () => {
      if (onFileUpload) {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const url = await onFileUpload(file);
            const fileName = file.name;
            const fileLink = `<a href="${url}" target="_blank">${fileName}</a>`;
            execCommand("insertHTML", fileLink);
          }
        };
        input.click();
      }
    },
  };

  const allCommands = { ...defaultCommands, ...customCommands };

  const toolbarItems = [
    { icon: <Bold size={18} />, command: "bold", tooltip: "Bold" },
    { icon: <Italic size={18} />, command: "italic", tooltip: "Italic" },
    {
      icon: <Underline size={18} />,
      command: "underline",
      tooltip: "Underline",
    },
    {
      icon: <Strikethrough size={18} />,
      command: "strikeThrough",
      tooltip: "Strikethrough",
    },
    {
      icon: <Subscript size={18} />,
      command: "subscript",
      tooltip: "Subscript",
    },
    {
      icon: <Superscript size={18} />,
      command: "superscript",
      tooltip: "Superscript",
    },
    {
      icon: <AlignLeft size={18} />,
      command: "justifyLeft",
      tooltip: "Align Left",
    },
    {
      icon: <AlignCenter size={18} />,
      command: "justifyCenter",
      tooltip: "Align Center",
    },
    {
      icon: <AlignRight size={18} />,
      command: "justifyRight",
      tooltip: "Align Right",
    },
    {
      icon: <AlignJustify size={18} />,
      command: "justifyFull",
      tooltip: "Justify",
    },
    {
      icon: <List size={18} />,
      command: "insertUnorderedList",
      tooltip: "Unordered List",
    },
    {
      icon: <ListOrdered size={18} />,
      command: "insertOrderedList",
      tooltip: "Ordered List",
    },
    {
      icon: <Link size={18} />,
      command: "createLink",
      tooltip: "Insert Link",
      custom: true,
    },
    {
      icon: <Image size={18} />,
      command: "insertImage",
      tooltip: "Insert Image",
      custom: true,
    },
    {
      icon: <Code size={18} />,
      command: "formatBlock",
      value: "<pre>",
      tooltip: "Code Block",
    },
    {
      icon: <Quote size={18} />,
      command: "formatBlock",
      value: "<blockquote>",
      tooltip: "Quote",
    },
    {
      icon: <Minus size={18} />,
      command: "insertHorizontalRule",
      tooltip: "Horizontal Rule",
    },
    {
      icon: <Table size={18} />,
      command: "insertTable",
      tooltip: "Insert Table",
      custom: true,
    },
    {
      icon: <Paperclip size={18} />,
      command: "uploadFile",
      tooltip: "Upload File",
      custom: true,
    },
    { icon: <Undo size={18} />, command: "undo", tooltip: "Undo" },
    { icon: <Redo size={18} />, command: "redo", tooltip: "Redo" },
  ];

  return (
    <div
      className={cn(
        "border border-gray-300 rounded-md transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 bg-white"
      )}
      style={customStyles}
    >
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="w-full bg-gray-100 border-b border-gray-300">
          <TabsTrigger value="edit" className="flex-1">
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="p-0">
          <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-300">
            {toolbarItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() =>
                  item.custom && item.command in allCommands
                      ? allCommands[item.command as keyof typeof allCommands](
                          item.value || undefined
                        )
                      : execCommand(item.command, item.value)
                }
                title={item.tooltip}
                className="transition-all duration-200 hover:bg-gray-200"
              >
                {item.icon}
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Type size={18} />
                  Headings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["p", "h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onSelect={() => execCommand("formatBlock", `<${tag}>`)}
                  >
                    {tag.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Type size={18} />
                  Font Size
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={fontSize}
                    onChange={(e) =>
                      allCommands.setFontSize(Number(e.target.value))
                    }
                    className="w-16"
                  />
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => allCommands.setFontSize(value[0])}
                  max={72}
                  step={1}
                  className="mt-2"
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <PaintBucket size={18} />
                  Colors
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fontColor">Font Color:</Label>
                    <Input
                      id="fontColor"
                      type="color"
                      value={fontColor}
                      onChange={(e) => allCommands.setFontColor(e.target.value)}
                      className="w-16 h-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bgColor">Background Color:</Label>
                    <Input
                      id="bgColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) =>
                        allCommands.setBackgroundColor(e.target.value)
                      }
                      className="w-16 h-8"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="sm"
              onClick={allCommands.toggleFullscreen}
              className="ml-auto"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
          <div
            ref={editorRef}
            className={cn(
              "p-4 min-h-[200px] focus:outline-none transition-all duration-300",
              "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
            )}
            contentEditable
            onInput={handleChange}
            onPaste={handlePaste}
            style={{ fontSize: `${fontSize}px` }}
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4">
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WYSIWYGEditor;
