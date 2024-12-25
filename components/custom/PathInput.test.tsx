import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PathInput } from "./PathInput";
import { act } from "react-dom/test-utils";

// Mock the hooks
jest.mock("@/hooks/use-path-autocomplete", () => ({
  usePathAutocomplete: jest.fn((path) => {
    if (path === "/test") {
      return ["/test/path1", "/test/path2"];
    }
    return [];
  }),
}));

jest.mock("@/hooks/use-path-validation", () => ({
  usePathValidation: jest.fn((path, type, allowRelative) => {
    if (path === "/valid/path") {
      return { isValid: true, error: null };
    }
    return { isValid: false, error: "Invalid path" };
  }),
}));

describe("PathInput Component", () => {
  const defaultProps = {
    onValidPath: jest.fn(),
    customPaths: [],
    initialPathType: "unix" as const,
    allowRelativePaths: false,
    maxHistoryItems: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<PathInput {...defaultProps} />);
    expect(screen.getByLabelText("输入路径")).toBeInTheDocument();
    expect(screen.getByLabelText("允许相对路径")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles input changes", async () => {
    render(<PathInput {...defaultProps} />);
    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/test");
    expect(input).toHaveValue("/test");
  });

  it("shows autocomplete suggestions", async () => {
    render(<PathInput {...defaultProps} />);
    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/test");
    await waitFor(() => {
      expect(screen.getByText("/test/path1")).toBeInTheDocument();
      expect(screen.getByText("/test/path2")).toBeInTheDocument();
    });
  });

  it("handles path type switching", async () => {
    render(<PathInput {...defaultProps} />);
    const select = screen.getByRole("combobox");
    await userEvent.click(select);
    await userEvent.click(screen.getByText("Windows 路径"));
    expect(select).toHaveTextContent("Windows 路径");
  });

  it("displays validation error", async () => {
    render(<PathInput {...defaultProps} />);
    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/invalid/path");
    expect(await screen.findByText("Invalid path")).toBeInTheDocument();
  });

  it("shows success icon for valid path", async () => {
    render(<PathInput {...defaultProps} />);
    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/valid/path");
    expect(screen.getByTestId("check-circle")).toBeInTheDocument();
  });

  it("handles folder selection", async () => {
    render(<PathInput {...defaultProps} />);
    const folderButton = screen.getByLabelText("选择文件夹");
    const fileInput = screen.getByRole("file-input", { hidden: true });

    const file = new File([""], "test.txt", { type: "text/plain" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: dataTransfer.files } });
    });

    expect(screen.getByLabelText("输入路径")).toHaveValue("test.txt");
  });

  it("manages path history", async () => {
    render(<PathInput {...defaultProps} />);
    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/valid/path");

    const historyButton = screen.getByLabelText("查看路径历史");
    await userEvent.click(historyButton);

    expect(screen.getByText("/valid/path")).toBeInTheDocument();
  });

  it("renders path preview correctly", async () => {
    render(<PathInput {...defaultProps} />);
    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/test/path");

    const previewButton = screen.getByLabelText("预览路径");
    await userEvent.click(previewButton);

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("path")).toBeInTheDocument();
  });

  it("handles custom icons", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;
    render(
      <PathInput
        {...defaultProps}
        customIcons={{
          folder: <CustomIcon />,
          history: <CustomIcon />,
          preview: <CustomIcon />,
        }}
      />
    );

    const customIcons = screen.getAllByTestId("custom-icon");
    expect(customIcons).toHaveLength(3);
  });

  it("handles relative path toggle", async () => {
    const onValidPath = jest.fn();
    render(
      <PathInput
        {...defaultProps}
        onValidPath={onValidPath}
        allowRelativePaths={true}
      />
    );

    const toggle = screen.getByRole("switch");
    await userEvent.click(toggle);

    expect(toggle).toBeChecked();
  });

  it("respects maxHistoryItems limit", async () => {
    render(<PathInput {...defaultProps} maxHistoryItems={2} />);
    const input = screen.getByLabelText("输入路径");

    // Add three paths
    await userEvent.type(input, "/path1{enter}");
    await userEvent.type(input, "/path2{enter}");
    await userEvent.type(input, "/path3{enter}");

    const historyButton = screen.getByLabelText("查看路径历史");
    await userEvent.click(historyButton);

    const historyItems = screen.getAllByRole("button", { name: /^\/path/ });
    expect(historyItems).toHaveLength(2);
  });

  it("calls onValidPath callback with valid path", async () => {
    const onValidPath = jest.fn();
    render(<PathInput {...defaultProps} onValidPath={onValidPath} />);

    const input = screen.getByLabelText("输入路径");
    await userEvent.type(input, "/valid/path");
    await userEvent.tab();

    expect(onValidPath).toHaveBeenCalledWith("/valid/path");
  });
});
