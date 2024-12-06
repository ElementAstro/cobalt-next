import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Result } from "./Result";
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
      h2: React.forwardRef(
        (
          props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLHeadingElement> &
            React.HTMLAttributes<HTMLHeadingElement>,
          ref: React.LegacyRef<HTMLHeadingElement> | undefined
        ) => <h2 {...props} ref={ref} />
      ),
      p: React.forwardRef(
        (
          props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLParagraphElement> &
            React.HTMLAttributes<HTMLParagraphElement>,
          ref: React.LegacyRef<HTMLParagraphElement> | undefined
        ) => <p {...props} ref={ref} />
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("Result Component", () => {
  it("renders correctly with default props", () => {
    render(
      <Result status="info" title="Info Title" description="Info Description" />
    );
    expect(screen.getByText("Info Title")).toBeInTheDocument();
    expect(screen.getByText("Info Description")).toBeInTheDocument();
    expect(screen.getByText("ℹ️")).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(
      <Result
        status="success"
        title="Success Title"
        description="Success Description"
        color="bg-custom text-custom"
      />
    );
    const container = screen.getByText("Success Title").closest("div");
    expect(container).toHaveClass("bg-custom text-custom");
  });

  it("renders with custom icon", () => {
    render(
      <Result
        status="warning"
        title="Warning Title"
        description="Warning Description"
        icon={<span data-testid="custom-icon">⚠️</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const sizes = ["small", "medium", "large", "huge"] as const;
    sizes.forEach((size) => {
      render(
        <Result
          status="info"
          title={`${size} Title`}
          description={`${size} Description`}
          size={size}
        />
      );
      expect(screen.getByText(`${size} Title`)).toHaveClass(
        `text-${
          size === "huge"
            ? "4xl"
            : size === "large"
            ? "2xl"
            : size === "medium"
            ? "xl"
            : "lg"
        }`
      );
      // Clear the DOM for the next iteration
      cleanup();
    });
  });

  it("renders with footer content at bottom", () => {
    render(
      <Result
        status="error"
        title="Error Title"
        description="Error Description"
        footer={<div>Footer Content</div>}
        footerPosition="bottom"
      />
    );
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
    const footer = screen.getByText("Footer Content").parentElement;
    expect(footer).toHaveClass("mt-4");
  });

  it("renders with footer content at top", () => {
    render(
      <Result
        status="error"
        title="Error Title"
        description="Error Description"
        footer={<div>Footer Top Content</div>}
        footerPosition="top"
      />
    );
    expect(screen.getByText("Footer Top Content")).toBeInTheDocument();
    const footer = screen.getByText("Footer Top Content").parentElement;
    expect(footer).toHaveClass("mt-4");
  });

  it("handles close button click", () => {
    render(
      <Result status="info" title="Closable" description="Can be closed" />
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText("Closable")).not.toBeInTheDocument();
  });

  it("handles onAction callback", () => {
    const onActionMock = jest.fn();
    render(
      <Result
        status="success"
        title="Action Title"
        description="Action Description"
        onAction={onActionMock}
      />
    );
    const actionButton = screen.getByText("执行操作");
    fireEvent.click(actionButton);
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });

  it("toggles details on interactive click", () => {
    render(
      <Result
        status="info"
        title="Interactive Title"
        description="Interactive Description"
        interactive
        details="Detailed Information"
      />
    );
    expect(screen.queryByText("Detailed Information")).not.toBeInTheDocument();
    const interactiveDiv = screen.getByText("Interactive Title").closest("div");
    fireEvent.click(interactiveDiv!);
    expect(screen.getByText("Detailed Information")).toBeInTheDocument();
    fireEvent.click(interactiveDiv!);
    expect(screen.queryByText("Detailed Information")).not.toBeInTheDocument();
  });

  it("renders header content if provided", () => {
    render(
      <Result
        status="info"
        title="Header Title"
        description="Header Description"
        header={<div>Header Content</div>}
      />
    );
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("renders with custom animation preset", () => {
    render(
      <Result
        status="warning"
        title="Animated Title"
        description="Animated Description"
        animationPreset="bounce"
      />
    );
    const container = screen.getByText("Animated Title").closest("div");
    expect(container).toHaveClass("transition-all");
    // Additional animation-specific tests can be added if animations are not mocked
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <Result
        status="success"
        title="Snapshot Title"
        description="Snapshot Description"
        footer={<div>Snapshot Footer</div>}
        onAction={() => {}}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
