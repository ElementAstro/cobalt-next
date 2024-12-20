import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ListGroup from "./ListGroup";

const mockItems = [
  { id: "1", label: "Item 1", description: "Description 1" },
  { id: "2", label: "Item 2", description: "Description 2" },
  { id: "3", label: "Item 3", description: "Description 3" },
];

describe("ListGroup", () => {
  it("renders correctly with default props", () => {
    render(<ListGroup items={mockItems} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("calls onItemSelect when an item is clicked", () => {
    const onItemSelect = jest.fn();
    render(<ListGroup items={mockItems} onItemSelect={onItemSelect} />);

    fireEvent.click(screen.getByText("Item 1"));
    expect(onItemSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it("supports multi-select", () => {
    render(<ListGroup items={mockItems} multiSelect />);

    fireEvent.click(screen.getByText("Item 1"));
    fireEvent.click(screen.getByText("Item 2"));

    expect(screen.getByText("Item 1").closest("li")).toHaveClass("bg-blue-500");
    expect(screen.getByText("Item 2").closest("li")).toHaveClass("bg-blue-500");
  });

  it("supports search functionality", () => {
    render(<ListGroup items={mockItems} searchable />);

    fireEvent.change(screen.getByPlaceholderText("搜索..."), {
      target: { value: "Item 2" },
    });

    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.queryByText("Item 3")).not.toBeInTheDocument();
  });

  it("supports item reordering", () => {
    const onItemsReorder = jest.fn();
    render(<ListGroup items={mockItems} onItemsReorder={onItemsReorder} />);

    // Simulate drag and drop
    fireEvent.dragStart(screen.getByText("Item 1"));
    fireEvent.dragEnter(screen.getByText("Item 2"));
    fireEvent.dragEnd(screen.getByText("Item 1"));

    expect(onItemsReorder).toHaveBeenCalled();
  });

  it("loads more items when '加载更多' button is clicked", async () => {
    const loadMoreItems = jest
      .fn()
      .mockResolvedValue([
        { id: "4", label: "Item 4", description: "Description 4" },
      ]);

    render(<ListGroup items={mockItems} loadMoreItems={loadMoreItems} />);

    fireEvent.click(screen.getByText("加载更多"));
    expect(loadMoreItems).toHaveBeenCalled();

    await act(async () => {
      await loadMoreItems();
    });

    expect(screen.getByText("Item 4")).toBeInTheDocument();
  });

  it("applies correct theme classes", () => {
    render(<ListGroup items={mockItems} theme="dark" />);

    expect(screen.getByRole("listbox")).toHaveClass("bg-gray-800 text-white");
  });

  it("handles keyboard navigation", () => {
    render(<ListGroup items={mockItems} />);

    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "ArrowDown" });

    expect(screen.getByText("Item 2").closest("li")).toHaveClass("bg-blue-500");
  });
});
