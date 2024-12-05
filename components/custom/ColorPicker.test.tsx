import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvancedColorPickerPopover from "./ColorPicker";

describe("AdvancedColorPickerPopover", () => {
  it("renders correctly", () => {
    render(<AdvancedColorPickerPopover />);
    expect(screen.getByText("Pick a color")).toBeInTheDocument();
  });

  it("changes color correctly", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.change(screen.getByLabelText("Custom color"), {
      target: { value: "#FF5733" },
    });
    expect(screen.getByText("Pick a color").previousSibling).toHaveStyle({
      backgroundColor: "#FF5733",
    });
  });

  it("changes opacity correctly", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.change(screen.getByLabelText("Opacity"), {
      target: { value: "50" },
    });
    expect(screen.getByText("Pick a color").previousSibling).toHaveStyle({
      opacity: "0.5",
    });
  });

  it("changes format correctly", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.change(screen.getByLabelText("Format:"), {
      target: { value: "rgb" },
    });
    expect(screen.getByText("rgba(0, 0, 0, 1)")).toBeInTheDocument();
  });

  it("copies color to clipboard", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.click(screen.getByText("Copy"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("#000000ff");
  });

  it("adds color to presets", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.change(screen.getByLabelText("Custom color"), {
      target: { value: "#FF5733" },
    });
    fireEvent.click(screen.getByLabelText("Add current color to presets"));
    expect(screen.getByLabelText("Select color #FF5733")).toBeInTheDocument();
  });

  it("changes RGB values correctly", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.change(screen.getByLabelText("Red"), {
      target: { value: "255" },
    });
    expect(screen.getByText("Pick a color").previousSibling).toHaveStyle({
      backgroundColor: "#ff0000",
    });
  });

  it("changes HSL values correctly", () => {
    render(<AdvancedColorPickerPopover />);
    fireEvent.change(screen.getByLabelText("Hue"), {
      target: { value: "120" },
    });
    expect(screen.getByText("Pick a color").previousSibling).toHaveStyle({
      backgroundColor: "#00ff00",
    });
  });

  it("uploads image and extracts color correctly", () => {
    render(<AdvancedColorPickerPopover />);
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    fireEvent.change(screen.getByLabelText("Upload Image"), {
      target: { files: [file] },
    });
    expect(screen.getByText("Pick a color").previousSibling).toHaveStyle({
      backgroundColor: "#000000",
    });
  });
});
