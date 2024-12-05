import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CascaderMenu from "./CascaderMenu";
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

describe("CascaderMenu", () => {
  it("renders options correctly", () => {
    render(
      <CascaderMenu
        options={options}
        onSelect={jest.fn()}
        selectedOptions={[]}
        multiple={false}
        expandTrigger="click"
        renderLabel={undefined}
        searchValue=""
      />
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("handles option click correctly", () => {
    const handleSelect = jest.fn();
    render(
      <CascaderMenu
        options={options}
        onSelect={handleSelect}
        selectedOptions={[]}
        multiple={false}
        expandTrigger="click"
        renderLabel={undefined}
        searchValue=""
      />
    );
    fireEvent.click(screen.getByText("Option 1"));
    expect(handleSelect).toHaveBeenCalledWith(options[0], [options[0]]);
  });

  it("handles option hover correctly", () => {
    render(
      <CascaderMenu
        options={options}
        onSelect={jest.fn()}
        selectedOptions={[]}
        multiple={false}
        expandTrigger="hover"
        renderLabel={undefined}
        searchValue=""
      />
    );
    fireEvent.mouseEnter(screen.getByText("Option 1"));
    expect(screen.getByText("Option 1-1")).toBeInTheDocument();
  });

  it("filters options correctly", () => {
    render(
      <CascaderMenu
        options={options}
        onSelect={jest.fn()}
        selectedOptions={[]}
        multiple={false}
        expandTrigger="click"
        renderLabel={undefined}
        searchValue="1-1"
      />
    );
    expect(screen.getByText("Option 1-1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  });

  it("handles multiple selection correctly", () => {
    const handleSelect = jest.fn();
    render(
      <CascaderMenu
        options={options}
        onSelect={handleSelect}
        selectedOptions={[options[0]]}
        multiple={true}
        expandTrigger="click"
        renderLabel={undefined}
        searchValue=""
      />
    );
    fireEvent.click(screen.getByText("Option 2"));
    expect(handleSelect).toHaveBeenCalledWith(options[1], [
      options[0],
      options[1],
    ]);
  });

  it("renders custom labels correctly", () => {
    const renderLabel = (option: CascaderOption, isSelected: boolean) => (
      <span>{isSelected ? `Selected: ${option.label}` : option.label}</span>
    );
    render(
      <CascaderMenu
        options={options}
        onSelect={jest.fn()}
        selectedOptions={[options[0]]}
        multiple={false}
        expandTrigger="click"
        renderLabel={renderLabel}
        searchValue=""
      />
    );
    expect(screen.getByText("Selected: Option 1")).toBeInTheDocument();
  });
});
