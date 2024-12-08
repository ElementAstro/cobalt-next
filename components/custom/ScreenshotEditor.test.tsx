import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ScreenshotEditor from "./ScreenshotEditor";

describe("ScreenshotEditor", () => {
  const src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
  const onSave = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<ScreenshotEditor src={src} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByText("Edit Screenshot")).toBeInTheDocument();
    expect(screen.getByText("Brightness")).toBeInTheDocument();
    expect(screen.getByText("Contrast")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onSave with edited screenshot", async () => {
    render(<ScreenshotEditor src={src} onSave={onSave} onCancel={onCancel} />);
    const saveButton = screen.getByText("Save");

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(<ScreenshotEditor src={src} onSave={onSave} onCancel={onCancel} />);
    const cancelButton = screen.getByText("Cancel");

    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});
