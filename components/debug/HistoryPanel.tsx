// components/HistoryPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import { useHistoryStore } from "@/lib/store/debug";
import { Trash2, FileText, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HistoryPanelProps {
  onSelect: (config: any) => void;
}

export default function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const { history, removeHistory, clearHistory } = useHistoryStore();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    Prism.highlightAll();
  }, [history]);

  const filteredHistory = history.filter(
    (item) =>
      item.config.method.toLowerCase().includes(search.toLowerCase()) ||
      item.config.url.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-900 dark:text-gray-100">
          请求历史记录
        </CardTitle>
        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            清空
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="搜索历史记录..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <ul className="space-y-2">
          <AnimatePresence>
            {filteredHistory.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <Button
                    variant="ghost"
                    className="flex-1 text-left dark:text-gray-200"
                    onClick={() => onSelect(item.config)}
                  >
                    <pre className="language-json">
                      <code
                        dangerouslySetInnerHTML={{
                          __html: Prism.highlight(
                            JSON.stringify(
                              {
                                method: item.config.method,
                                url: item.config.url,
                              },
                              null,
                              2
                            ),
                            Prism.languages.json,
                            "json"
                          ),
                        }}
                      />
                    </pre>
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-2 text-red-500 hover:text-red-600"
                    onClick={() => removeHistory(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            className="mt-4 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            清空所有历史记录
          </Button>
        )}
        {history.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            暂无历史记录
          </p>
        )}
      </CardContent>
    </Card>
  );
}
