import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IconGroup } from "./IconGroup";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

const mockIcons = [
  {
    name: "Group 1",
    icons: [
      { icon: Search, label: "Search", tooltip: "Search tooltip" },
      { icon: ChevronDown, label: "Down", tooltip: "Down tooltip" },
    ],
  },
  {
    name: "Group 2",
    icons: [{ icon: ChevronRight, label: "Right", tooltip: "Right tooltip" }],
  },
];

describe("IconGroup", () => {
  it("renders with default props", () => {
    render(<IconGroup icons={mockIcons} />);
    expect(screen.getByText("Group 1")).toBeInTheDocument();
    expect(screen.getByText("Group 2")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <IconGroup
        icons={mockIcons}
        layout="compact"
        columns={3}
        showLabels={false}
        size="lg"
      />
    );
    expect(screen.getByText("Group 1")).toBeInTheDocument();
    expect(screen.getByText("Group 2")).toBeInTheDocument();
  });

  it("toggles icon active state", () => {
    render(<IconGroup icons={mockIcons} />);
    const iconButton = screen.getByLabelText("Search");
    fireEvent.click(iconButton);
    expect(iconButton).toHaveClass("bg-primary text-primary-foreground");
  });

  it("toggles group expansion", () => {
    render(<IconGroup icons={mockIcons} />);
    const groupButton = screen.getByText("Group 1");
    fireEvent.click(groupButton);
    expect(screen.queryByLabelText("Search")).not.toBeInTheDocument();
  });

  it("searches icons", () => {
    render(<IconGroup icons={mockIcons} showSearch={true} />);
    const searchInput = screen.getByPlaceholderText("Search icons...");
    fireEvent.change(searchInput, { target: { value: "Right" } });
    expect(screen.getByLabelText("Right")).toBeInTheDocument();
    expect(screen.queryByLabelText("Search")).not.toBeInTheDocument();
  });

  it("handles onIconClick callback", () => {
    const handleIconClick = jest.fn();
    render(<IconGroup icons={mockIcons} onIconClick={handleIconClick} />);
    const iconButton = screen.getByLabelText("Search");
    fireEvent.click(iconButton);
    expect(handleIconClick).toHaveBeenCalledWith(0, 0);
  });
});
