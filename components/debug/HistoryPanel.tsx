import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect } from "react";

interface HistoryPanelProps {
  history: Array<{ config: any }>;
  onSelect: (config: any) => void;
}

export default function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [history]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Request History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start dark:border-gray-600 dark:text-gray-200"
                  onClick={() => onSelect(item.config)}
                >
                  <pre className="language-json w-full text-left">
                    <code>
                      {Prism.highlight(
                        JSON.stringify(
                          { method: item.config.method, url: item.config.url },
                          null,
                          2
                        ),
                        Prism.languages.json,
                        "json"
                      )}
                    </code>
                  </pre>
                </Button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </CardContent>
    </Card>
  );
}
