import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Clock } from "./Clock";

describe("Clock", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly in light mode", () => {
    render(<Clock />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("renders correctly in dark mode", () => {
    render(<Clock darkMode />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("updates time every second", () => {
    render(<Clock />);
    const initialTime = screen.getByText(new Date().toLocaleTimeString());
    jest.advanceTimersByTime(1000);
    const updatedTime = screen.getByText(new Date().toLocaleTimeString());
    expect(initialTime).not.toEqual(updatedTime);
  });

  it("displays the correct digital time and date", () => {
    render(<Clock />);
    const currentTime = new Date();
    expect(
      screen.getByText(currentTime.toLocaleTimeString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(currentTime.toLocaleDateString())
    ).toBeInTheDocument();
  });

  it("renders clock hands correctly", () => {
    render(<Clock />);
    const hourHand = screen.getByRole("hour-hand");
    const minuteHand = screen.getByRole("minute-hand");
    const secondHand = screen.getByRole("second-hand");

    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    expect(secondHand).toBeInTheDocument();
  });

  it("applies dark mode styles correctly", () => {
    render(<Clock darkMode />);
    const clockFace = screen.getByRole("clock-face");
    expect(clockFace).toHaveClass("bg-gray-800");
    expect(clockFace).toHaveClass("text-white");
  });

  it("applies light mode styles correctly", () => {
    render(<Clock />);
    const clockFace = screen.getByRole("clock-face");
    expect(clockFace).toHaveClass("bg-white");
    expect(clockFace).toHaveClass("text-gray-800");
  });
});
