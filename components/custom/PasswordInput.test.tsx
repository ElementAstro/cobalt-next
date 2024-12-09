import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdvancedPasswordInput from "./PasswordInput";
import zxcvbn from "zxcvbn";

// Mock zxcvbn to control password strength
jest.mock("zxcvbn");

describe("AdvancedPasswordInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default state", () => {
    render(<AdvancedPasswordInput />);
    expect(screen.getByPlaceholderText("输入您的密码")).toBeInTheDocument();
    expect(screen.getByText("密码强度: 弱")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<AdvancedPasswordInput />);
    const toggleButton = screen.getByRole("button", { name: /显示密码/i });
    fireEvent.click(toggleButton);
    expect(screen.getByPlaceholderText("输入您的密码")).toHaveAttribute(
      "type",
      "text"
    );
    fireEvent.click(toggleButton);
    expect(screen.getByPlaceholderText("输入您的密码")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("updates password strength meter", () => {
    (zxcvbn as jest.Mock).mockReturnValue({ score: 2 });
    render(<AdvancedPasswordInput />);
    fireEvent.change(screen.getByPlaceholderText("输入您的密码"), {
      target: { value: "password123" },
    });
    expect(screen.getByText("密码强度: 中")).toBeInTheDocument();
  });

  it("generates a new password", () => {
    render(<AdvancedPasswordInput />);
    const generateButton = screen.getByRole("button", { name: /生成密码/i });
    fireEvent.click(generateButton);
    expect(screen.getByPlaceholderText("输入您的密码")).not.toHaveValue("");
  });

  it("copies password to clipboard", async () => {
    render(<AdvancedPasswordInput />);
    fireEvent.change(screen.getByPlaceholderText("输入您的密码"), {
      target: { value: "password123" },
    });
    const copyButton = screen.getByRole("button", { name: /复制密码/i });
    fireEvent.click(copyButton);
    await waitFor(() => expect(screen.getByText("已复制")).toBeInTheDocument());
  });

  it("displays password requirements", () => {
    render(<AdvancedPasswordInput />);
    fireEvent.change(screen.getByPlaceholderText("输入您的密码"), {
      target: { value: "password123" },
    });
    expect(screen.getByText("至少8个字符")).toBeInTheDocument();
    expect(screen.getByText("至少一个数字")).toBeInTheDocument();
    expect(screen.getByText("至少一个小写字母")).toBeInTheDocument();
    expect(screen.getByText("至少一个大写字母")).toBeInTheDocument();
    expect(screen.getByText("至少一个特殊字符")).toBeInTheDocument();
  });

  it("updates password length", () => {
    render(<AdvancedPasswordInput />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: 20 } });
    expect(screen.getByText("密码长度: 20")).toBeInTheDocument();
  });

  it("toggles use of numbers and symbols", () => {
    render(<AdvancedPasswordInput />);
    const numbersCheckbox = screen.getByLabelText("包含数字");
    const symbolsCheckbox = screen.getByLabelText("包含符号");
    fireEvent.click(numbersCheckbox);
    expect(numbersCheckbox).not.toBeChecked();
    fireEvent.click(symbolsCheckbox);
    expect(symbolsCheckbox).not.toBeChecked();
  });

  it("displays warning for weak password", () => {
    (zxcvbn as jest.Mock).mockReturnValue({ score: 1 });
    render(<AdvancedPasswordInput />);
    fireEvent.change(screen.getByPlaceholderText("输入您的密码"), {
      target: { value: "weak" },
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("您的密码较弱，请考虑使用更强的密码。")
    ).toBeInTheDocument();
  });
});
