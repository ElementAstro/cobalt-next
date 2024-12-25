"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Folder, Clock, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathAutocomplete } from "@/hooks/use-path-autocomplete";
import { usePathValidation } from "@/hooks/use-path-validation";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PathInputProps, PathType } from "@/types/custom/path-input";

export function PathInput({
  onValidPath,
  customPaths = [],
  initialPathType = "unix",
  allowRelativePaths = false,
  maxHistoryItems = 5,
  customSchemas,
  customIcons,
  labels = {
    input: "输入路径",
    allowRelative: "允许相对路径",
    pathType: "选择路径类型",
    unix: "Unix 路径",
    windows: "Windows 路径",
  },
  className = "",
  inputClassName = "",
  buttonClassName = "",
  popoverClassName = "",
}: PathInputProps) {
  const [path, setPath] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [pathType, setPathType] = useState<PathType>(initialPathType);
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestions = usePathAutocomplete(path, customPaths);
  const { isValid, error } = usePathValidation(
    path,
    pathType,
    allowRelativePaths,
    customSchemas
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
    setShowAutocomplete(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPath(suggestion);
    setShowAutocomplete(false);
  };

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedPath = files[0].webkitRelativePath || files[0].name;
      setPath(
        pathType === "windows"
          ? selectedPath.replace(/\//g, "\\")
          : selectedPath
      );
    }
  };

  const addToHistory = (newPath: string) => {
    if (!pathHistory.includes(newPath)) {
      setPathHistory((prev) => [newPath, ...prev].slice(0, maxHistoryItems));
    }
  };

  const renderPathPreview = () => {
    const parts = path.split(pathType === "unix" ? "/" : "\\");
    return (
      <div className="flex flex-wrap gap-1">
        {parts.map((part, index) => (
          <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
            {part}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full max-w-md mx-auto space-y-4 ${className}`}>
      <Label htmlFor="path-input">{labels.input}</Label>
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            id="path-input"
            type="text"
            placeholder={
              pathType === "unix"
                ? "/path/to/resource"
                : "C:\\path\\to\\resource"
            }
            value={path}
            onChange={handleInputChange}
            onFocus={() => setShowAutocomplete(true)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            className={`pr-10 ${
              isValid ? "border-green-500" : error ? "border-red-500" : ""
            } ${inputClassName}`}
          />
          <AnimatePresence>
            {path && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                {isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <Button
          onClick={handleFolderSelect}
          aria-label="选择文件夹"
          className={buttonClassName}
        >
          {customIcons?.folder || <Folder className="w-5 h-5" />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-label="查看路径历史"
              className={buttonClassName}
            >
              {customIcons?.history || <Clock className="w-5 h-5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-60 ${popoverClassName}`}>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {pathHistory.map((historyPath, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => setPath(historyPath)}
                  >
                    {historyPath}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-label="预览路径"
              className={buttonClassName}
            >
              {customIcons?.preview || <Eye className="w-5 h-5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-60 ${popoverClassName}`}>
            {renderPathPreview()}
          </PopoverContent>
        </Popover>
      </div>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        //@ts-ignore
        webkitdirectory="true"
        directory="true"
        className="hidden"
      />
      <AnimatePresence>
        {showAutocomplete && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-relative"
            checked={allowRelativePaths}
            onCheckedChange={(checked) => {
              if (onValidPath && isValid) {
                onValidPath(path);
                addToHistory(path);
              }
            }}
          />
          <Label htmlFor="allow-relative">{labels.allowRelative}</Label>
        </div>
        <Select
          value={pathType}
          onValueChange={(value: PathType) => setPathType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={labels.pathType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unix">{labels.unix}</SelectItem>
            <SelectItem value="windows">{labels.windows}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
