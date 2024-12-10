import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BluetoothIcon, WiFiIcon } from "./ConnectionIcon";

describe("BluetoothIcon", () => {
  it("renders with default props", () => {
    render(<BluetoothIcon />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(<BluetoothIcon size={32} color="red" strength="medium" />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toHaveAttribute("width", "32");
    expect(icon).toHaveAttribute("height", "32");
    expect(icon).toHaveAttribute("stroke", "red");
  });

  it("shows strength value when showStrengthValue is true", () => {
    render(<BluetoothIcon showStrengthValue={true} strength={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows tooltip on hover", () => {
    render(<BluetoothIcon strength={50} />);
    const iconContainer = screen.getByRole("img", {
      hidden: true,
    }).parentElement;
    fireEvent.mouseEnter(iconContainer!);
    expect(screen.getByText("Bluetooth Strength: 50%")).toBeInTheDocument();
  });

  it("applies animation class when animate is true", () => {
    render(<BluetoothIcon animate={true} />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toHaveClass("animate-pulse");
  });

  it("applies shape class when shape is circle", () => {
    render(<BluetoothIcon shape="circle" />);
    const iconContainer = screen.getByRole("img", {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass("rounded-full");
  });
});

describe("WiFiIcon", () => {
  it("renders with default props", () => {
    render(<WiFiIcon />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(<WiFiIcon size={32} color="red" strength="medium" />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toHaveAttribute("width", "32");
    expect(icon).toHaveAttribute("height", "32");
    expect(icon).toHaveAttribute("stroke", "red");
  });

  it("shows strength value when showStrengthValue is true", () => {
    render(<WiFiIcon showStrengthValue={true} strength={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows tooltip on hover", () => {
    render(<WiFiIcon strength={50} />);
    const iconContainer = screen.getByRole("img", {
      hidden: true,
    }).parentElement;
    fireEvent.mouseEnter(iconContainer!);
    expect(screen.getByText("Signal Strength: 50%")).toBeInTheDocument();
  });

  it("applies animation class when animate is true", () => {
    render(<WiFiIcon animate={true} />);
    const icon = screen.getByRole("img", { hidden: true });
    expect(icon).toHaveClass("animate-pulse");
  });

  it("applies shape class when shape is circle", () => {
    render(<WiFiIcon shape="circle" />);
    const iconContainer = screen.getByRole("img", {
      hidden: true,
    }).parentElement;
    expect(iconContainer).toHaveClass("rounded-full");
  });
});
