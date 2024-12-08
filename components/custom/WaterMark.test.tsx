import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Watermark } from "./WaterMark";

jest.mock("@/hooks/create-watermark", () => ({
  createWatermark: jest.fn(() => "data:image/png;base64,watermark"),
}));

describe("Watermark", () => {
  it("renders with default props", () => {
    render(<Watermark content="Test Watermark" />);
    expect(screen.getByText("Test Watermark")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <Watermark
        content="Custom Watermark"
        fontSize={20}
        fontColor="rgba(0, 0, 0, .5)"
        width={100}
        height={100}
      />
    );
    expect(screen.getByText("Custom Watermark")).toBeInTheDocument();
  });

  it("generates watermark URL", () => {
    render(<Watermark content="Test Watermark" />);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle(
      "background-image: url(data:image/png;base64,watermark)"
    );
  });

  it("updates watermark on resize", () => {
    render(<Watermark content="Test Watermark" />);
    global.dispatchEvent(new Event("resize"));
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle(
      "background-image: url(data:image/png;base64,watermark)"
    );
  });

  it("updates watermark on interval", () => {
    jest.useFakeTimers();
    render(<Watermark content="Test Watermark" />);
    jest.advanceTimersByTime(1000);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle(
      "background-image: url(data:image/png;base64,watermark)"
    );
    jest.useRealTimers();
  });

  it("handles onClick event", () => {
    const handleClick = jest.fn();
    render(<Watermark content="Test Watermark" onClick={handleClick} />);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    fireEvent.click(watermarkDiv!);
    expect(handleClick).toHaveBeenCalled();
  });

  it("handles different density settings", () => {
    render(<Watermark content="Test Watermark" density="high" />);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle(
      "background-image: url(data:image/png;base64,watermark)"
    );
  });

  it("handles responsive settings", () => {
    render(<Watermark content="Test Watermark" responsive={true} />);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle(
      "background-image: url(data:image/png;base64,watermark)"
    );
  });

  it("handles fullscreen mode", () => {
    render(<Watermark content="Test Watermark" fullscreen={true} />);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle("position: fixed");
  });

  it("handles animation", () => {
    render(<Watermark content="Test Watermark" animation={true} />);
    const watermarkDiv = screen.getByText("Test Watermark").nextSibling;
    expect(watermarkDiv).toHaveStyle(
      "animation: watermark-animation 5s infinite"
    );
  });
});
