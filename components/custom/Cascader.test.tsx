import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Cascader from "./Cascader";
import { CascaderOption } from "@/types/custom/cascader";

const options: CascaderOption[] = [
  {
    value: "1",
    label: "Option 1",
    children: [
      {
        value: "1-1",
        label: "Option 1-1",
      },
    ],
  },
  {
    value: "2",
    label: "Option 2",
  },
];

describe("Cascader", () => {
  it("renders with placeholder", () => {
    render(<Cascader options={options} placeholder="Select an option" />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("opens and closes the menu", () => {
    render(<Cascader options={options} />);
    const container = screen.getByRole("button");
    fireEvent.click(container);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.click(container);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects an option", () => {
    const handleChange = jest.fn();
    render(<Cascader options={options} onChange={handleChange} />);
    const container = screen.getByRole("button");
    fireEvent.click(container);
    fireEvent.click(screen.getByText("Option 1"));
    expect(handleChange).toHaveBeenCalledWith(
      ["1"],
      [options[0]],
      [options[0]]
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("clears selected options", () => {
    const handleChange = jest.fn();
    render(<Cascader options={options} clearable onChange={handleChange} />);
    const container = screen.getByRole("button");
    fireEvent.click(container);
    fireEvent.click(screen.getByText("Option 1"));
    fireEvent.click(screen.getByRole("button"));
    const svgElement = screen.getByRole("button").querySelector("svg");
    if (svgElement) {
      fireEvent.click(svgElement);
    }
    expect(handleChange).toHaveBeenCalledWith([], [], []);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("filters options", () => {
    render(<Cascader options={options} filterable />);
    const container = screen.getByRole("button");
    fireEvent.click(container);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1-1" } });
    expect(screen.getByText("Option 1-1")).toBeInTheDocument();
  });

  it("handles multiple selection", () => {
    const handleChange = jest.fn();
    render(<Cascader options={options} multiple onChange={handleChange} />);
    const container = screen.getByRole("button");
    fireEvent.click(container);
    fireEvent.click(screen.getByText("Option 1"));
    fireEvent.click(container);
    fireEvent.click(screen.getByText("Option 2"));
    expect(handleChange).toHaveBeenCalledWith(
      ["1", "2"],
      [options[0], options[1]],
      [options[0], options[1]]
    );
    expect(screen.getByText("Option 1, Option 2")).toBeInTheDocument();
  });

  it("disables the component", () => {
    render(<Cascader options={options} disabled />);
    const container = screen.getByRole("button");
    expect(container).toHaveClass("cursor-not-allowed");
    fireEvent.click(container);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
