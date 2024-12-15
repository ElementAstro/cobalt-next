import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Span } from "./Span";
import { Mail } from "lucide-react";

// Mock framer-motion to avoid animation-related issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe("Span", () => {
  const mockClipboard = {
    writeText: jest.fn(),
  };

  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockClipboard.writeText.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders children correctly", () => {
      render(<Span>Test Content</Span>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(<Span icon={Mail}>With Icon</Span>);
      const iconContainer = screen.getByText("With Icon").parentElement;
      expect(iconContainer?.firstChild).toHaveClass("mr-1", "h-4", "w-4");
    });

    it("applies custom className", () => {
      render(<Span className="custom-class">Content</Span>);
      expect(screen.getByText("Content")).toHaveClass("custom-class");
    });
  });

  describe("Variants and Styles", () => {
    it.each(["default", "success", "warning", "error", "info"] as const)(
      "applies %s variant styles correctly",
      (variant) => {
        render(<Span variant={variant}>Content</Span>);
        const element = screen.getByText("Content");
        const expectedClass = {
          default: "text-gray-800",
          success: "text-green-600",
          warning: "text-yellow-600",
          error: "text-red-600",
          info: "text-blue-600",
        }[variant];
        expect(element).toHaveClass(expectedClass);
      }
    );

    it.each(["sm", "md", "lg"] as const)(
      "applies %s size correctly",
      (size) => {
        render(<Span size={size}>Content</Span>);
        const expectedClass = {
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg",
        }[size];
        expect(screen.getByText("Content")).toHaveClass(expectedClass);
      }
    );
  });

  describe("Interactive Features", () => {
    it("handles copy functionality", async () => {
      render(<Span copyable>Copy Text</Span>);
      const copyButton = screen.getByRole("button");

      fireEvent.click(copyButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Copy Text");
      expect(screen.getByText("✓")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(screen.getByText("📋")).toBeInTheDocument();
    });

    it("renders tooltip when provided", () => {
      render(<Span tooltip="Tooltip Text">Hover Me</Span>);
      expect(screen.getByText("Hover Me")).toBeInTheDocument();
      expect(screen.getByText("Tooltip Text")).toBeInTheDocument();
    });
  });

  describe("Style Combinations", () => {
    it("combines multiple style props correctly", () => {
      render(
        <Span
          variant="success"
          size="lg"
          truncate
          breakWords
          highlightOnHover
        >
          Content
        </Span>
      );

      const element = screen.getByText("Content");
      expect(element).toHaveClass(
        "text-green-600",
        "text-lg",
        "truncate",
        "break-words",
        "hover:bg-gray-100"
      );
    });

    it("applies maxWidth style correctly", () => {
      render(<Span maxWidth="200px">Content</Span>);
      expect(screen.getByText("Content")).toHaveStyle({ maxWidth: "200px" });
    });
  });

  describe("Animation States", () => {
    it.each(["pulse", "bounce", "shake"] as const)(
      "applies %s animation correctly",
      (animate) => {
        render(<Span animate={animate}>Content</Span>);
        const element = screen.getByText("Content");
        expect(element).toHaveAttribute("animate");
      }
    );
  });

  describe("Hover Effects", () => {
    it.each(["opacity", "scale", "underline"] as const)(
      "applies %s hover effect correctly",
      (effect) => {
        render(<Span hoverEffect={effect}>Content</Span>);
        const expectedClass = {
          opacity: "hover:opacity-80",
          scale: "hover:scale-105",
          underline: "hover:underline",
        }[effect];
        expect(screen.getByText("Content")).toHaveClass(expectedClass);
      }
    );
  });
});
