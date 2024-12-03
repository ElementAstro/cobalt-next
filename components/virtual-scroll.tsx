import { useState, useEffect, useRef, useCallback } from "react";

interface VirtualScrollProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T) => React.ReactNode;
  buffer?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function VirtualScroll<T>({
  items,
  height,
  itemHeight,
  renderItem,
  buffer = 5,
  onLoadMore,
  isLoading = false,
  emptyState = null,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
        if (
          onLoadMore &&
          containerRef.current.scrollTop + height >=
            containerRef.current.scrollHeight - itemHeight * buffer
        ) {
          onLoadMore();
        }
      }
    };

    containerRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      containerRef.current?.removeEventListener("scroll", handleScroll);
  }, [height, itemHeight, buffer, onLoadMore]);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    startIndex + Math.ceil(height / itemHeight) + buffer * 2,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const renderItemMemo = useCallback(
    (item: T, index: number) => {
      return (
        <div
          key={startIndex + index}
          style={{
            position: "absolute",
            top: (startIndex + index) * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          }}
        >
          {renderItem(item)}
        </div>
      );
    },
    [startIndex, itemHeight, renderItem]
  );

  if (items.length === 0 && !isLoading) {
    return <div style={{ height, overflowY: "auto" }}>{emptyState}</div>;
  }

  return (
    <div ref={containerRef} style={{ height, overflowY: "auto" }}>
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {visibleItems.map((item, index) => renderItemMemo(item, index))}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: itemHeight,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
