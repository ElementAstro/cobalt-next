import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface VirtualScrollProps<T> {
  items: T[];
  height: number;
  itemHeight?: number | ((item: T) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  buffer?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  direction?: "vertical" | "horizontal";
  loadingComponent?: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export interface VirtualScrollHandle {
  scrollToIndex: (index: number) => void;
}

export const VirtualScroll = forwardRef<
  VirtualScrollHandle,
  VirtualScrollProps<any>
>(
  (
    {
      items,
      height,
      itemHeight = 50,
      renderItem,
      buffer = 5,
      onLoadMore,
      isLoading = false,
      emptyState = null,
      direction = "vertical",
      loadingComponent = <div>Loading...</div>,
      onScroll,
    }: VirtualScrollProps<any>,
    ref
  ) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const totalHeightRef = useRef<number>(0);
    const itemHeightsRef = useRef<number[]>([]);

    useEffect(() => {
      if (typeof itemHeight === "function") {
        itemHeightsRef.current = items.map((item) => itemHeight(item));
        totalHeightRef.current = itemHeightsRef.current.reduce(
          (a, b) => a + b,
          0
        );
      } else {
        totalHeightRef.current = items.length * itemHeight;
      }
    }, [items, itemHeight]);

    useEffect(() => {
      const handleScroll = (e: Event) => {
        const target = e.target as HTMLDivElement;
        const newScrollTop =
          direction === "vertical" ? target.scrollTop : target.scrollLeft;
        setScrollTop(newScrollTop);

        if (onLoadMore) {
          const scrollPosition =
            direction === "vertical"
              ? target.scrollTop + height
              : target.scrollLeft + height;
          const threshold =
            totalHeightRef.current -
            (typeof itemHeight === "function" ? 100 : itemHeight * buffer);
          if (scrollPosition >= threshold) {
            onLoadMore();
          }
        }

        if (onScroll) {
          onScroll(e as unknown as React.UIEvent<HTMLDivElement>);
        }
      };

      const current = containerRef.current;
      current?.addEventListener("scroll", handleScroll);
      return () => current?.removeEventListener("scroll", handleScroll);
    }, [height, buffer, onLoadMore, direction, onScroll, itemHeight]);

    const getItemOffset = (index: number) => {
      if (typeof itemHeight === "function") {
        return itemHeightsRef.current
          .slice(0, index)
          .reduce((a, b) => a + b, 0);
      }
      return index * itemHeight;
    };

    const getVisibleRange = () => {
      let start = 0;
      let end = items.length;

      if (typeof itemHeight === "function") {
        let acc = 0;
        for (let i = 0; i < items.length; i++) {
          if (acc + itemHeightsRef.current[i] > scrollTop) {
            start = Math.max(0, i - buffer);
            break;
          }
          acc += itemHeightsRef.current[i];
        }

        acc = 0;
        for (let i = 0; i < items.length; i++) {
          acc += itemHeightsRef.current[i];
          if (acc > scrollTop + height) {
            end = Math.min(items.length, i + buffer);
            break;
          }
        }
      } else {
        const startIndex = Math.max(
          0,
          Math.floor(scrollTop / itemHeight) - buffer
        );
        const endIndex = Math.min(
          items.length,
          Math.ceil((scrollTop + height) / itemHeight) + buffer
        );
        start = startIndex;
        end = endIndex;
      }

      return { start, end };
    };

    const { start, end } = getVisibleRange();
    const visibleItems = items.slice(start, end);

    useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number) => {
        if (containerRef.current) {
          const offset = getItemOffset(index);
          if (direction === "vertical") {
            containerRef.current.scrollTop = offset;
          } else {
            containerRef.current.scrollLeft = offset;
          }
        }
      },
    }));

    if (items.length === 0 && !isLoading) {
      return <div style={{ height, overflow: "auto" }}>{emptyState}</div>;
    }

    return (
      <div
        ref={containerRef}
        style={{
          height,
          overflowY: direction === "vertical" ? "auto" : "hidden",
          overflowX: direction === "horizontal" ? "auto" : "hidden",
          position: "relative",
          whiteSpace: direction === "horizontal" ? "nowrap" : "normal",
        }}
      >
        <div
          style={{
            height: direction === "vertical" ? totalHeightRef.current : "100%",
            width: direction === "horizontal" ? totalHeightRef.current : "100%",
            position: "relative",
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = start + index;
            const offset = getItemOffset(actualIndex);
            return (
              <div
                key={actualIndex}
                style={{
                  position: "absolute",
                  top: direction === "vertical" ? offset : 0,
                  left: direction === "horizontal" ? offset : 0,
                  height:
                    direction === "vertical"
                      ? typeof itemHeight === "function"
                        ? itemHeightsRef.current[actualIndex]
                        : itemHeight
                      : "100%",
                  width:
                    direction === "horizontal"
                      ? typeof itemHeight === "function"
                        ? itemHeightsRef.current[actualIndex]
                        : itemHeight
                      : "100%",
                }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
          {isLoading && loadingComponent}
        </div>
      </div>
    );
  }
);
