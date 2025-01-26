import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "./shell-editor";
import CustomOptions from "./shell-options";
import TemplateSelector from "./template-selector";
import { Button } from "@/components/ui/button";
import { X, Save, Copy, Trash, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { useEditorStore } from "@/store/useScriptStore";

interface ShellScriptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onSave?: (code: string) => void;
}

const ShellScriptEditorModal: React.FC<ShellScriptEditorModalProps> = ({
  isOpen,
  onClose,
  initialCode = "",
  onSave,
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState(initialCode);
  const editorOptions = useEditorStore((state) => ({
    theme: state.theme,
    fontSize: state.fontSize,
    tabSize: state.tabSize,
    wordWrap: state.wordWrap,
    showInvisibles: state.showInvisibles,
    showGutter: state.showGutter,
    highlightActiveLine: state.highlightActiveLine,
    enableLiveAutocompletion: state.enableLiveAutocompletion,
    enableSnippets: state.enableSnippets,
    enableFormat: state.enableFormat,
  }));
  const toggleTheme = useEditorStore((state) => state.toggleTheme);
  const setOptions = useEditorStore((state) => state.setOptions);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    const handlers = ["resize", "orientationchange"];
    handlers.forEach((event) =>
      window.addEventListener(event, checkOrientation)
    );

    return () => {
      handlers.forEach((event) =>
        window.removeEventListener(event, checkOrientation)
      );
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast({
      description: "代码已复制到剪贴板",
      variant: "default",
    });
  };

  const handleSave = () => {
    onSave?.(code);
    toast({
      description: "代码已保存",
      variant: "default",
    });
  };

  const handleClear = () => {
    setCode("");
    toast({
      description: "编辑器已清空",
      variant: "default",
    });
  };

  const handleFormat = () => {
    const formattedCode = formatCode(code);
    setCode(formattedCode);
    toast({
      description: "代码已格式化",
      variant: "default",
    });
  };

  const formatCode = (code: string) => {
    return code
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { scale: 0.95, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-1 z-50"
        >
          <motion.div
            variants={modalVariants}
            className={`bg-gray-900 rounded-lg shadow-xl w-full h-[98vh] flex flex-col overflow-hidden`}
          >
            {/* Header - 更紧凑的头部 */}
            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">
                Shell Script 编辑器
              </h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="复制代码"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  aria-label="保存代码"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFormat}
                  aria-label="格式化代码"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClear}
                  aria-label="清空代码"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="切换主题"
                >
                  {editorOptions.theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="关闭编辑器"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content - 优化横屏布局 */}
            <div
              className={`flex-grow flex ${
                isLandscape ? "flex-row" : "flex-col"
              } overflow-hidden`}
            >
              <div
                className={`${
                  isLandscape ? "w-1/4 min-w-[250px]" : "h-[30vh]"
                } border-r border-gray-700 overflow-y-auto bg-gray-800`}
              >
                <CustomOptions
                  options={{
                    theme:
                      editorOptions.theme === "dark"
                        ? "monokai"
                        : editorOptions.theme,
                    fontSize: editorOptions.fontSize,
                    fontFamily: "monospace",
                    tabSize: editorOptions.tabSize,
                    wordWrap: editorOptions.wordWrap,
                    showInvisibles: editorOptions.showInvisibles,
                    showGutter: editorOptions.showGutter,
                    highlightActiveLine: editorOptions.highlightActiveLine,
                    enableLiveAutocompletion:
                      editorOptions.enableLiveAutocompletion,
                    enableSnippets: editorOptions.enableSnippets,
                    enableFormat: editorOptions.enableFormat,
                    enableHoverHighlight: false,
                    enableAutoSave: false,
                  }}
                  onChange={(opts) => setOptions(opts)}
                />
                <TemplateSelector
                  onInsert={(template) => setCode((prev) => prev + template)}
                />
              </div>
              <div className="flex-grow relative">
                <div className="h-full relative">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    options={{
                      theme:
                        editorOptions.theme === "dark" ? "monokai" : "github",
                      fontSize: editorOptions.fontSize,
                      tabSize: editorOptions.tabSize,
                      wordWrap: editorOptions.wordWrap as "off" | "on",
                      showInvisibles: editorOptions.showInvisibles,
                      showGutter: editorOptions.showGutter,
                      highlightActiveLine: editorOptions.highlightActiveLine,
                      enableLiveAutocompletion:
                        editorOptions.enableLiveAutocompletion,
                      enableSnippets: editorOptions.enableSnippets,
                    }}
                  />
                </div>
                {editorOptions.enableFormat && (
                  <div className="p-2 bg-gray-100 dark:bg-gray-900 text-right border-t dark:border-gray-800">
                    <Button
                      onClick={handleFormat}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      格式化代码
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShellScriptEditorModal;
