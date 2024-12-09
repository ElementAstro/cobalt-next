import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Command as CommandType,
  CommandPaletteProps,
} from "@/types/custom/shortcutlist";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  isOpen,
  onClose,
  placeholder = "Type / to see commands...",
  maxDisplayedCommands = 10,
  showShortcuts = true,
  showIcons = true,
  theme = "system",
  hotkey = "cmd+k, ctrl+k",
}) => {
  const [filter, setFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleCommands, setVisibleCommands] = useState<CommandType[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();
  const visibleCommandsRef = useRef(visibleCommands);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  useEffect(() => {
    if (theme !== "system") {
      setTheme(theme);
    }
  }, [theme, setTheme]);

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(filter.toLowerCase().slice(1)) ||
      command.description.toLowerCase().includes(filter.toLowerCase().slice(1))
  );

  useEffect(() => {
    if (filter.startsWith("/")) {
      setVisibleCommands(filteredCommands.slice(0, maxDisplayedCommands));
      setShowCommands(true);
    } else {
      setVisibleCommands([]);
      setShowCommands(false);
    }
  }, [filter, commands, maxDisplayedCommands]);

  useEffect(() => {
    visibleCommandsRef.current = visibleCommands;
  }, [visibleCommands]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev + 1) % visibleCommandsRef.current.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + visibleCommandsRef.current.length) %
            visibleCommandsRef.current.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (visibleCommandsRef.current[selectedIndex]) {
          visibleCommandsRef.current[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, selectedIndex, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

  useHotkeys(
    hotkey,
    () => {
      if (isOpen) {
        onClose();
      } else {
        setFilter("");
        setSelectedIndex(0);
        setShowCommands(false);
      }
    },
    { enableOnFormTags: true, enabled: true }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paletteRef.current &&
        !paletteRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showMoreCommands = () => {
    setVisibleCommands((prev) => [
      ...prev,
      ...filteredCommands.slice(
        prev.length,
        prev.length + maxDisplayedCommands
      ),
    ]);
  };

  const showLessCommands = () => {
    setVisibleCommands((prev) => prev.slice(0, maxDisplayedCommands));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 sm:p-0"
        >
          <motion.div
            ref={paletteRef}
            initial={{ opacity: 0, y: isMobile ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isMobile ? 20 : -20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-background rounded-lg shadow-2xl border w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center px-4 py-2 border-b">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <Input
                ref={inputRef}
                className="flex-grow bg-transparent outline-none text-foreground"
                placeholder={placeholder}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            {showCommands && (
              <div ref={listRef} className="flex-grow overflow-y-auto">
                <AnimatePresence>
                  {visibleCommands.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className={`px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out ${
                        index === selectedIndex
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {showIcons &&
                            (command.icon || (
                              <Command className="w-5 h-5 mr-3 text-muted-foreground" />
                            ))}
                          <div>
                            <h3 className="font-medium text-foreground">
                              {command.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {command.description}
                            </p>
                          </div>
                        </div>
                        {showShortcuts && command.shortcut && (
                          <span className="text-sm text-muted-foreground hidden sm:inline-block">
                            {command.shortcut}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            {showCommands && filteredCommands.length > maxDisplayedCommands && (
              <div className="px-4 py-2 border-t">
                {visibleCommands.length < filteredCommands.length ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={showMoreCommands}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Show more <ChevronDown className="inline-block w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={showLessCommands}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Show less <ChevronUp className="inline-block w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
