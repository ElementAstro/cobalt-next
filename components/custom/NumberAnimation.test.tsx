import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NumberAnimation from "./NumberAnimation";
import { motion } from "framer-motion";

// Mock framer-motion to avoid animations during testing
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      span: React.forwardRef(
        (
          props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLSpanElement> &
            React.HTMLAttributes<HTMLSpanElement>,
          ref: React.LegacyRef<HTMLSpanElement> | undefined
        ) => <span {...props} ref={ref} />
      ),
    },
  };
});

describe("NumberAnimation Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly with default props", () => {
    render(<NumberAnimation to={100} />);
    const numberAnimation = screen.getByText("0");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("animates to the target value", () => {
    render(<NumberAnimation to={100} duration={1000} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const numberAnimation = screen.getByText("100");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("applies custom precision", () => {
    render(<NumberAnimation to={100} precision={2} />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const numberAnimation = screen.getByText("100.00");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("applies custom locale", () => {
    render(<NumberAnimation to={1000} locale="de-DE" />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const numberAnimation = screen.getByText("1.000");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("applies custom format function", () => {
    const format = (value: number) => `$${value.toFixed(2)}`;
    render(<NumberAnimation to={100} format={format} />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const numberAnimation = screen.getByText("$100.00");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("applies custom easing function", () => {
    const easing = (t: number) => t * t;
    render(<NumberAnimation to={100} easing={easing} />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const numberAnimation = screen.getByText("100");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("applies custom unit", () => {
    render(<NumberAnimation to={100} unit="%" />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const numberAnimation = screen.getByText("100%");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("applies color interpolation", () => {
    render(
      <NumberAnimation
        to={100}
        fromColor="rgb(255, 0, 0)"
        toColor="rgb(0, 255, 0)"
      />
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const numberAnimation = screen.getByText("100");
    expect(numberAnimation).toHaveStyle({ color: "rgb(0, 255, 0)" });
  });

  it("handles bounce effect", () => {
    render(<NumberAnimation to={100} bounce />);
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    const numberAnimation = screen.getByText("0");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("handles loop effect", () => {
    render(<NumberAnimation to={100} loop />);
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    const numberAnimation = screen.getByText("0");
    expect(numberAnimation).toBeInTheDocument();
  });

  it("handles delay", () => {
    render(<NumberAnimation to={100} delay={1000} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const numberAnimation = screen.getByText("0");
    expect(numberAnimation).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("calls onFinish callback", () => {
    const onFinish = jest.fn();
    render(<NumberAnimation to={100} onFinish={onFinish} />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<NumberAnimation to={100} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
