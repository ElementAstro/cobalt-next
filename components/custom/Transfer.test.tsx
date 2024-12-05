import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Transfer, TransferOption } from "./Transfer";

const options: TransferOption[] = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

describe("Transfer", () => {
  it("renders correctly", () => {
    render(<Transfer options={options} />);
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
  });

  it("renders with custom titles", () => {
    render(
      <Transfer
        options={options}
        sourceTitle="Custom Source"
        targetTitle="Custom Target"
      />
    );
    expect(screen.getByText("Custom Source")).toBeInTheDocument();
    expect(screen.getByText("Custom Target")).toBeInTheDocument();
  });

  it("handles selection correctly", () => {
    const handleChange = jest.fn();
    render(<Transfer options={options} onUpdateValue={handleChange} />);
    fireEvent.click(screen.getByLabelText("Option 1"));
    expect(handleChange).toHaveBeenCalledWith(["1"]);
  });

  it("handles filtering correctly", () => {
    render(<Transfer options={options} sourceFilterable />);
    fireEvent.change(screen.getByPlaceholderText(""), {
      target: { value: "1" },
    });
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  });

  it("handles drag and drop correctly", () => {
    const handleChange = jest.fn();
    render(<Transfer options={options} onUpdateValue={handleChange} />);
    fireEvent.dragStart(screen.getByText("Option 1"));
    fireEvent.drop(screen.getByText("Target"));
    expect(handleChange).toHaveBeenCalledWith(["1"]);
  });

  it("handles clearing selections correctly", () => {
    const handleChange = jest.fn();
    render(<Transfer options={options} onUpdateValue={handleChange} />);
    fireEvent.click(screen.getByLabelText("Option 1"));
    fireEvent.click(screen.getByText("Clear"));
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("handles selecting all options correctly", () => {
    const handleChange = jest.fn();
    render(<Transfer options={options} onUpdateValue={handleChange} />);
    fireEvent.click(screen.getByText("Select All"));
    expect(handleChange).toHaveBeenCalledWith(["1", "2", "3"]);
  });

  it("renders with custom labels", () => {
    const renderLabel = ({ option }: { option: TransferOption }) => (
      <span>{`Custom ${option.label}`}</span>
    );
    render(
      <Transfer
        options={options}
        renderSourceLabel={renderLabel}
        renderTargetLabel={renderLabel}
      />
    );
    expect(screen.getByText("Custom Option 1")).toBeInTheDocument();
  });

  it("renders with disabled options", () => {
    const disabledOptions = [
      { label: "Option 1", value: "1", disabled: true },
      { label: "Option 2", value: "2" },
    ];
    render(<Transfer options={disabledOptions} />);
    expect(screen.getByLabelText("Option 1")).toBeDisabled();
  });

  it("renders with virtual scroll", () => {
    render(<Transfer options={options} virtualScroll />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    render(<Transfer options={options} size="large" />);
    expect(screen.getByText("Option 1")).toHaveClass("text-lg");
  });
});
