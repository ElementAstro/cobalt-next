import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CustomIframe } from "./Iframe";

describe("CustomIframe Component", () => {
  const defaultProps = {
    src: "https://example.com",
    title: "Test Iframe",
  };

  it("renders iframe with default props", () => {
    render(<CustomIframe {...defaultProps} />);
    const iframe = screen.getByTitle("Test Iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://example.com");
  });

  it("displays loading component while loading", () => {
    render(
      <CustomIframe {...defaultProps} loadingComponent={<p>Loading...</p>} />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error component on error", async () => {
    render(
      <CustomIframe
        {...defaultProps}
        errorComponent={<p>Error loading iframe</p>}
      />
    );
    fireEvent.error(screen.getByTitle("Test Iframe"));
    await waitFor(() =>
      expect(screen.getByText("Error loading iframe")).toBeInTheDocument()
    );
  });

  it("handles lazy loading", () => {
    render(<CustomIframe {...defaultProps} lazy />);
    expect(screen.queryByTitle("Test Iframe")).not.toBeInTheDocument();
  });

  it("toggles fullscreen mode", () => {
    render(<CustomIframe {...defaultProps} allowFullScreen />);
    const button = screen.getByText("Fullscreen");
    fireEvent.click(button);
    expect(document.fullscreenElement).toBeTruthy();
    fireEvent.click(button);
    expect(document.fullscreenElement).toBeFalsy();
  });

  it("refreshes iframe at specified interval", () => {
    jest.useFakeTimers();
    render(<CustomIframe {...defaultProps} refreshInterval={5000} />);
    const iframe = screen.getByTitle("Test Iframe");
    fireEvent.load(iframe);
    expect(iframe).toHaveAttribute("src", "https://example.com");
    jest.advanceTimersByTime(5000);
    expect(iframe).toHaveAttribute("src", "https://example.com");
    jest.useRealTimers();
  });

  it("calls onLoad callback on load", () => {
    const onLoad = jest.fn();
    render(<CustomIframe {...defaultProps} onLoad={onLoad} />);
    fireEvent.load(screen.getByTitle("Test Iframe"));
    expect(onLoad).toHaveBeenCalled();
  });

  it("calls onError callback on error", () => {
    const onError = jest.fn();
    render(<CustomIframe {...defaultProps} onError={onError} />);
    fireEvent.error(screen.getByTitle("Test Iframe"));
    expect(onError).toHaveBeenCalled();
  });
});
