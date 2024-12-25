import React, { useState, useEffect, useCallback } from "react";
import { diffLines, diffWords, Change } from "diff";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

interface FileDiffProps {
  oldText: string;
  newText: string;
  language: string;
  viewMode: "inline" | "split";
  ignoreWhitespace: boolean;
  wordDiff: boolean;
  foldUnchanged: boolean;
}

export const FileDiff: React.FC<FileDiffProps> = ({
  oldText,
  newText,
  language,
  viewMode,
  ignoreWhitespace,
  wordDiff,
  foldUnchanged,
}) => {
  const [diff, setDiff] = useState<Change[]>([]);

  const computeDiff = useCallback(() => {
    const options = { ignoreWhitespace };
    const diffFunc = wordDiff ? diffWords : diffLines;
    return diffFunc(oldText, newText, options);
  }, [oldText, newText, ignoreWhitespace, wordDiff]);

  useEffect(() => {
    setDiff(computeDiff());
  }, [computeDiff]);

  useEffect(() => {
    Prism.highlightAll();
  }, [diff, viewMode, language]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const text = diff
      .map((part) => {
        const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
        return prefix + part.value;
      })
      .join("\n");
    doc.text(text, 10, 10);
    doc.save("diff.pdf");
  };

  const renderDiffContent = (part: Change, index: number) => {
    const color = part.added
      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
      : part.removed
      ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
      : "text-gray-800 dark:text-gray-200";

    return (
      <div
        key={index}
        className={`${color} transition-colors duration-300 ease-in-out`}
      >
        <span className="select-none w-8 inline-block text-gray-500 dark:text-gray-400">
          {index + 1}
        </span>
        <span className="select-none w-4 inline-block">
          {part.added ? "+" : part.removed ? "-" : " "}
        </span>
        <code className={`language-${language}`}>{part.value}</code>
      </div>
    );
  };

  const renderInlineDiff = () => (
    <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
      {diff.map((part, index) => {
        if (foldUnchanged && !part.added && !part.removed) {
          return index === 0 || index === diff.length - 1
            ? renderDiffContent(part, index)
            : null;
        }
        return renderDiffContent(part, index);
      })}
    </pre>
  );

  const renderSplitDiff = () => (
    <div className="grid grid-cols-2 gap-4">
      <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        {diff.map((part, index) => {
          if (foldUnchanged && !part.removed) return null;
          return (
            <div
              key={`old-${index}`}
              className={
                part.removed
                  ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                  : "text-gray-800 dark:text-gray-200"
              }
            >
              <span className="select-none w-8 inline-block text-gray-500 dark:text-gray-400">
                {index + 1}
              </span>
              <span className="select-none w-4 inline-block">
                {part.removed ? "-" : " "}
              </span>
              <code className={`language-${language}`}>
                {part.removed ? part.value : "\n"}
              </code>
            </div>
          );
        })}
      </pre>
      <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        {diff.map((part, index) => {
          if (foldUnchanged && !part.added) return null;
          return (
            <div
              key={`new-${index}`}
              className={
                part.added
                  ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                  : "text-gray-800 dark:text-gray-200"
              }
            >
              <span className="select-none w-8 inline-block text-gray-500 dark:text-gray-400">
                {index + 1}
              </span>
              <span className="select-none w-4 inline-block">
                {part.added ? "+" : " "}
              </span>
              <code className={`language-${language}`}>
                {part.added ? part.value : "\n"}
              </code>
            </div>
          );
        })}
      </pre>
    </div>
  );

  return (
    <div className="transition-all duration-300 ease-in-out">
      <Button onClick={exportToPDF} variant="default" className="mb-4">
        Export to PDF
      </Button>
      {viewMode === "inline" ? renderInlineDiff() : renderSplitDiff()}
    </div>
  );
};
