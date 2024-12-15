// components/custom/Paper.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Paper } from "./Paper";

describe("Paper Component", () => {
  // Basic Rendering
  it("renders with default props", () => {
    render(<Paper>Test Content</Paper>);
    const paper = screen.getByText("Test Content");
    expect(paper).toBeInTheDocument();
    expect(paper).toHaveClass("shadow-sm");
    expect(paper).toHaveClass("bg-white");
  });

  it("renders children correctly", () => {
    render(
      <Paper>
        <div data-testid="child">Child Content</div>
      </Paper>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  // Elevation Tests
  it("applies correct shadow classes for different elevations", () => {
    const { rerender } = render(<Paper elevation={0}>Content</Paper>);
    expect(screen.getByText("Content")).toHaveClass("shadow-none");

    rerender(<Paper elevation={4}>Content</Paper>);
    expect(screen.getByText("Content")).toHaveClass("shadow-lg");

    rerender(<Paper elevation={24}>Content</Paper>);
    expect(screen.getByText("Content")).toHaveClass("shadow-5xl");
  });

  // Variant Tests
  it("renders outlined variant correctly", () => {
    render(<Paper variant="outlined">Content</Paper>);
    expect(screen.getByText("Content")).toHaveClass("border");
    expect(screen.getByText("Content")).toHaveClass("border-gray-300");
  });

  // Square Tests
  it("handles square prop correctly", () => {
    const { rerender } = render(<Paper square>Content</Paper>);
    expect(screen.getByText("Content")).toHaveClass("rounded-none");

    rerender(<Paper square={false}>Content</Paper>);
    expect(screen.getByText("Content")).toHaveClass("rounded-lg");
  });

  // Collapsible Tests
  it("handles collapsible functionality", () => {
    render(<Paper collapsible>Collapsible Content</Paper>);
    const paper = screen.getByText("Collapsible Content");

    expect(paper).toHaveClass("cursor-pointer");
    expect(paper).toHaveClass("max-h-full");

    fireEvent.click(paper);
    expect(paper).toHaveClass("max-h-12");
  });

  // Animation Tests
  it("applies animation classes when animated prop is true", () => {
    render(<Paper animated>Animated Content</Paper>);
    expect(screen.getByText("Animated Content")).toHaveClass("transform");
    expect(screen.getByText("Animated Content")).toHaveClass("duration-300");
  });

  // Custom Styling Tests
  it("applies custom color and border radius", () => {
    render(
      <Paper color="#ff0000" borderRadius={8}>
        Styled Content
      </Paper>
    );
    const paper = screen.getByText("Styled Content");
    expect(paper).toHaveStyle({ backgroundColor: "#ff0000" });
    expect(paper).toHaveStyle({ borderRadius: "8px" });
  });

  // className prop tests
  it("merges custom className with default classes", () => {
    render(<Paper className="custom-class">Content</Paper>);
    const paper = screen.getByText("Content");
    expect(paper).toHaveClass("custom-class");
    expect(paper).toHaveClass("bg-white");
  });

  // State Management Tests
  it("maintains collapse state correctly", () => {
    render(<Paper collapsible>Content</Paper>);
    const paper = screen.getByText("Content");

    expect(paper).toHaveClass("max-h-full");
    fireEvent.click(paper);
    expect(paper).toHaveClass("max-h-12");
    fireEvent.click(paper);
    expect(paper).toHaveClass("max-h-full");
  });

  // Non-collapsible click test
  it("does not toggle when not collapsible", () => {
    render(<Paper>Content</Paper>);
    const paper = screen.getByText("Content");

    expect(paper).toHaveClass("max-h-full");
    fireEvent.click(paper);
    expect(paper).toHaveClass("max-h-full");
  });
});
