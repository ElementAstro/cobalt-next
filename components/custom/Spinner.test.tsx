import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders correctly", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies the correct size variant", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status").firstChild).toHaveClass("w-12 h-12");
  });

  it("applies the correct variant", () => {
    render(<Spinner variant="danger" />);
    expect(screen.getByRole("status").firstChild).toHaveClass("border-red-500");
  });

  it("applies the correct animation", () => {
    render(<Spinner animation="pulse" />);
    expect(screen.getByRole("status").firstChild).toHaveClass("animate-pulse");
  });

  it("applies the correct thickness", () => {
    render(<Spinner borderThickness="thick" />);
    expect(screen.getByRole("status").firstChild).toHaveClass("border-6");
  });

  it("applies the correct shape", () => {
    render(<Spinner shape="square" />);
    expect(screen.getByRole("status").firstChild).toHaveClass("rounded");
  });

  it("applies the custom color", () => {
    render(<Spinner variant="custom" customColor="purple" />);
    expect(screen.getByRole("status").firstChild).toHaveStyle(
      "border-color: purple"
    );
  });

  it("applies the correct duration", () => {
    render(<Spinner duration={2} />);
    expect(screen.getByRole("status").firstChild).toHaveStyle(
      "animation-duration: 2s"
    );
  });

  it("displays the label correctly", () => {
    render(<Spinner label="Loading data" />);
    expect(screen.getByLabelText("Loading data")).toBeInTheDocument();
  });
});
