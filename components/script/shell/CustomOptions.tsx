import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface EditorOptions {
  theme: "monokai" | "github";
  fontSize: number;
  tabSize: number;
  wordWrap: "off" | "on";
  showInvisibles: boolean;
  showGutter: boolean;
  highlightActiveLine: boolean;
  enableLiveAutocompletion: boolean;
  enableSnippets: boolean;
  enableFormat: boolean;
}

interface CustomOptionsProps {
  options: EditorOptions;
  onChange: (options: EditorOptions) => void;
}

const CustomOptions: React.FC<CustomOptionsProps> = ({ options, onChange }) => {
  const updateOption = <K extends keyof EditorOptions>(
    key: K,
    value: EditorOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="appearance">
        <AccordionTrigger>外观设置</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-select" className="text-sm">
                主题
              </Label>
              <Select
                value={options.theme}
                onValueChange={(value: "monokai" | "github") =>
                  updateOption("theme", value)
                }
              >
                <SelectTrigger id="theme-select" className="w-full">
                  <SelectValue placeholder="选择主题" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monokai">Monokai</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="font-size-slider" className="text-sm">
                字体大小: {options.fontSize}
              </Label>
              <Slider
                id="font-size-slider"
                min={12}
                max={24}
                step={1}
                value={[options.fontSize]}
                onValueChange={(value) => updateOption("fontSize", value[0])}
                className="w-full"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="editor">
        <AccordionTrigger>编辑器设置</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tab-size-select" className="text-sm">
                Tab 大小
              </Label>
              <Select
                value={options.tabSize.toString()}
                onValueChange={(value) =>
                  updateOption("tabSize", parseInt(value))
                }
              >
                <SelectTrigger id="tab-size-select" className="w-full">
                  <SelectValue placeholder="选择 Tab 大小" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 空格</SelectItem>
                  <SelectItem value="4">4 空格</SelectItem>
                  <SelectItem value="8">8 空格</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="word-wrap-select" className="text-sm">
                自动换行
              </Label>
              <Select
                value={options.wordWrap}
                onValueChange={(value: "off" | "on") =>
                  updateOption("wordWrap", value)
                }
              >
                <SelectTrigger id="word-wrap-select" className="w-full">
                  <SelectValue placeholder="选择自动换行" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">关闭</SelectItem>
                  <SelectItem value="on">开启</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-invisibles"
                checked={options.showInvisibles}
                onCheckedChange={(checked) =>
                  updateOption("showInvisibles", checked)
                }
              />
              <Label htmlFor="show-invisibles" className="text-sm">
                显示不可见字符
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="features">
        <AccordionTrigger>功能设置</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-gutter">显示行号</Label>
              <Switch
                id="show-gutter"
                checked={options.showGutter}
                onCheckedChange={(checked) =>
                  updateOption("showGutter", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="highlight-active-line">高亮当前行</Label>
              <Switch
                id="highlight-active-line"
                checked={options.highlightActiveLine}
                onCheckedChange={(checked) =>
                  updateOption("highlightActiveLine", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-live-autocompletion">
                开启实时自动补全
              </Label>
              <Switch
                id="enable-live-autocompletion"
                checked={options.enableLiveAutocompletion}
                onCheckedChange={(checked) =>
                  updateOption("enableLiveAutocompletion", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-snippets">开启代码片段</Label>
              <Switch
                id="enable-snippets"
                checked={options.enableSnippets}
                onCheckedChange={(checked) =>
                  updateOption("enableSnippets", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-format">开启代码格式化</Label>
              <Switch
                id="enable-format"
                checked={options.enableFormat}
                onCheckedChange={(checked) =>
                  updateOption("enableFormat", checked)
                }
              />
            </div>
            {/* ...可以添加更多功能选项... */}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomOptions;
