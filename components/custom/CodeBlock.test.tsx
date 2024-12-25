import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CodeBlock } from "./CodeBlock";
import { act } from "react-dom/test-utils";

describe("CodeBlock", () => {
  const defaultProps = {
    code: "const a = 1;",
    language: "javascript",
  };

  it("renders with default props", () => {
    render(<CodeBlock {...defaultProps} />);
    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
  });

  it("copies code to clipboard when copy button is clicked", async () => {
    render(<CodeBlock {...defaultProps} />);
    const copyButton = screen.getByLabelText("Copy code to clipboard");

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(await navigator.clipboard.readText()).toBe(defaultProps.code);
    expect(screen.getByLabelText("Copied")).toBeInTheDocument();
  });

  it("resets code when reset button is clicked", () => {
    render(<CodeBlock {...defaultProps} />);
    const resetButton = screen.getByLabelText("Reset code");

    fireEvent.click(resetButton);

    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
  });

  it("toggles fullscreen mode when fullscreen button is clicked", () => {
    render(<CodeBlock {...defaultProps} />);
    const fullscreenButton = screen.getByLabelText("Enter fullscreen");

    fireEvent.click(fullscreenButton);

    expect(screen.getByLabelText("Exit fullscreen")).toBeInTheDocument();

    fireEvent.click(fullscreenButton);

    expect(screen.getByLabelText("Enter fullscreen")).toBeInTheDocument();
  });

  it("toggles line numbers when switch is clicked", () => {
    render(<CodeBlock {...defaultProps} />);
    const switchButton = screen.getByLabelText("Line Numbers");

    fireEvent.click(switchButton);

    expect(screen.getByLabelText("Line Numbers")).not.toBeChecked();

    fireEvent.click(switchButton);

    expect(screen.getByLabelText("Line Numbers")).toBeChecked();
  });

  it("changes theme when theme select is changed", () => {
    render(<CodeBlock {...defaultProps} />);
    const themeSelect = screen.getByPlaceholderText("Theme");

    fireEvent.change(themeSelect, { target: { value: "dark" } });

    expect(themeSelect).toHaveValue("dark");

    fireEvent.change(themeSelect, { target: { value: "light" } });

    expect(themeSelect).toHaveValue("light");
  });

  it("changes font size when font size select is changed", () => {
    render(<CodeBlock {...defaultProps} />);
    const fontSizeSelect = screen.getByPlaceholderText("Font Size");

    fireEvent.change(fontSizeSelect, { target: { value: "large" } });

    expect(fontSizeSelect).toHaveValue("large");

    fireEvent.change(fontSizeSelect, { target: { value: "medium" } });

    expect(fontSizeSelect).toHaveValue("medium");

    fireEvent.change(fontSizeSelect, { target: { value: "small" } });

    expect(fontSizeSelect).toHaveValue("small");
  });
});
