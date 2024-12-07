import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { TagInput } from "./TagInput";

describe("TagInput", () => {
  const initialTags = ["tag1", "tag2"];

  it("renders correctly with initial tags", () => {
    render(<TagInput tags={initialTags} />);
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("adds a new tag when Enter is pressed", () => {
    render(<TagInput tags={initialTags} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("tag3")).toBeInTheDocument();
  });

  it("removes a tag when the remove button is clicked", () => {
    render(<TagInput tags={initialTags} />);
    const removeButton = screen.getByLabelText("Remove tag1 tag");
    fireEvent.click(removeButton);
    expect(screen.queryByText("tag1")).not.toBeInTheDocument();
  });

  it("does not add duplicate tags if allowDuplicates is false", () => {
    render(<TagInput tags={initialTags} allowDuplicates={false} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag1" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getAllByText("tag1").length).toBe(1);
  });

  it("adds duplicate tags if allowDuplicates is true", () => {
    render(<TagInput tags={initialTags} allowDuplicates={true} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag1" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getAllByText("tag1").length).toBe(2);
  });

  it("does not add a tag if it exceeds maxTags", () => {
    render(<TagInput tags={initialTags} maxTags={2} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByText("tag3")).not.toBeInTheDocument();
  });

  it("calls onExceedMaxTags when maxTags is exceeded", () => {
    const onExceedMaxTags = jest.fn();
    render(
      <TagInput
        tags={initialTags}
        maxTags={2}
        onExceedMaxTags={onExceedMaxTags}
      />
    );
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onExceedMaxTags).toHaveBeenCalled();
  });

  it("does not add a tag if it is shorter than minLength", () => {
    render(<TagInput tags={initialTags} minLength={5} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByText("tag")).not.toBeInTheDocument();
  });

  it("does not add a tag if it is longer than maxLength", () => {
    render(<TagInput tags={initialTags} maxLength={5} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "longtag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByText("longtag")).not.toBeInTheDocument();
  });

  it("does not add a tag if validateTag returns false", () => {
    const validateTag = (tag: string) => tag !== "invalid";
    render(<TagInput tags={initialTags} validateTag={validateTag} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByText("invalid")).not.toBeInTheDocument();
  });

  it("focuses the input field when a tag is added or removed", () => {
    render(<TagInput tags={initialTags} />);
    const input = screen.getByPlaceholderText("添加标签...");
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveFocus();
    const removeButton = screen.getByLabelText("Remove tag3 tag");
    fireEvent.click(removeButton);
    expect(input).toHaveFocus();
  });

  it("does not allow tag removal when readOnly is true", () => {
    render(<TagInput tags={initialTags} readOnly={true} />);
    const removeButton = screen.queryByLabelText("Remove tag1 tag");
    expect(removeButton).not.toBeInTheDocument();
  });

  it("disables the input field when disabled is true", () => {
    render(<TagInput tags={initialTags} disabled={true} />);
    const input = screen.getByPlaceholderText("添加标签...");
    expect(input).toBeDisabled();
  });
});
