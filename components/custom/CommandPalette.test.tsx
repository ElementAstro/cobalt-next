import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CommandPalette } from "./CommandPalette";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";

// Mock dependencies
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));
jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn(),
}));

const mockSetTheme = jest.fn();
const mockUseTheme = useTheme as jest.Mock;
const mockUseMediaQuery = useMediaQuery as jest.Mock;

describe("CommandPalette Component", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ setTheme: mockSetTheme });
    mockUseMediaQuery.mockReturnValue(false);
  });

  const commands = [
    {
      id: "1",
      title: "Command 1",
      description: "Description 1",
      action: jest.fn(),
    },
    {
      id: "2",
      title: "Command 2",
      description: "Description 2",
      action: jest.fn(),
    },
  ];

  it("renders correctly when open", () => {
    render(
      <CommandPalette commands={commands} isOpen={true} onClose={jest.fn()} />
    );
    expect(
      screen.getByPlaceholderText("Type / to see commands...")
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <CommandPalette commands={commands} isOpen={false} onClose={jest.fn()} />
    );
    expect(
      screen.queryByPlaceholderText("Type / to see commands...")
    ).not.toBeInTheDocument();
  });

  it("sets theme correctly", () => {
    render(
      <CommandPalette
        commands={commands}
        isOpen={true}
        onClose={jest.fn()}
        theme="dark"
      />
    );
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("filters commands based on input", () => {
    render(
      <CommandPalette commands={commands} isOpen={true} onClose={jest.fn()} />
    );
    fireEvent.change(screen.getByPlaceholderText("Type / to see commands..."), {
      target: { value: "/Command 1" },
    });
    expect(screen.getByText("Command 1")).toBeInTheDocument();
    expect(screen.queryByText("Command 2")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(
      <CommandPalette commands={commands} isOpen={true} onClose={jest.fn()} />
    );
    fireEvent.change(screen.getByPlaceholderText("Type / to see commands..."), {
      target: { value: "/" },
    });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Command 1").parentElement).toHaveClass("bg-muted");
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Command 2").parentElement).toHaveClass("bg-muted");
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(screen.getByText("Command 1").parentElement).toHaveClass("bg-muted");
  });

  it("executes command on Enter key press", () => {
    const onClose = jest.fn();
    render(
      <CommandPalette commands={commands} isOpen={true} onClose={onClose} />
    );
    fireEvent.change(screen.getByPlaceholderText("Type / to see commands..."), {
      target: { value: "/" },
    });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(commands[0].action).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape key press", () => {
    const onClose = jest.fn();
    render(
      <CommandPalette commands={commands} isOpen={true} onClose={onClose} />
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("handles click outside to close", () => {
    const onClose = jest.fn();
    render(
      <CommandPalette commands={commands} isOpen={true} onClose={onClose} />
    );
    fireEvent.mouseDown(document);
    expect(onClose).toHaveBeenCalled();
  });

  it("shows more commands on button click", () => {
    const manyCommands = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Command ${i + 1}`,
      description: `Description ${i + 1}`,
      action: jest.fn(),
    }));
    render(
      <CommandPalette
        commands={manyCommands}
        isOpen={true}
        onClose={jest.fn()}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Type / to see commands..."), {
      target: { value: "/" },
    });
    fireEvent.click(screen.getByText("Show more"));
    expect(screen.getByText("Command 11")).toBeInTheDocument();
  });

  it("shows less commands on button click", () => {
    const manyCommands = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Command ${i + 1}`,
      description: `Description ${i + 1}`,
      action: jest.fn(),
    }));
    render(
      <CommandPalette
        commands={manyCommands}
        isOpen={true}
        onClose={jest.fn()}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Type / to see commands..."), {
      target: { value: "/" },
    });
    fireEvent.click(screen.getByText("Show more"));
    fireEvent.click(screen.getByText("Show less"));
    expect(screen.queryByText("Command 11")).not.toBeInTheDocument();
  });
});
