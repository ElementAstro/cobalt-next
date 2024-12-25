import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";
import { VerticalTabs } from "./VerticalTabs";
import { Home, Settings, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock framer-motion to avoid animation related issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockTabs = [
  {
    value: "home",
    label: "Home",
    icon: Home,
    content: <div>Home Content</div>,
  },
  {
    value: "settings",
    label: "Settings",
    icon: Settings,
    content: <div>Settings Content</div>,
  },
  {
    value: "profile",
    label: "Profile",
    icon: User,
    content: <div>Profile Content</div>,
    disabled: true,
  },
];

describe("VerticalTabs", () => {
  it("renders without crashing", () => {
    render(<VerticalTabs tabs={mockTabs} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home Content")).toBeInTheDocument();
  });

  it("displays empty state when no tabs are provided", () => {
    render(<VerticalTabs tabs={[]} />);
    expect(screen.getByText("No tabs available")).toBeInTheDocument();
  });

  it("selects the first tab by default", () => {
    render(<VerticalTabs tabs={mockTabs} />);
    expect(screen.getByText("Home Content")).toBeInTheDocument();
    expect(screen.queryByText("Settings Content")).not.toBeInTheDocument();
  });

  it("handles tab switching correctly", async () => {
    const onChange = jest.fn();
    render(<VerticalTabs tabs={mockTabs} onChange={onChange} />);

    const settingsTab = screen.getByText("Settings");
    fireEvent.click(settingsTab);

    expect(onChange).toHaveBeenCalledWith("settings");
    expect(screen.getByText("Settings Content")).toBeInTheDocument();
    expect(screen.queryByText("Home Content")).not.toBeInTheDocument();
  });

  it("respects defaultActiveTab prop", () => {
    render(
      <VerticalTabs tabs={mockTabs} defaultActiveTab="settings" />
    );
    expect(screen.getByText("Settings Content")).toBeInTheDocument();
    expect(screen.queryByText("Home Content")).not.toBeInTheDocument();
  });

  it("renders disabled tabs correctly", () => {
    render(<VerticalTabs tabs={mockTabs} />);
    const profileTab = screen.getByText("Profile");
    expect(profileTab).toHaveAttribute("disabled");
  });

  it("prevents clicking on disabled tabs", () => {
    const onChange = jest.fn();
    render(<VerticalTabs tabs={mockTabs} onChange={onChange} />);

    const profileTab = screen.getByText("Profile");
    fireEvent.click(profileTab);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText("Profile Content")).not.toBeInTheDocument();
  });

  it("renders icons when provided", () => {
    render(<VerticalTabs tabs={mockTabs} />);
    // Check if icons are rendered - note that we're checking for SVG elements
    expect(screen.getAllByRole("img", { hidden: true })).toHaveLength(3);
  });

  it("renders badges when showBadge is true", () => {
    const badgeContent = (tab: any) => <Badge>{tab.value}</Badge>;
    render(
      <VerticalTabs
        tabs={mockTabs}
        showBadge={true}
        badgeContent={badgeContent}
      />
    );
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("settings")).toBeInTheDocument();
  });

  it("applies custom styles correctly", () => {
    const activeTabStyle = { backgroundColor: "red" };
    const hoverTabStyle = { backgroundColor: "blue" };

    render(
      <VerticalTabs
        tabs={mockTabs}
        activeTabStyle={activeTabStyle}
        hoverTabStyle={hoverTabStyle}
      />
    );

    const activeTab = screen.getByText("Home").closest("button");
    expect(activeTab).toHaveStyle({ backgroundColor: "red" });
  });

  it("changes orientation correctly", () => {
    const { container } = render(
      <VerticalTabs tabs={mockTabs} orientation="right" />
    );
    expect(container.firstChild).toHaveClass("sm:flex-row-reverse");
  });

  it("respects custom tab and content widths", () => {
    const { container } = render(
      <VerticalTabs tabs={mockTabs} tabWidth="1/3" contentWidth="2/3" />
    );

    const tabList = container.querySelector('[role="tablist"]');
    const tabPanel = container.querySelector('[role="tabpanel"]');

    expect(tabList).toHaveClass("sm:w-1/3");
    expect(tabPanel).toHaveClass("sm:w-2/3");
  });

  it("handles tab changes with animation duration", async () => {
    const animationDuration = 0.5;
    render(
      <VerticalTabs
        tabs={mockTabs}
        animationDuration={animationDuration}
      />
    );

    const settingsTab = screen.getByText("Settings");
    fireEvent.click(settingsTab);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(screen.getByText("Settings Content")).toBeInTheDocument();
      },
      { timeout: animationDuration * 1000 }
    );
  });
});
