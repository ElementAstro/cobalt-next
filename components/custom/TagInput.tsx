"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TagInputProps = {
  tags: string[];
  maxTags?: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  allowDuplicates?: boolean;
  validateTag?: (tag: string) => boolean;
  customBadgeStyles?: React.CSSProperties;
  customInputStyles?: React.CSSProperties;
  animationDuration?: number;
  onExceedMaxTags?: () => void;
  className?: string;
};

export function TagInput({
  tags,
  maxTags = Infinity,
  minLength = 1,
  maxLength = 20,
  placeholder = "添加标签...",
  readOnly = false,
  disabled = false,
  allowDuplicates = false,
  validateTag,
  customBadgeStyles = {},
  customInputStyles = {},
  animationDuration = 0.3,
  onExceedMaxTags,
  className = "",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [internalTags, setInternalTags] = useState(tags);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [internalTags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      e.preventDefault();
      addTag(input.trim());
    } else if (e.key === "Backspace" && !input && internalTags.length > 0) {
      removeTag(internalTags[internalTags.length - 1]);
    }
  };

  const addTag = useCallback(
    (tag: string) => {
      if (
        tag.length >= minLength &&
        tag.length <= maxLength &&
        (allowDuplicates || !internalTags.includes(tag)) &&
        (!validateTag || validateTag(tag))
      ) {
        if (internalTags.length < maxTags) {
          setInternalTags([...internalTags, tag]);
          setInput("");
        } else if (onExceedMaxTags) {
          onExceedMaxTags();
        }
      }
    },
    [
      internalTags,
      allowDuplicates,
      maxTags,
      minLength,
      maxLength,
      validateTag,
      onExceedMaxTags,
    ]
  );

  const removeTag = useCallback(
    (tag: string) => {
      setInternalTags(internalTags.filter((t) => t !== tag));
    },
    [internalTags]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animationDuration }}
      className={`p-4 bg-gray-900 text-white rounded-lg ${className}`}
    >
      <div className="flex flex-wrap gap-2 mb-2">
        <AnimatePresence>
          {internalTags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: animationDuration }}
            >
              <Badge
                variant="secondary"
                className="text-sm flex items-center"
                style={customBadgeStyles}
              >
                {tag}
                {!readOnly && !disabled && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X size={14} />
                  </button>
                )}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {!readOnly && (
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-800 text-white"
          style={customInputStyles}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
    </motion.div>
  );
}
