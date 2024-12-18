import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Rating from "./Rating";

// Mock the lucide-react icons
jest.mock("lucide-react", () => ({
  Star: () => <div data-testid="star-icon">★</div>,
  StarHalf: () => <div data-testid="star-half-icon">½</div>,
  Loader2: () => <div data-testid="loader-icon">Loading...</div>,
}));

describe("Rating Component", () => {
  const mockOnChange = jest.fn();
  const mockOnHoverChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Core Functionality", () => {
    it("renders with default props", () => {
      const { container } = render(<Rating />);
      const stars = container.querySelectorAll('[class*="cursor-pointer"]');
      expect(stars).toHaveLength(5);
    });

    it("renders correct number of stars based on max prop", () => {
      const { container } = render(<Rating max={3} />);
      const stars = container.querySelectorAll('[class*="cursor-pointer"]');
      expect(stars).toHaveLength(3);
    });

    it("handles click events correctly", () => {
      const { container } = render(<Rating onChange={mockOnChange} />);
      const stars = container.querySelectorAll('[class*="cursor-pointer"]');
      fireEvent.click(stars[2]);
      expect(mockOnChange).toHaveBeenCalledWith(3);
    });

    it("handles hover events correctly", () => {
      const { container } = render(
        <Rating onHoverChange={mockOnHoverChange} />
      );
      const stars = container.querySelectorAll('[class*="cursor-pointer"]');
      fireEvent.mouseEnter(stars[2]);
      expect(mockOnHoverChange).toHaveBeenCalledWith(3);
      fireEvent.mouseLeave(stars[2]);
      expect(mockOnHoverChange).toHaveBeenCalledWith(null);
    });

    it("supports half-star precision", () => {
      const { container } = render(<Rating precision={0.5} value={2.5} />);
      expect(
        container.querySelector('[data-testid="star-half-icon"]')
      ).toBeInTheDocument();
    });

    it("handles clear functionality", () => {
      const { container } = render(
        <Rating allowClear value={3} onChange={mockOnChange} />
      );
      const clearButton = container.querySelector(".ml-2");
      fireEvent.click(clearButton!);
      expect(mockOnChange).toHaveBeenCalledWith(0);
    });
  });

  describe("Visual States", () => {
    it("displays loading state", () => {
      render(<Rating loading />);
      expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    });

    it("applies disabled state correctly", () => {
      const { container } = render(<Rating disabled />);
      const stars = container.querySelectorAll('[class*="cursor-not-allowed"]');
      expect(stars.length).toBeGreaterThan(0);
    });

    it("applies readonly state correctly", () => {
      const { container } = render(<Rating readonly />);
      const stars = container.querySelectorAll('[class*="cursor-default"]');
      expect(stars.length).toBeGreaterThan(0);
    });

    it("applies correct size classes", () => {
      const { container } = render(<Rating size="lg" />);
      const star = container.querySelector(".w-8.h-8");
      expect(star).toBeInTheDocument();
    });

    it("applies custom colors correctly", () => {
      const { container } = render(<Rating selectedColor="text-red-500" />);
      expect(container.querySelector(".text-red-500")).toBeInTheDocument();
    });

    it("applies animations correctly", () => {
      const { container } = render(<Rating animation="pulse" value={3} />);
      const animatedStars = container.querySelectorAll(".animate-pulse");
      expect(animatedStars.length).toBe(3);
    });
  });

  describe("Additional Features", () => {
    it("renders label text when provided", () => {
      render(<Rating labelText="Rate this" />);
      expect(screen.getByText("Rate this")).toBeInTheDocument();
    });

    it("displays formatted value when showValue is true", () => {
      render(<Rating value={4} showValue />);
      expect(screen.getByText("4.0")).toBeInTheDocument();
    });

    it("renders custom value formatter", () => {
      render(
        <Rating value={4} showValue valueFormatter={(v) => `${v} stars`} />
      );
      expect(screen.getByText("4 stars")).toBeInTheDocument();
    });

    it("renders hidden input with name when provided", () => {
      const { container } = render(<Rating name="rating-input" value={3} />);
      const input = container.querySelector('input[type="hidden"]');
      expect(input).toHaveAttribute("name", "rating-input");
      expect(input).toHaveAttribute("value", "3");
    });

    it("renders tooltips when provided", () => {
      render(<Rating tooltips={["Bad", "Good", "Excellent"]} max={3} />);
      // Note: Tooltip testing might require additional setup depending on your tooltip implementation
      expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
    });

    it("uses custom icons when provided", () => {
      const customIcon = <div data-testid="custom-icon">*</div>;
      const { container } = render(<Rating icon={customIcon} />);
      const customIcons = container.querySelectorAll(
        '[data-testid="custom-icon"]'
      );
      expect(customIcons.length).toBeGreaterThan(0);
    });
  });
});
