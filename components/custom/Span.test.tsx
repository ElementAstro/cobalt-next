import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EnhancedSpan } from "./Span";
import { Mail } from "lucide-react";

// Mock framer-motion to avoid animation-related issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe("EnhancedSpan", () => {
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
      render(<EnhancedSpan>Test Content</EnhancedSpan>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(<EnhancedSpan icon={Mail}>With Icon</EnhancedSpan>);
      const iconContainer = screen.getByText("With Icon").parentElement;
      expect(iconContainer?.firstChild).toHaveClass("mr-1", "h-4", "w-4");
    });

    it("applies custom className", () => {
      render(<EnhancedSpan className="custom-class">Content</EnhancedSpan>);
      expect(screen.getByText("Content")).toHaveClass("custom-class");
    });
  });

  describe("Variants and Styles", () => {
    it.each(["default", "success", "warning", "error", "info"] as const)(
      "applies %s variant styles correctly",
      (variant) => {
        render(<EnhancedSpan variant={variant}>Content</EnhancedSpan>);
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
        render(<EnhancedSpan size={size}>Content</EnhancedSpan>);
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
      render(<EnhancedSpan copyable>Copy Text</EnhancedSpan>);
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
      render(<EnhancedSpan tooltip="Tooltip Text">Hover Me</EnhancedSpan>);
      expect(screen.getByText("Hover Me")).toBeInTheDocument();
      expect(screen.getByText("Tooltip Text")).toBeInTheDocument();
    });
  });

  describe("Style Combinations", () => {
    it("combines multiple style props correctly", () => {
      render(
        <EnhancedSpan
          variant="success"
          size="lg"
          truncate
          breakWords
          highlightOnHover
        >
          Content
        </EnhancedSpan>
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
      render(<EnhancedSpan maxWidth="200px">Content</EnhancedSpan>);
      expect(screen.getByText("Content")).toHaveStyle({ maxWidth: "200px" });
    });
  });

  describe("Animation States", () => {
    it.each(["pulse", "bounce", "shake"] as const)(
      "applies %s animation correctly",
      (animate) => {
        render(<EnhancedSpan animate={animate}>Content</EnhancedSpan>);
        const element = screen.getByText("Content");
        expect(element).toHaveAttribute("animate");
      }
    );
  });

  describe("Hover Effects", () => {
    it.each(["opacity", "scale", "underline"] as const)(
      "applies %s hover effect correctly",
      (effect) => {
        render(<EnhancedSpan hoverEffect={effect}>Content</EnhancedSpan>);
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
