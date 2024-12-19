import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import VersionDisplay from "./Version";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("VersionDisplay", () => {
  const defaultProps = {
    version: "1.0.0",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders version with prefix and suffix", () => {
    render(<VersionDisplay {...defaultProps} prefix="v" suffix="beta" />);
    expect(screen.getByText("v1.0.0beta")).toBeInTheDocument();
  });

  it("renders without prefix and suffix when not provided", () => {
    render(<VersionDisplay {...defaultProps} />);
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
  });

  it("renders copy button when showCopyButton is true", () => {
    render(<VersionDisplay {...defaultProps} showCopyButton />);
    expect(screen.getByLabelText("复制版本")).toBeInTheDocument();
  });

  it("does not render copy button when showCopyButton is false", () => {
    render(<VersionDisplay {...defaultProps} showCopyButton={false} />);
    expect(screen.queryByLabelText("复制版本")).not.toBeInTheDocument();
  });

  it("renders refresh button when showRefreshButton is true", () => {
    render(<VersionDisplay {...defaultProps} showRefreshButton />);
    expect(screen.getByLabelText("刷新版本")).toBeInTheDocument();
  });

  it("does not render refresh button when showRefreshButton is false", () => {
    render(<VersionDisplay {...defaultProps} showRefreshButton={false} />);
    expect(screen.queryByLabelText("刷新版本")).not.toBeInTheDocument();
  });

  it("copies version to clipboard when copy button is clicked", async () => {
    render(<VersionDisplay {...defaultProps} showCopyButton />);
    const copyButton = screen.getByLabelText("复制版本");
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("1.0.0");
    await waitFor(() => {
      expect(screen.getByLabelText("版本已复制")).toBeInTheDocument();
    });
  });

  it("calls onRefresh when refresh button is clicked", () => {
    const onRefreshMock = jest.fn();
    render(
      <VersionDisplay
        {...defaultProps}
        showRefreshButton
        onRefresh={onRefreshMock}
      />
    );
    const refreshButton = screen.getByLabelText("刷新版本");
    fireEvent.click(refreshButton);
    expect(onRefreshMock).toHaveBeenCalled();
  });

  it("shows loading state when refreshing", () => {
    const onRefreshMock = jest.fn();
    render(
      <VersionDisplay
        {...defaultProps}
        showRefreshButton
        onRefresh={onRefreshMock}
      />
    );
    const refreshButton = screen.getByLabelText("刷新版本");
    fireEvent.click(refreshButton);
    const refreshIcon = screen.getByTestId("refresh-icon");
    expect(refreshIcon).toHaveClass("animate-spin");
  });

  it("calls onVersionClick when version badge is clicked", () => {
    const onVersionClickMock = jest.fn();
    render(
      <VersionDisplay {...defaultProps} onVersionClick={onVersionClickMock} />
    );
    const badge = screen.getByText("1.0.0");
    fireEvent.click(badge);
    expect(onVersionClickMock).toHaveBeenCalled();
  });

  it("does not call onVersionClick when not provided", () => {
    render(<VersionDisplay {...defaultProps} />);
    const badge = screen.getByText("1.0.0");
    fireEvent.click(badge);
    // No error should occur, and nothing should happen
    expect(true).toBe(true);
  });

  it("renders tooltip when tooltipContent is provided", async () => {
    render(
      <TooltipProvider>
        <VersionDisplay {...defaultProps} tooltipContent="Version Tooltip" />
      </TooltipProvider>
    );
    const badge = screen.getByText("1.0.0");
    fireEvent.mouseOver(badge);
    await waitFor(() => {
      expect(screen.getByText("Version Tooltip")).toBeInTheDocument();
    });
  });

  it("does not render tooltip when tooltipContent is not provided", () => {
    render(<VersionDisplay {...defaultProps} />);
    const badge = screen.getByText("1.0.0");
    fireEvent.mouseOver(badge);
    expect(screen.queryByText("Version Tooltip")).not.toBeInTheDocument();
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<VersionDisplay {...defaultProps} size="sm" />);
    expect(screen.getByText("1.0.0")).toHaveClass("text-xs px-2 py-0.5");

    rerender(<VersionDisplay {...defaultProps} size="md" />);
    expect(screen.getByText("1.0.0")).toHaveClass("text-sm px-2.5 py-0.5");

    rerender(<VersionDisplay {...defaultProps} size="lg" />);
    expect(screen.getByText("1.0.0")).toHaveClass("text-base px-3 py-1");
  });

  it("applies correct badge variant classes", () => {
    const { rerender } = render(
      <VersionDisplay {...defaultProps} badgeVariant="default" />
    );
    expect(screen.getByText("1.0.0")).toHaveClass("badge-default");

    rerender(<VersionDisplay {...defaultProps} badgeVariant="secondary" />);
    expect(screen.getByText("1.0.0")).toHaveClass("badge-secondary");

    rerender(<VersionDisplay {...defaultProps} badgeVariant="destructive" />);
    expect(screen.getByText("1.0.0")).toHaveClass("badge-destructive");

    rerender(<VersionDisplay {...defaultProps} badgeVariant="outline" />);
    expect(screen.getByText("1.0.0")).toHaveClass("badge-outline");
  });
});
