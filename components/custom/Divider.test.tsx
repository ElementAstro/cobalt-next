import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Divider } from "./Divider";

describe("Divider", () => {
  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      render(<Divider />);
      expect(document.querySelector("div")).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<Divider label="Test Label" />);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("renders with children", () => {
      render(<Divider>Test Children</Divider>);
      expect(screen.getByText("Test Children")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Divider className="custom-class" />);
      expect(document.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("Orientation Tests", () => {
    it("renders with horizontal orientation by default", () => {
      render(<Divider />);
      const divider = document.querySelector("div");
      expect(divider).toHaveClass("w-full");
    });

    it("renders with vertical orientation", () => {
      render(<Divider orientation="vertical" />);
      const divider = document.querySelector("div");
      expect(divider).toHaveClass("h-full");
      expect(divider).toHaveClass("flex-col");
    });
  });

  describe("Variant Tests", () => {
    it.each(["solid", "dashed", "dotted"] as const)(
      "renders %s variant correctly",
      (variant) => {
        render(<Divider variant={variant} />);
        const line = document.querySelector("div > div:last-child");
        expect(line).toHaveStyle({ borderStyle: variant });
      }
    );
  });

  describe("Label Position Tests", () => {
    it.each(["left", "center", "right"] as const)(
      "renders label in %s position",
      (position) => {
        render(<Divider label="Test" labelPosition={position} />);
        const label = screen.getByText("Test");
        if (position === "left") expect(label).toHaveClass("mr-auto");
        if (position === "right") expect(label).toHaveClass("ml-auto");
      }
    );
  });

  describe("Style Props Tests", () => {
    it("applies custom color", () => {
      render(<Divider color="#ff0000" />);
      const line = document.querySelector("div > div:last-child");
      expect(line).toHaveStyle({ backgroundColor: "#ff0000" });
    });

    it("applies custom thickness", () => {
      render(<Divider thickness={2} />);
      const line = document.querySelector("div > div:last-child");
      expect(line).toHaveStyle({ borderTopWidth: "2px" });
    });

    it("applies custom spacing", () => {
      const spacing = 32;
      render(<Divider spacing={spacing} label="Test" />);
      const label = screen.getByText("Test");
      expect(label).toHaveClass(`mx-${spacing / 4}`);
    });

    it("combines multiple style props correctly", () => {
      render(
        <Divider
          color="#ff0000"
          thickness={2}
          variant="dashed"
          orientation="vertical"
        />
      );
      const line = document.querySelector("div > div:last-child");
      expect(line).toHaveStyle({
        borderColor: "#ff0000",
        borderStyle: "dashed",
        borderLeftWidth: "2px",
      });
    });
  });
});
