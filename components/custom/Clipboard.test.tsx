import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AdvancedFloatingClipboard } from "./Clipboard";
import { toast } from "@/hooks/use-toast";

jest.mock("@/hooks/use-toast", () => ({
    toast: jest.fn(),
}));

describe("AdvancedFloatingClipboard", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        render(<AdvancedFloatingClipboard />);
        expect(screen.getByText("剪贴板")).toBeInTheDocument();
    });

    it("copies content to clipboard", async () => {
        render(<AdvancedFloatingClipboard />);
        const textarea = screen.getByPlaceholderText("当前内容");
        fireEvent.change(textarea, { target: { value: "Test content" } });
        fireEvent.click(screen.getByText("复制"));
        await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "复制成功" })));
    });

    it("pastes content from clipboard", async () => {
        navigator.clipboard.readText = jest.fn().mockResolvedValue("Pasted content");
        render(<AdvancedFloatingClipboard />);
        fireEvent.click(screen.getByText("粘贴"));
        await waitFor(() => expect(screen.getByPlaceholderText("当前内容")).toHaveValue("Pasted content"));
        await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "粘贴成功" })));
    });

    it("exports clipboard data", () => {
        render(<AdvancedFloatingClipboard />);
        const link = document.createElement("a");
        document.body.appendChild(link);
        jest.spyOn(document, "createElement").mockReturnValue(link);
        fireEvent.click(screen.getByText("导出"));
        expect(link.getAttribute("download")).toBe("clipboard_export.json");
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "导出成功" }));
    });

    it("imports clipboard data", async () => {
        const file = new Blob([JSON.stringify({ content: "Imported content", history: [] })], { type: "application/json" });
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        document.body.appendChild(fileInput);
        jest.spyOn(document, "getElementById").mockReturnValue(fileInput);
        render(<AdvancedFloatingClipboard />);
        fireEvent.change(fileInput, { target: { files: [file] } });
        await waitFor(() => expect(screen.getByPlaceholderText("当前内容")).toHaveValue("Imported content"));
        await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "导入成功" })));
    });

    it("adds a tag to the latest clipboard item", () => {
        render(<AdvancedFloatingClipboard />);
        const textarea = screen.getByPlaceholderText("当前内容");
        fireEvent.change(textarea, { target: { value: "Test content" } });
        fireEvent.click(screen.getByText("复制"));
        fireEvent.change(screen.getByPlaceholderText("添加标签"), { target: { value: "Test tag" } });
        fireEvent.click(screen.getByText("添加标签"));
        expect(screen.getByText("Test tag")).toBeInTheDocument();
    });

    it("clears clipboard history", () => {
        render(<AdvancedFloatingClipboard />);
        fireEvent.click(screen.getByText("清除历史"));
        expect(screen.queryByText("Test content")).not.toBeInTheDocument();
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "历史记录已清除" }));
    });

    it("toggles dark mode", () => {
        render(<AdvancedFloatingClipboard />);
        fireEvent.click(screen.getByRole("button", { name: /moon/i }));
        expect(document.body.classList.contains("dark")).toBe(true);
        fireEvent.click(screen.getByRole("button", { name: /sun/i }));
        expect(document.body.classList.contains("dark")).toBe(false);
    });

    it("minimizes and maximizes the clipboard", () => {
        render(<AdvancedFloatingClipboard />);
        fireEvent.click(screen.getByRole("button", { name: /external link/i }));
        expect(screen.queryByPlaceholderText("当前内容")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: /x/i }));
        expect(screen.getByPlaceholderText("当前内容")).toBeInTheDocument();
    });
});