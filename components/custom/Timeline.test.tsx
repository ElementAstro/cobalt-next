import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Timeline, TimelineItem } from "./Timeline";

describe("Timeline", () => {
  it("renders correctly", () => {
    render(
      <Timeline>
        <TimelineItem title="Item 1" />
        <TimelineItem title="Item 2" />
      </Timeline>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(
      <Timeline className="custom-class">
        <TimelineItem title="Item 1" />
      </Timeline>
    );
    expect(screen.getByText("Item 1").parentElement?.parentElement).toHaveClass(
      "custom-class"
    );
  });

  it("renders horizontally", () => {
    render(
      <Timeline horizontal>
        <TimelineItem title="Item 1" />
      </Timeline>
    );
    expect(screen.getByText("Item 1").parentElement?.parentElement).toHaveClass(
      "flex"
    );
  });
});

describe("TimelineItem", () => {
  it("renders correctly", () => {
    render(
      <Timeline>
        <TimelineItem title="Item 1" />
      </Timeline>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders with time", () => {
    render(
      <Timeline>
        <TimelineItem title="Item 1" time="10:00 AM" />
      </Timeline>
    );
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
  });

  it("renders with different types", () => {
    render(
      <Timeline>
        <TimelineItem title="Success" type="success" />
        <TimelineItem title="Error" type="error" />
        <TimelineItem title="Warning" type="warning" />
        <TimelineItem title="Info" type="info" />
      </Timeline>
    );
    expect(screen.getByText("Success").previousSibling).toHaveClass(
      "bg-green-500"
    );
    expect(screen.getByText("Error").previousSibling).toHaveClass("bg-red-500");
    expect(screen.getByText("Warning").previousSibling).toHaveClass(
      "bg-yellow-500"
    );
    expect(screen.getByText("Info").previousSibling).toHaveClass("bg-blue-500");
  });

  it("handles collapsible functionality", () => {
    render(
      <Timeline>
        <TimelineItem title="Item 1" collapsible>
          <div>Details</div>
        </TimelineItem>
      </Timeline>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Item 1"));
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  it("handles horizontal layout", () => {
    render(
      <Timeline horizontal>
        <TimelineItem title="Item 1" />
      </Timeline>
    );
    expect(screen.getByText("Item 1").parentElement).toHaveClass(
      "flex-shrink-0"
    );
  });

  it("handles vertical layout", () => {
    render(
      <Timeline>
        <TimelineItem title="Item 1" />
      </Timeline>
    );
    expect(screen.getByText("Item 1").parentElement).toHaveClass("pl-8");
  });

  it("handles onClick event", () => {
    const handleClick = jest.fn();
    render(
      <Timeline>
        <TimelineItem title="Item 1" onClick={handleClick} />
      </Timeline>
    );
    fireEvent.click(screen.getByText("Item 1"));
    expect(handleClick).toHaveBeenCalled();
  });
});
