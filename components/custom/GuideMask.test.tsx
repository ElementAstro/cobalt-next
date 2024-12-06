import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { GuideMask } from "./GuideMask";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const steps = [
  {
    target: "#step1",
    content: "Content for Step 1",
    skippable: true,
    interaction: jest.fn(),
    hotkey: "i",
  },
  {
    target: "#step2",
    content: "Content for Step 2",
  },
  {
    target: "#step3",
    content: "Content for Step 3",
  },
];

describe("GuideMask", () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
    document.body.innerHTML = `
      <div id="step1">Step 1</div>
      <div id="step2">Step 2</div>
      <div id="step3">Step 3</div>
    `;
  });

  it("renders correctly with default props", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    expect(screen.getByText("Content for Step 1")).toBeInTheDocument();
  });

  it("applies custom language", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} language="zh" />);
    expect(screen.getByText("下一步")).toBeInTheDocument();
  });

  it("saves and loads progress correctly", () => {
    localStorage.setItem("guideMaskProgress", "1");
    render(<GuideMask steps={steps} onComplete={() => {}} saveProgress />);
    expect(screen.getByText("Content for Step 2")).toBeInTheDocument();
  });

  it("applies dark mode classes", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    const container = screen.getByText("Content for Step 1").closest("div");
    expect(container).toHaveClass("bg-gray-800 text-white");
  });

  it("handles next and previous button clicks", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Content for Step 2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("Content for Step 1")).toBeInTheDocument();
  });

  it("skips steps when skippable is true", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    fireEvent.click(screen.getByText("Skip"));
    expect(screen.getByText("Content for Step 2")).toBeInTheDocument();
  });

  it("calls interaction function when interaction button is clicked", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    fireEvent.click(screen.getByText("Interact"));
    expect(steps[0].interaction).toHaveBeenCalled();
  });

  it("handles hotkeys correctly", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("Content for Step 2")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("Content for Step 1")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "i" });
    expect(steps[0].interaction).toHaveBeenCalled();
  });

  it("shows and hides hotkeys", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    fireEvent.click(screen.getByText("Show Hotkeys"));
    expect(screen.getByText("→ / Enter: Next")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Hotkeys"));
    expect(screen.queryByText("→ / Enter: Next")).not.toBeInTheDocument();
  });

  it("updates target rect on window resize", () => {
    render(<GuideMask steps={steps} onComplete={() => {}} />);
    global.innerWidth = 500;
    fireEvent(window, new Event("resize"));
    // Check if target rect is updated correctly
    const targetRect = screen.getByText("Content for Step 1").closest("div");
    expect(targetRect).toHaveStyle({
      top: "0px",
      left: "0px",
    });
  });
});