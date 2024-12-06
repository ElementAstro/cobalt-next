import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { GuideSteps } from "./GuideSteps";

const steps = [
  {
    title: "Step 1",
    description: "Description for Step 1",
    content: <div>Content for Step 1</div>,
  },
  {
    title: "Step 2",
    description: "Description for Step 2",
    content: <div>Content for Step 2</div>,
  },
  {
    title: "Step 3",
    description: "Description for Step 3",
    content: <div>Content for Step 3</div>,
  },
];

describe("GuideSteps", () => {
  it("renders correctly with default props", () => {
    render(
      <GuideSteps steps={steps} currentStep={1} onStepChange={() => {}} />
    );
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("applies custom colorScheme", () => {
    const colorScheme = {
      active: "red",
      completed: "yellow",
      default: "purple",
    };
    render(
      <GuideSteps
        steps={steps}
        currentStep={2}
        onStepChange={() => {}}
        colorScheme={colorScheme}
      />
    );
    const activeStep = screen.getByText("Step 1").previousSibling;
    expect(activeStep).toHaveClass("bg-yellow-100 dark:bg-yellow-800");
  });

  it("changes orientation to vertical", () => {
    render(
      <GuideSteps
        steps={steps}
        currentStep={1}
        onStepChange={() => {}}
        orientation="vertical"
      />
    );
    const container = screen.getByText("Step 1").closest("div");
    expect(container).toHaveClass("flex flex-col space-y-4");
  });

  it("shows step numbers when showStepNumbers is true", () => {
    render(
      <GuideSteps
        steps={steps}
        currentStep={1}
        onStepChange={() => {}}
        showStepNumbers={true}
      />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("handles step click and calls onStepChange", () => {
    const handleStepChange = jest.fn();
    render(
      <GuideSteps
        steps={steps}
        currentStep={1}
        onStepChange={handleStepChange}
      />
    );
    fireEvent.click(screen.getByText("Step 2"));
    expect(handleStepChange).toHaveBeenCalledWith(2);
  });

  it("expands and collapses step content when showStepContent is true", () => {
    render(
      <GuideSteps
        steps={steps}
        currentStep={1}
        onStepChange={() => {}}
        showStepContent={true}
      />
    );
    // Initially expanded
    expect(screen.getByText("Content for Step 1")).toBeInTheDocument();
    // Click to collapse
    fireEvent.click(screen.getByText("Step 1"));
    expect(screen.queryByText("Content for Step 1")).not.toBeInTheDocument();
    // Click to expand
    fireEvent.click(screen.getByText("Step 1"));
    expect(screen.getByText("Content for Step 1")).toBeInTheDocument();
  });

  it("auto expands current step when autoExpandCurrent is true", () => {
    render(
      <GuideSteps
        steps={steps}
        currentStep={2}
        onStepChange={() => {}}
        autoExpandCurrent={true}
        showStepContent={true}
      />
    );
    expect(screen.getByText("Content for Step 2")).toBeInTheDocument();
  });

  it("applies dark mode classes when darkMode is true", () => {
    render(
      <GuideSteps
        steps={steps}
        currentStep={1}
        onStepChange={() => {}}
        darkMode={true}
      />
    );
    const container = screen.getByText("Step 1").closest("div");
    expect(container).toHaveClass("dark");
  });

  it("responds to window resize and changes layout", () => {
    const { container } = render(
      <GuideSteps
        steps={steps}
        currentStep={1}
        onStepChange={() => {}}
        orientation="horizontal"
      />
    );
    // Initial layout should be horizontal
    expect(container.firstChild).toHaveClass(
      "flex flex-wrap justify-center items-center"
    );
    // Mock window width less than 640
    global.innerWidth = 500;
    fireEvent(window, new Event("resize"));
    // Re-render to apply changes
    expect(container.firstChild).toHaveClass("flex flex-col space-y-4");
  });
});
