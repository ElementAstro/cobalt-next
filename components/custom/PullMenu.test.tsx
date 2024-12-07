import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { PullMenu, MenuItem } from "./PullMenu";
import { usePullMenuStore } from "@/lib/store/pull-menu";

jest.mock("@/lib/store/ppull-menu", () => ({
  usePullMenuStore: jest.fn(),
}));

const mockMenuItems: MenuItem[] = [
  { icon: <span>Icon1</span>, label: "Item 1" },
  { icon: <span>Icon2</span>, label: "Item 2" },
  { icon: <span>Icon3</span>, label: "Item 3" },
];

describe("PullMenu", () => {
  let setIsOpen: jest.Mock;
  let togglePinnedItem: jest.Mock;

  beforeEach(() => {
    setIsOpen = jest.fn();
    togglePinnedItem = jest.fn();
    (usePullMenuStore as unknown as jest.Mock<any, any>).mockReturnValue({
      isOpen: false,
      setIsOpen,
      pinnedItems: [],
      togglePinnedItem,
    });
  });

  it("renders correctly", () => {
    render(<PullMenu menuItems={mockMenuItems} />);
    expect(screen.getByText("Quick Menu")).toBeInTheDocument();
  });

  it("opens the menu on click", () => {
    render(<PullMenu menuItems={mockMenuItems} />);
    fireEvent.click(screen.getByText("Pull or click to open menu"));
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it("closes the menu on overlay click", () => {
    (usePullMenuStore as unknown as jest.Mock).mockReturnValue({
      isOpen: true,
      setIsOpen,
      pinnedItems: [],
      togglePinnedItem,
    });
    render(<PullMenu menuItems={mockMenuItems} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("filters menu items based on search input", () => {
    render(<PullMenu menuItems={mockMenuItems} />);
    fireEvent.change(screen.getByPlaceholderText("Search menu items..."), {
      target: { value: "Item 1" },
    });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });

  it("calls onMenuItemClick when a menu item is clicked", () => {
    const onMenuItemClick = jest.fn();
    render(
      <PullMenu menuItems={mockMenuItems} onMenuItemClick={onMenuItemClick} />
    );
    fireEvent.click(screen.getByText("Item 1"));
    expect(onMenuItemClick).toHaveBeenCalledWith(mockMenuItems[0]);
  });

  it("pins and unpins a menu item", () => {
    render(<PullMenu menuItems={mockMenuItems} />);
    fireEvent.click(screen.getByText("Item 1"));
    fireEvent.click(screen.getByRole("button", { name: /star/i }));
    expect(togglePinnedItem).toHaveBeenCalledWith("Item 1");
  });

  it("applies custom styles", () => {
    const customStyles = {
      menuBackground: "red",
      menuText: "white",
      indicatorBackground: "blue",
      indicatorText: "yellow",
    };
    render(<PullMenu menuItems={mockMenuItems} customStyles={customStyles} />);
    expect(screen.getByText("Quick Menu")).toHaveStyle({
      backgroundColor: "red",
      color: "white",
    });
  });
});
