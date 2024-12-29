"use client";

import React, { useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useLogStore } from "@/store/useLogStore";
import LogItem from "./log-item";
import LogPagination from "./log-filters";
import LogFilters from "./log-filters";
import LogActions from "./log-actions";

const LogList: React.FC = () => {
  const { filteredLogs, isPaginationEnabled, currentPage, isRealTimeEnabled } =
    useLogStore();

  const listRef = useRef<List>(null);

  useEffect(() => {
    if (isRealTimeEnabled && listRef.current) {
      listRef.current.scrollToItem(filteredLogs.length - 1);
    }
  }, [filteredLogs.length, isRealTimeEnabled]);

  const paginatedLogs = isPaginationEnabled
    ? filteredLogs.slice((currentPage - 1) * 100, currentPage * 100)
    : filteredLogs;

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm rounded-lg">
        <LogFilters />
        <LogActions />
      </div>
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden border dark:border-gray-800">
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={paginatedLogs.length}
              itemSize={64}
              width={width}
              className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
              overscanCount={5}
              itemData={paginatedLogs}
            >
              {LogItem}
            </List>
          )}
        </AutoSizer>
      </div>
      {isPaginationEnabled && (
        <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm rounded-lg">
          <LogPagination />
        </div>
      )}
    </div>
  );
};

export default LogList;
