import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PageHeader from "./PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Mock framer-motion to avoid animations during testing
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef(
        (
          props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLDivElement> &
            React.HTMLAttributes<HTMLDivElement>,
          ref: React.LegacyRef<HTMLDivElement> | undefined
        ) => <div {...props} ref={ref} />
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("PageHeader Component", () => {
  it("renders correctly with default props", () => {
    render(<PageHeader title="Page Title" subtitle="Page Subtitle" />);
    expect(screen.getByText("Page Title")).toBeInTheDocument();
    expect(screen.getByText("Page Subtitle")).toBeInTheDocument();
  });

  it("renders with custom avatar", () => {
    render(
      <PageHeader
        title="Page Title"
        avatar={<img src="avatar.png" alt="Avatar" />}
      />
    );
    expect(screen.getByAltText("Avatar")).toBeInTheDocument();
  });

  it("renders with custom header", () => {
    render(<PageHeader title="Page Title" header={<div>Custom Header</div>} />);
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });

  it("renders with custom footer", () => {
    render(<PageHeader title="Page Title" footer={<div>Custom Footer</div>} />);
    expect(screen.getByText("Custom Footer")).toBeInTheDocument();
  });

  it("renders with extra slot", () => {
    render(<PageHeader title="Page Title" extraSlot={<div>Extra Slot</div>} />);
    expect(screen.getByText("Extra Slot")).toBeInTheDocument();
  });

  it("renders with back button and handles onBack callback", () => {
    const onBackMock = jest.fn();
    render(<PageHeader title="Page Title" onBack={onBackMock} />);
    const backButton = screen.getByLabelText("返回");
    fireEvent.click(backButton);
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it("toggles theme correctly", () => {
    render(<PageHeader title="Page Title" />);
    const switchButton = screen.getByRole("switch");
    fireEvent.click(switchButton);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles dropdown correctly", () => {
    render(<PageHeader title="Page Title" />);
    const dropdownButton = screen.getByText("通知");
    fireEvent.click(dropdownButton);
    expect(screen.getByText("通知 1")).toBeInTheDocument();
    fireEvent.click(dropdownButton);
    expect(screen.queryByText("通知 1")).not.toBeInTheDocument();
  });

  it("collapses and expands content correctly", () => {
    render(
      <PageHeader title="Page Title" collapsible>
        <div>Collapsible Content</div>
      </PageHeader>
    );
    const collapseButton = screen.getByLabelText("切换折叠");
    fireEvent.click(collapseButton);
    expect(screen.queryByText("Collapsible Content")).not.toBeInTheDocument();
    fireEvent.click(collapseButton);
    expect(screen.getByText("Collapsible Content")).toBeInTheDocument();
  });

  it("renders with custom animation preset", () => {
    render(<PageHeader title="Page Title" animationPreset="slide" />);
    const container = screen.getByText("Page Title").closest("div");
    expect(container).toHaveClass("transition-all");
    // Additional animation-specific tests can be added if animations are not mocked
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <PageHeader
        title="Snapshot Title"
        subtitle="Snapshot Subtitle"
        footer={<div>Snapshot Footer</div>}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
