import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
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
}) => {
  return (
    <AceEditor
      mode="sh"
      theme={options.theme}
      onChange={onChange}
      value={value}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        ...options,
        enableBasicAutocompletion: true,
        fontFamily: "monospace",
        useWorker: false,
      }}
      style={{
        width: "100%",
        height: "100%",
        transition: "all 0.2s ease",
      }}
      fontSize={options.fontSize}
    />
  );
};

export default CodeEditor;
