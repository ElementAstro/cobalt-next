import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TimelineItem from "./TimelineItem";

describe("TimelineItem", () => {
  it("renders correctly with default props", () => {
    render(<TimelineItem title="Default Item" />);
    expect(screen.getByText("Default Item")).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<TimelineItem title="Colored Item" color="red" />);
    expect(
      screen.getByText("Colored Item").parentElement?.parentElement
    ).toHaveStyle({
      "--item-color": "red",
    });
  });

  it("renders with different types", () => {
    const types = ["default", "success", "info", "warning", "error"] as const;
    types.forEach((type) => {
      render(<TimelineItem title={`${type} Item`} type={type} />);
      expect(screen.getByText(`${type} Item`).previousSibling).toHaveClass(
        `bg-${
          type === "default"
            ? "gray-400 dark:bg-gray-500"
            : `${type}-500 dark:bg-${type}-600`
        }`
      );
    });
  });

  it("renders with different line types", () => {
    render(<TimelineItem title="Dashed Line Item" lineType="dashed" />);
    expect(
      screen.getByText("Dashed Line Item").parentElement?.previousSibling
    ).toHaveClass("border-dashed");
  });

  it("renders with custom icon", () => {
    render(
      <TimelineItem
        title="Icon Item"
        icon={<div data-testid="custom-icon" />}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders with header", () => {
    render(
      <TimelineItem title="Header Item" header={<div>Header Content</div>} />
    );
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <TimelineItem title="Footer Item" footer={<div>Footer Content</div>} />
    );
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders with children", () => {
    render(
      <TimelineItem title="Children Item">
        <div>Child Content</div>
      </TimelineItem>
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders with time", () => {
    render(<TimelineItem title="Timed Item" time="10:00 AM" />);
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
  });

  it("renders with content", () => {
    render(<TimelineItem title="Content Item" content="This is the content" />);
    expect(screen.getByText("This is the content")).toBeInTheDocument();
  });

  it("renders with custom icon size", () => {
    render(<TimelineItem title="Icon Size Item" iconSize={10} />);
    expect(screen.getByText("Icon Size Item").previousSibling).toHaveStyle({
      width: "10px",
      height: "10px",
    });
  });
});
