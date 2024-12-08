import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ScreenshotViewer from "./ScreenshotViewer";

describe("ScreenshotViewer", () => {
  it("renders correctly", () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    expect(screen.getByText("Screenshot")).toBeInTheDocument();
    expect(screen.getByAltText("Test Screenshot")).toBeInTheDocument();
    expect(screen.getByText("Capture Screenshot")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("sets isEditing to true on handleEdit", () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    const editButton = screen.getByText("Edit");

    fireEvent.click(editButton);

    expect(screen.getByText("Edit Screenshot")).toBeInTheDocument();
  });

  it("updates src state and sets isEditing to false on handleSaveEdit", async () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    const editButton = screen.getByText("Edit");

    fireEvent.click(editButton);

    const saveButton = screen.getByText("Save");

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByText("Edit Screenshot")).not.toBeInTheDocument();
    });
  });

  it("sets isEditing to false on handleCancelEdit", () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    const editButton = screen.getByText("Edit");

    fireEvent.click(editButton);

    const cancelButton = screen.getByText("Cancel");

    fireEvent.click(cancelButton);

    expect(screen.queryByText("Edit Screenshot")).not.toBeInTheDocument();
  });

  it("sets isSharing to true on handleShare", () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    const shareButton = screen.getByText("Share");

    fireEvent.click(shareButton);

    expect(screen.getByText("Share Screenshot")).toBeInTheDocument();
  });

  it("sets isSharing to false on handleCloseShare", () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    const shareButton = screen.getByText("Share");

    fireEvent.click(shareButton);

    const closeButton = screen.getByRole("button", { name: /close/i });

    fireEvent.click(closeButton);

    expect(screen.queryByText("Share Screenshot")).not.toBeInTheDocument();
  });

  it("renders Dialog correctly when isSharing is true", () => {
    render(<ScreenshotViewer alt="Test Screenshot" />);
    const shareButton = screen.getByText("Share");

    fireEvent.click(shareButton);

    expect(screen.getByText("Share Screenshot")).toBeInTheDocument();
    expect(
      screen.getByText("Here's a link to your screenshot:")
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue(
      "/placeholder.svg?height=400&width=800"
    );
  });
});
