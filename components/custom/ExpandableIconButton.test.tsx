import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ExpandableIconButton } from "./ExpandableIconButton";
import { Home } from "lucide-react";

describe("ExpandableIconButton", () => {
  const defaultProps = {
    icon: Home,
    text: "Home",
  };

  it("renders with default props", () => {
    render(<ExpandableIconButton {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("expands on hover when expandTrigger is 'hover'", () => {
    render(<ExpandableIconButton {...defaultProps} expandTrigger="hover" />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(screen.getByText("Home")).toBeVisible();

    fireEvent.mouseLeave(button);
    expect(screen.getByText("Home")).not.toBeVisible();
  });

  it("expands on click when expandTrigger is 'click'", () => {
    render(<ExpandableIconButton {...defaultProps} expandTrigger="click" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(screen.getByText("Home")).toBeVisible();

    fireEvent.click(button);
    expect(screen.getByText("Home")).not.toBeVisible();
  });

  it("applies custom styles correctly", () => {
    render(
      <ExpandableIconButton
        {...defaultProps}
        backgroundColor="bg-red-500"
        textColor="text-white"
        hoverBackgroundColor="hover:bg-red-700"
        hoverTextColor="hover:text-gray-300"
        iconSize={30}
        fontSize={16}
        borderRadius="rounded-lg"
        shadow="shadow-lg"
        hoverShadow="hover:shadow-xl"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-500 text-white hover:bg-red-700 hover:text-gray-300 rounded-lg shadow-lg hover:shadow-xl");
    expect(button.querySelector("svg")).toHaveAttribute("width", "30");
    expect(button.querySelector("svg")).toHaveAttribute("height", "30");
  });

  it("handles gradient background correctly", () => {
    render(
      <ExpandableIconButton
        {...defaultProps}
        gradient
        gradientFrom="from-blue-500"
        gradientTo="to-blue-700"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gradient-to-r from-blue-500 to-blue-700");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<ExpandableIconButton {...defaultProps} onClick={handleClick} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies icon rotation correctly", () => {
    render(<ExpandableIconButton {...defaultProps} iconRotation={45} expandTrigger="click" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(button.querySelector("svg")).toHaveStyle("transform: rotate(45deg)");

    fireEvent.click(button);
    expect(button.querySelector("svg")).toHaveStyle("transform: rotate(0deg)");
  });

  it("applies text transform correctly", () => {
    render(<ExpandableIconButton {...defaultProps} textTransform="uppercase" />);
    expect(screen.getByText("Home")).toHaveClass("uppercase");
  });

  it("applies custom padding and margin correctly", () => {
    render(<ExpandableIconButton {...defaultProps} padding="p-4" margin="m-2" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-4 m-2");
  });

  it("applies custom border color and width correctly", () => {
    render(<ExpandableIconButton {...defaultProps} borderColor="border-red-500" borderWidth="border-4" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-red-500 border-4");
  });
});