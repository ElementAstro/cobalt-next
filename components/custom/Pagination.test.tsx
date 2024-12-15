import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { PaginationComponent } from "./Pagination";

describe("PaginationComponent", () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    onPageChange.mockClear();
  });

  it("renders correctly with initial props", () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
  });

  it("renders previous and first page buttons when currentPage > 1", () => {
    render(
      <PaginationComponent
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByLabelText("First page")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
  });

  it("renders next and last page buttons when currentPage < totalPages", () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Last page")).toBeInTheDocument();
  });

  it("calls onPageChange with correct page number when first page button is clicked", () => {
    render(
      <PaginationComponent
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("First page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with correct page number when previous page button is clicked", () => {
    render(
      <PaginationComponent
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with correct page number when next page button is clicked", () => {
    render(
      <PaginationComponent
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with correct page number when last page button is clicked", () => {
    render(
      <PaginationComponent
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Last page"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("does not render previous and first page buttons when currentPage is 1", () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.queryByLabelText("First page")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
  });

  it("does not render next and last page buttons when currentPage is totalPages", () => {
    render(
      <PaginationComponent
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Last page")).not.toBeInTheDocument();
  });
});
