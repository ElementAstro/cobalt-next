import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GradientText from "./GradientText";
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

describe("GradientText Component", () => {
  it("renders correctly with default props", () => {
    render(<GradientText>Default Gradient Text</GradientText>);
    const gradientText = screen.getByText("Default Gradient Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveStyle({
      backgroundImage: "linear-gradient(90deg, #409EFF, #2D6FF7)",
    });
  });

  it("renders with custom gradient", () => {
    render(
      <GradientText gradient="linear-gradient(45deg, #FF0000, #00FF00)">
        Custom Gradient Text
      </GradientText>
    );
    const gradientText = screen.getByText("Custom Gradient Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveStyle({
      backgroundImage: "linear-gradient(45deg, #FF0000, #00FF00)",
    });
  });

  it("renders with custom size", () => {
    render(<GradientText size={24}>Custom Size Text</GradientText>);
    const gradientText = screen.getByText("Custom Size Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveClass("text-[24px]");
  });

  it("renders with responsive size", () => {
    render(
      <GradientText size={{ xs: "text-xs", sm: "text-sm", md: "text-md" }}>
        Responsive Size Text
      </GradientText>
    );
    const gradientText = screen.getByText("Responsive Size Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveClass("text-xs sm:text-sm md:text-md");
  });

  it("renders with custom font weight", () => {
    render(<GradientText fontWeight="bold">Bold Text</GradientText>);
    const gradientText = screen.getByText("Bold Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveStyle({ fontWeight: "bold" });
  });

  it("renders with custom text alignment", () => {
    render(<GradientText textAlign="center">Centered Text</GradientText>);
    const gradientText = screen.getByText("Centered Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveStyle({ textAlign: "center" });
  });

  it("applies animation correctly", () => {
    render(<GradientText animate>Animated Text</GradientText>);
    const gradientText = screen.getByText("Animated Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveStyle({
      opacity: 1,
      transform: "translateY(0)",
    });
  });

  it("applies hover effect correctly", () => {
    render(<GradientText hoverEffect>Hover Effect Text</GradientText>);
    const gradientText = screen.getByText("Hover Effect Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveClass(
      "transform transition-transform duration-300"
    );
  });

  it("renders with dark theme gradient", () => {
    render(
      <GradientText darkThemeGradient="linear-gradient(45deg, #000000, #FFFFFF)">
        Dark Theme Gradient Text
      </GradientText>
    );
    const gradientText = screen.getByText("Dark Theme Gradient Text");
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveStyle({
      backgroundImage: "linear-gradient(45deg, #000000, #FFFFFF)",
    });
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <GradientText>Snapshot Gradient Text</GradientText>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
