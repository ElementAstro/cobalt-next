// ConnectionHistory.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConnectionStore } from "@/lib/store/server";

interface ConnectionHistoryProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ConnectionHistory({
  isVisible,
  onClose,
}: ConnectionHistoryProps) {
  const { connectionHistory, removeConnectionHistory, clearConnectionHistory } =
    useConnectionStore();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 bg-background border-t border-border"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">连接历史</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-40">
            {connectionHistory.length > 0 ? (
              <ul className="space-y-2">
                {connectionHistory.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-muted p-2 rounded-md"
                  >
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConnectionHistory(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">
                暂无连接历史。
              </p>
            )}
          </ScrollArea>
          {connectionHistory.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button variant="destructive" onClick={clearConnectionHistory}>
                清空所有历史
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
