import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Stopwatch } from "./Stopwatch";

describe("Stopwatch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly in classic style and light mode", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    expect(screen.getByText("00:00.00")).toBeInTheDocument();
  });

  it("renders correctly in modern style and dark mode", () => {
    render(<Stopwatch style="modern" darkMode={true} />);
    expect(screen.getByText("00:00.00")).toBeInTheDocument();
  });

  it("starts and stops the stopwatch", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    const startButton = screen.getByText("开始");
    fireEvent.click(startButton);
    expect(screen.getByText("停止")).toBeInTheDocument();
    jest.advanceTimersByTime(1000);
    expect(screen.getByText("00:01.00")).toBeInTheDocument();
    fireEvent.click(screen.getByText("停止"));
    expect(screen.getByText("开始")).toBeInTheDocument();
  });

  it("resets the stopwatch", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    const startButton = screen.getByText("开始");
    fireEvent.click(startButton);
    jest.advanceTimersByTime(1000);
    fireEvent.click(screen.getByText("停止"));
    fireEvent.click(screen.getByText("重置"));
    expect(screen.getByText("00:00.00")).toBeInTheDocument();
  });

  it("records lap times", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    const startButton = screen.getByText("开始");
    fireEvent.click(startButton);
    jest.advanceTimersByTime(1000);
    fireEvent.click(screen.getByText("记录分段"));
    expect(screen.getByText("分段 1")).toBeInTheDocument();
    expect(screen.getByText("00:01.00")).toBeInTheDocument();
  });

  it("toggles sound", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    const soundButton = screen.getByRole("button", { name: /volume/i });
    fireEvent.click(soundButton);
    expect(screen.getByRole("button", { name: /volume/i })).toBeInTheDocument();
  });

  it("applies dark mode styles correctly", () => {
    render(<Stopwatch style="classic" darkMode={true} />);
    const stopwatchContainer = screen.getByText("00:00.00").closest("div");
    expect(stopwatchContainer).toHaveClass("bg-gray-800");
  });

  it("applies light mode styles correctly", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    const stopwatchContainer = screen.getByText("00:00.00").closest("div");
    expect(stopwatchContainer).toHaveClass("bg-gray-100");
  });

  it("displays alert when no laps are recorded", () => {
    render(<Stopwatch style="classic" darkMode={false} />);
    expect(screen.getByText("点击\"记录分段\"按钮来记录时间。")).toBeInTheDocument();
  });
});