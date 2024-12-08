import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ScreenshotCapture from "./ScreenshotCapture";

jest.mock("navigator.mediaDevices.getDisplayMedia", () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      getTracks: () => [{ stop: jest.fn() }],
    });
  });
});

describe("ScreenshotCapture", () => {
  it("renders correctly", () => {
    render(
      <ScreenshotCapture
        onCapture={jest.fn()}
        onEdit={jest.fn()}
        onShare={jest.fn()}
      />
    );
    expect(screen.getByText("Capture Screenshot")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("captures screenshot on button click", async () => {
    const onCapture = jest.fn();
    render(
      <ScreenshotCapture
        onCapture={onCapture}
        onEdit={jest.fn()}
        onShare={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Capture Screenshot"));

    await waitFor(() => {
      expect(onCapture).toHaveBeenCalled();
    });
  });

  it("calls onEdit when Edit button is clicked", () => {
    const onEdit = jest.fn();
    render(
      <ScreenshotCapture
        onCapture={jest.fn()}
        onEdit={onEdit}
        onShare={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalled();
  });

  it("calls onShare when Share button is clicked", () => {
    const onShare = jest.fn();
    render(
      <ScreenshotCapture
        onCapture={jest.fn()}
        onEdit={jest.fn()}
        onShare={onShare}
      />
    );

    fireEvent.click(screen.getByText("Share"));
    expect(onShare).toHaveBeenCalled();
  });

  it("handles error during screen capture", async () => {
    jest
      .spyOn(navigator.mediaDevices, "getDisplayMedia")
      .mockImplementationOnce(() => {
        return Promise.reject(new Error("Error capturing screenshot"));
      });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(
      <ScreenshotCapture
        onCapture={jest.fn()}
        onEdit={jest.fn()}
        onShare={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Capture Screenshot"));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error capturing screenshot:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
