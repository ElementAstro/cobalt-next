"use client";

import React, { useRef, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useLogStore } from "@/store/useLogStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";
import LogItem from "./log-item";
import LogPagination from "./log-filters";
import LogFilters from "./log-filters";
import LogActions from "./log-actions";

const LogList: React.FC = () => {
  const { filteredLogs, isPaginationEnabled, currentPage, isRealTimeEnabled } =
    useLogStore();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const listRef = useRef<List>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    setIsScrolling(true);
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 300);

    // Show scroll to bottom button if not at bottom
    const listHeight = Number(listRef.current?.props.height || 0);
    const totalHeight = Number(paginatedLogs.length * 64);
    setShowScrollButton(scrollOffset < totalHeight - listHeight - 100);
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollToItem(paginatedLogs.length - 1, "end");
    }
  };

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    const loadingTimeout = setTimeout(() => setIsLoading(false), 500);

    if (isRealTimeEnabled && listRef.current) {
      listRef.current.scrollToItem(filteredLogs.length - 1);
    }

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [filteredLogs.length, isRealTimeEnabled]);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const paginatedLogs = isPaginationEnabled
    ? filteredLogs.slice((currentPage - 1) * 100, currentPage * 100)
    : filteredLogs;

  return (
    <div className="flex flex-col h-full gap-1">
      <motion.div
        className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
          <LogFilters />
          <LogActions />
        </div>
      </motion.div>
      <div
        className={`flex-1 min-h-0 relative border dark:border-gray-800 transition-all duration-300 ${
          isScrolling ? "shadow-lg" : "shadow-sm"
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!isLoading && filteredLogs.length === 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">📄</div>
                <p>No logs available</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isRealTimeEnabled && showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowDownCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={paginatedLogs.length}
              itemSize={64}
              width={width}
              className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 transition-colors"
              overscanCount={5}
              itemData={paginatedLogs}
              onScroll={handleScroll}
            >
              {({ index, style }) => (
                <motion.div
                  style={style}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ scale: 1.02 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <LogItem index={index} style={style} />
                </motion.div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <AnimatePresence>
        {isPaginationEnabled && (
          <motion.div
            className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            key="pagination"
          >
            <LogPagination />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogList;
