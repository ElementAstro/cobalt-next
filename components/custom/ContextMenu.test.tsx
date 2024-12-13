import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CustomContextMenu } from "./ContextMenu";
import { Settings, User } from "lucide-react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("CustomContextMenu", () => {
  const basicItems = [
    {
      id: "1",
      type: "item" as const,
      label: "Test Item",
      icon: Settings,
      onClick: jest.fn(),
    },
  ];

  it("renders basic menu items", () => {
    render(
      <CustomContextMenu items={basicItems}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("renders checkbox menu items", () => {
    const checkboxItems = [
      {
        id: "2",
        type: "checkbox" as const,
        label: "Check me",
        checked: false,
        onCheckedChange: jest.fn(),
      },
    ];

    render(
      <CustomContextMenu items={checkboxItems}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.contextMenu(trigger);
    expect(screen.getByText("Check me")).toBeInTheDocument();
  });

  it("renders radio menu items", () => {
    const radioItems = [
      {
        id: "3",
        type: "submenu" as const,
        label: "Options",
        items: [
          { id: "r1", type: "radio" as const, label: "Option 1", value: "1" },
          { id: "r2", type: "radio" as const, label: "Option 2", value: "2" },
        ],
        value: "1",
        onValueChange: jest.fn(),
      },
    ];

    render(
      <CustomContextMenu items={radioItems}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.contextMenu(trigger);
    expect(screen.getByText("Options")).toBeInTheDocument();
  });

  it("handles menu item clicks", () => {
    const onClick = jest.fn();
    const items = [
      {
        id: "4",
        type: "item" as const,
        label: "Click me",
        onClick,
      },
    ];

    render(
      <CustomContextMenu items={items}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.contextMenu(trigger);
    const menuItem = screen.getByText("Click me");
    fireEvent.click(menuItem);
    expect(onClick).toHaveBeenCalled();
  });

  it("renders separators and labels", () => {
    const items = [
      {
        id: "5",
        type: "label" as const,
        label: "Section",
      },
      {
        id: "6",
        type: "separator" as const,
      },
      {
        id: "7",
        type: "item" as const,
        label: "Item",
      },
    ];

    render(
      <CustomContextMenu items={items}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.contextMenu(trigger);
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Item")).toBeInTheDocument();
  });

  it("applies custom classNames", () => {
    render(
      <CustomContextMenu
        items={basicItems}
        className="test-class"
        contentClassName="content-class"
      >
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    expect(trigger.parentElement).toHaveClass("test-class");
  });

  it("renders disabled menu items", () => {
    const items = [
      {
        id: "8",
        type: "item" as const,
        label: "Disabled Item",
        disabled: true,
      },
    ];

    render(
      <CustomContextMenu items={items}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.contextMenu(trigger);
    const menuItem = screen.getByText("Disabled Item");
    expect(menuItem).toHaveAttribute("aria-disabled", "true");
  });

  it("renders items with shortcuts", () => {
    const items = [
      {
        id: "9",
        type: "item" as const,
        label: "Save",
        shortcut: "⌘+S",
      },
    ];

    render(
      <CustomContextMenu items={items}>
        <div>Trigger</div>
      </CustomContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.contextMenu(trigger);
    expect(screen.getByText("⌘+S")).toBeInTheDocument();
  });
});
