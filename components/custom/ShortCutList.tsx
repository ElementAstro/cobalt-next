import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/lib/store/chat";
import { Command } from "lucide-react";

interface ShortcutListProps {
  filter: string;
  onSelect: (command: string) => void;
}

export const ShortcutList: React.FC<ShortcutListProps> = ({
  filter,
  onSelect,
}) => {
  const { shortcuts } = useChatStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredShortcuts = shortcuts.filter((shortcut) =>
    shortcut.command.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredShortcuts.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredShortcuts.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredShortcuts.length) % filteredShortcuts.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(filteredShortcuts[selectedIndex].command);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredShortcuts, selectedIndex, onSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {filteredShortcuts.length > 0 && (
        <motion.div
          ref={listRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-0 mb-2 w-full bg-background border rounded-md shadow-lg overflow-hidden max-h-60 overflow-y-auto"
        >
          {filteredShortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group px-4 py-3 hover:bg-muted cursor-pointer transition-colors duration-200 ease-in-out ${
                index === selectedIndex ? "bg-muted" : ""
              }`}
              onClick={() => onSelect(shortcut.command)}
            >
              <div className="flex items-center">
                <Command className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary transition-colors duration-200 ease-in-out" />
                <div className="flex-grow">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 ease-in-out">
                    {shortcut.command}
                  </span>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors duration-200 ease-in-out">
                    {shortcut.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
