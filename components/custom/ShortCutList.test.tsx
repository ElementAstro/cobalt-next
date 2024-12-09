import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ShortcutList } from "./ShortCutList";
import { useChatStore } from "@/lib/store/chat";

// Mock dependencies
jest.mock("@/lib/store/chat", () => ({
  useChatStore: jest.fn(),
}));

const mockUseChatStore = useChatStore as unknown as jest.Mock;

describe("ShortcutList Component", () => {
  const shortcuts = [
    { id: "1", command: "Command 1", description: "Description 1" },
    { id: "2", command: "Command 2", description: "Description 2" },
  ];

  beforeEach(() => {
    mockUseChatStore.mockReturnValue({ shortcuts });
  });

  it("renders correctly with filtered shortcuts", () => {
    render(<ShortcutList filter="Command" onSelect={jest.fn()} />);
    expect(screen.getByText("Command 1")).toBeInTheDocument();
    expect(screen.getByText("Command 2")).toBeInTheDocument();
  });

  it("filters shortcuts based on input", () => {
    render(<ShortcutList filter="Command 1" onSelect={jest.fn()} />);
    expect(screen.getByText("Command 1")).toBeInTheDocument();
    expect(screen.queryByText("Command 2")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(<ShortcutList filter="Command" onSelect={jest.fn()} />);
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Command 1").parentElement).toHaveClass("bg-muted");
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Command 2").parentElement).toHaveClass("bg-muted");
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(screen.getByText("Command 1").parentElement).toHaveClass("bg-muted");
  });

  it("executes command on Enter key press", () => {
    const onSelect = jest.fn();
    render(<ShortcutList filter="Command" onSelect={onSelect} />);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("Command 1");
  });

  it("resets selected index on filter change", () => {
    render(<ShortcutList filter="Command" onSelect={jest.fn()} />);
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Command 2").parentElement).toHaveClass("bg-muted");
    render(<ShortcutList filter="Command 1" onSelect={jest.fn()} />);
    expect(screen.getByText("Command 1").parentElement).toHaveClass("bg-muted");
  });

  it("handles click events", () => {
    const onSelect = jest.fn();
    render(<ShortcutList filter="Command" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Command 1"));
    expect(onSelect).toHaveBeenCalledWith("Command 1");
  });

  it("scrolls selected element into view", () => {
    render(<ShortcutList filter="Command" onSelect={jest.fn()} />);
    const selectedElement = screen.getByText("Command 1").parentElement;
    if (selectedElement) {
      selectedElement.scrollIntoView = jest.fn();
    }
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(selectedElement?.scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
    });
  });
});
