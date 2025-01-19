import React, { useCallback, useMemo } from "react";
import AceEditor from "react-ace";
import { Braces, Search } from "lucide-react";

import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-keybinding_menu";
import "ace-builds/src-noconflict/ext-modelist";
import "ace-builds/src-noconflict/ext-statusbar";
import "ace-builds/src-noconflict/ext-settings_menu";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: Error) => void;
  options: {
    theme: "monokai" | "github";
    fontSize: number;
    tabSize: number;
    wordWrap: "off" | "on";
    showInvisibles: boolean;
    showGutter: boolean;
    highlightActiveLine: boolean;
    enableLiveAutocompletion: boolean;
    enableSnippets: boolean;
  };
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  options,
  onError,
}) => {
  const handleEditorLoad = useCallback(
    (editor: any) => {
      // 配置多光标支持
      editor.commands.addCommand({
        name: "addCursorToNextLine",
        bindKey: { win: "Ctrl-Alt-Down", mac: "Cmd-Alt-Down" },
        exec: editor.addCursorToNextLine.bind(editor),
      });

      editor.commands.addCommand({
        name: "addCursorToPrevLine",
        bindKey: { win: "Ctrl-Alt-Up", mac: "Cmd-Alt-Up" },
        exec: editor.addCursorToPrevLine.bind(editor),
      });

      // 错误处理
      editor.on("error", (error: Error) => {
        onError?.(error);
      });
    },
    [onError]
  );

  const editorOptions = useMemo(
    () => ({
      ...options,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      fontFamily: "monospace",
      useWorker: false,
      showLineNumbers: true,
      showPrintMargin: false,
      wrapBehavioursEnabled: true,
      enableMultiselect: true, // 启用多光标
      behavioursEnabled: true,
      autoScrollEditorIntoView: true,
      keyboardHandler: "vscode",
      accessibility: {
        screenReaderMode: true,
        ariaLabel: "Shell script editor",
      },
    }),
    [options]
  );

  return (
    <div
      className="relative h-full w-full"
      role="region"
      aria-label="Code editor"
    >
      <AceEditor
        mode="sh"
        theme={options.theme}
        onChange={onChange}
        value={value}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        setOptions={editorOptions}
        onLoad={handleEditorLoad}
        style={{
          width: "100%",
          height: "100%",
          transition: "all 0.2s ease",
        }}
        fontSize={options.fontSize}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <button
          className="p-1 rounded hover:bg-opacity-10 hover:bg-white transition-all"
          aria-label="Format code"
        >
          <Braces className="w-5 h-5" />
        </button>
        <button
          className="p-1 rounded hover:bg-opacity-10 hover:bg-white transition-all"
          aria-label="Search in code"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
