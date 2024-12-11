import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
    const initialSuggestions = ["apple", "banana", "cherry"];
    const onSearchMock = jest.fn();

    it("renders correctly with default props", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} />);
        expect(screen.getByPlaceholderText("搜索...")).toBeInTheDocument();
    });

    it("handles search input changes", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} />);
        const input = screen.getByPlaceholderText("搜索...");
        fireEvent.change(input, { target: { value: "app" } });
        expect(input).toHaveValue("app");
    });

    it("submits the search form", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText("搜索...");
        fireEvent.change(input, { target: { value: "banana" } });
        fireEvent.submit(screen.getByRole("form"));
        expect(onSearchMock).toHaveBeenCalledWith("banana");
    });

    it("clears the search input", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} />);
        const input = screen.getByPlaceholderText("搜索...");
        fireEvent.change(input, { target: { value: "banana" } });
        fireEvent.click(screen.getByLabelText("清除搜索"));
        expect(input).toHaveValue("");
    });

    it("handles suggestion click", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} onSearch={onSearchMock} />);
        const input = screen.getByPlaceholderText("搜索...");
        fireEvent.change(input, { target: { value: "a" } });
        fireEvent.click(screen.getByText("apple"));
        expect(input).toHaveValue("apple");
        expect(onSearchMock).toHaveBeenCalledWith("apple");
    });

    it("toggles dark mode", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} />);
        const toggleButton = screen.getByLabelText("切换主题");
        fireEvent.click(toggleButton);
        expect(document.documentElement).toHaveClass("dark");
        fireEvent.click(toggleButton);
        expect(document.documentElement).not.toHaveClass("dark");
    });

    it("shows and hides suggestions", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} />);
        const input = screen.getByPlaceholderText("搜索...");
        fireEvent.change(input, { target: { value: "a" } });
        expect(screen.getByText("apple")).toBeInTheDocument();
        fireEvent.change(input, { target: { value: "" } });
        expect(screen.queryByText("apple")).not.toBeInTheDocument();
    });

    it("handles click outside to hide suggestions", () => {
        render(<SearchBar initialSuggestions={initialSuggestions} />);
        const input = screen.getByPlaceholderText("搜索...");
        fireEvent.change(input, { target: { value: "a" } });
        expect(screen.getByText("apple")).toBeInTheDocument();
        fireEvent.mouseDown(document);
        expect(screen.queryByText("apple")).not.toBeInTheDocument();
    });
});