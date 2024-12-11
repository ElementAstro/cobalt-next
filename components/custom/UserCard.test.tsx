import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserCard from "./UserCard";

describe("UserCard Component", () => {
  const defaultProps = {
    position: "Software Engineer",
    email: "test@example.com",
    phone: "123-456-7890",
    onContactClick: jest.fn(),
    onDarkModeToggle: jest.fn(),
  };

  it("renders with default props", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText("Anonymous User")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
  });

  it("toggles dark mode", () => {
    render(<UserCard {...defaultProps} darkMode={false} />);
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    expect(defaultProps.onDarkModeToggle).toHaveBeenCalledWith(true);
  });

  it("shows more details when '查看更多' button is clicked", () => {
    render(<UserCard {...defaultProps} interests={["Coding", "Reading"]} />);
    const button = screen.getByText("查看更多");
    fireEvent.click(button);
    expect(screen.getByText("兴趣爱好:")).toBeInTheDocument();
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Reading")).toBeInTheDocument();
  });

  it("flips the card when '翻转卡片' button is clicked", () => {
    render(<UserCard {...defaultProps} />);
    const button = screen.getByText("翻转卡片");
    fireEvent.click(button);
    expect(screen.getByText("关于 Anonymous User")).toBeInTheDocument();
  });

  it("calls onContactClick when '联系' button is clicked", () => {
    render(<UserCard {...defaultProps} />);
    const button = screen.getByText("联系");
    fireEvent.click(button);
    expect(defaultProps.onContactClick).toHaveBeenCalled();
  });

  it("renders social media links correctly", () => {
    render(
      <UserCard
        {...defaultProps}
        twitter="https://twitter.com/test"
        github="https://github.com/test"
        linkedin="https://linkedin.com/in/test"
      />
    );
    expect(screen.getByLabelText("Twitter 个人主页")).toHaveAttribute(
      "href",
      "https://twitter.com/test"
    );
    expect(screen.getByLabelText("GitHub 个人主页")).toHaveAttribute(
      "href",
      "https://github.com/test"
    );
    expect(screen.getByLabelText("LinkedIn 个人主页")).toHaveAttribute(
      "href",
      "https://linkedin.com/in/test"
    );
  });
});
