import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Splitter from "./Splitter";

describe("Splitter", () => {
  const mockOnDrag = jest.fn();
  const mockOnDragEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(
      <Splitter>
        <div>Left Content</div>
        <div>Right Content</div>
      </Splitter>
    );
    expect(screen.getByText("Left Content")).toBeInTheDocument();
    expect(screen.getByText("Right Content")).toBeInTheDocument();
  });

  it("renders in horizontal mode", () => {
    render(
      <Splitter horizontal>
        <div>Top Content</div>
        <div>Bottom Content</div>
      </Splitter>
    );
    const container =
      screen.getByText("Top Content").parentElement?.parentElement;
    expect(container).toHaveClass("flex-col");
  });

  it("applies custom styles", () => {
    render(
      <Splitter
        separatorClass="custom-separator"
        beforeClass="custom-before"
        afterClass="custom-after"
      >
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );
    expect(document.querySelector(".custom-separator")).toBeInTheDocument();
    expect(document.querySelector(".custom-before")).toBeInTheDocument();
    expect(document.querySelector(".custom-after")).toBeInTheDocument();
  });

  it("handles mouse drag", () => {
    const { container } = render(
      <Splitter onDrag={mockOnDrag} onDragEnd={mockOnDragEnd}>
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );

    const separator = container.querySelector('[class*="cursor-col-resize"]');
    fireEvent.mouseDown(separator!);

    fireEvent.mouseMove(document, {
      clientX: 100,
      clientY: 0,
    });

    fireEvent.mouseUp(document);

    expect(mockOnDrag).toHaveBeenCalled();
    expect(mockOnDragEnd).toHaveBeenCalled();
  });

  it("respects disabled state", () => {
    const { container } = render(
      <Splitter disabled>
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );

    const separator = container.querySelector(".cursor-not-allowed");
    expect(separator).toBeInTheDocument();
  });

  it("handles collapse threshold", () => {
    render(
      <Splitter value={5} collapseThreshold={10} hideWhenCollapsed>
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );

    expect(screen.queryByText("Left")).not.toBeInTheDocument();
  });

  it("respects size limits", () => {
    const { container } = render(
      <Splitter limits={[20, 80]}>
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );

    const separator = container.querySelector('[class*="cursor-col-resize"]');
    fireEvent.mouseDown(separator!);

    // Simulate dragging beyond limits
    fireEvent.mouseMove(document, {
      clientX: -100,
      clientY: 0,
    });

    expect(container.firstChild).toHaveStyle({ width: "20%" });
  });

  it("handles snap points", () => {
    render(
      <Splitter snap={[25, 50, 75]} onDrag={mockOnDrag}>
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );

    const separator = screen.getByRole("presentation");
    fireEvent.mouseDown(separator);

    // Simulate dragging near snap point
    fireEvent.mouseMove(document, {
      clientX: 48,
      clientY: 0,
    });

    expect(mockOnDrag).toHaveBeenCalledWith(50);
  });
});
