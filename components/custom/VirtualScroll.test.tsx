import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { VirtualScroll, VirtualScrollHandle } from "./VirtualScroll";

const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

describe("VirtualScroll", () => {
  it("renders with items", () => {
    render(
      <VirtualScroll
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
      />
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <VirtualScroll
        items={[]}
        height={500}
        renderItem={(item) => <div>{item}</div>}
        emptyState={<div>No items</div>}
      />
    );
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <VirtualScroll
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
        isLoading={true}
        loadingComponent={<div>Loading...</div>}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("scrolls to a specific index", () => {
    const ref = React.createRef<VirtualScrollHandle>();
    render(
      <VirtualScroll
        ref={ref}
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
      />
    );
    ref.current?.scrollToIndex(50);
    expect(screen.getByText("Item 51")).toBeInTheDocument();
  });

  it("handles vertical scrolling", () => {
    render(
      <VirtualScroll
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
        direction="vertical"
      />
    );
    const container = screen.getByText("Item 1").parentElement?.parentElement;
    fireEvent.scroll(container!, { target: { scrollTop: 1000 } });
    expect(screen.getByText("Item 21")).toBeInTheDocument();
  });

  it("handles horizontal scrolling", () => {
    render(
      <VirtualScroll
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
        direction="horizontal"
      />
    );
    const container = screen.getByText("Item 1").parentElement?.parentElement;
    fireEvent.scroll(container!, { target: { scrollLeft: 1000 } });
    expect(screen.getByText("Item 21")).toBeInTheDocument();
  });

  it("handles dynamic item heights", () => {
    render(
      <VirtualScroll
        items={items}
        height={500}
        itemHeight={(item) => (item.includes("5") ? 100 : 50)}
        renderItem={(item) => <div>{item}</div>}
      />
    );
    expect(screen.getByText("Item 5").parentElement).toHaveStyle(
      "height: 100px"
    );
  });

  it("calls onLoadMore when scrolling near the end", () => {
    const onLoadMore = jest.fn();
    render(
      <VirtualScroll
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
        onLoadMore={onLoadMore}
      />
    );
    const container = screen.getByText("Item 1").parentElement?.parentElement;
    fireEvent.scroll(container!, { target: { scrollTop: 4500 } });
    expect(onLoadMore).toHaveBeenCalled();
  });

  it("calls onScroll when scrolling", () => {
    const onScroll = jest.fn();
    render(
      <VirtualScroll
        items={items}
        height={500}
        renderItem={(item) => <div>{item}</div>}
        onScroll={onScroll}
      />
    );
    const container = screen.getByText("Item 1").parentElement?.parentElement;
    fireEvent.scroll(container!, { target: { scrollTop: 1000 } });
    expect(onScroll).toHaveBeenCalled();
  });
});
