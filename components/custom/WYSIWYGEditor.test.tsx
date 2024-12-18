import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import WYSIWYGEditor from "./WYSIWYGEditor";

// Mock DOMPurify
jest.mock("dompurify", () => ({
  sanitize: jest.fn((content) => content),
}));

// Mock execCommand
document.execCommand = jest.fn();

describe("WYSIWYGEditor", () => {
  const mockOnChange = jest.fn();
  const mockImageUpload = jest
    .fn()
    .mockResolvedValue("http://example.com/image.jpg");
  const mockFileUpload = jest
    .fn()
    .mockResolvedValue("http://example.com/file.pdf");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders editor with default props", () => {
      render(<WYSIWYGEditor />);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    it("renders with initial content", () => {
      const initialContent = "<p>Test content</p>";
      render(<WYSIWYGEditor initialValue={initialContent} />);
      expect(screen.getByRole("textbox")).toHaveTextContent("Test content");
    });

    it("renders all toolbar buttons", () => {
      render(<WYSIWYGEditor />);
      expect(screen.getByTitle("Bold")).toBeInTheDocument();
      expect(screen.getByTitle("Italic")).toBeInTheDocument();
      expect(screen.getByTitle("Underline")).toBeInTheDocument();
    });
  });

  describe("Content Editing", () => {
    it("calls onChange when content is modified", async () => {
      render(<WYSIWYGEditor onChange={mockOnChange} />);
      const editor = screen.getByRole("textbox");
      fireEvent.input(editor, { target: { innerHTML: "<p>New content</p>" } });
      expect(mockOnChange).toHaveBeenCalledWith("<p>New content</p>");
    });

    it("handles paste events correctly", () => {
      render(<WYSIWYGEditor />);
      const editor = screen.getByRole("textbox");
      const pasteData = new DataTransfer();
      pasteData.setData("text/plain", "Pasted text");

      fireEvent.paste(editor, {
        clipboardData: pasteData,
        preventDefault: jest.fn(),
      });

      expect(document.execCommand).toHaveBeenCalledWith(
        "insertText",
        false,
        "Pasted text"
      );
    });
  });

  describe("Toolbar Commands", () => {
    it("executes basic formatting commands", () => {
      render(<WYSIWYGEditor />);

      fireEvent.click(screen.getByTitle("Bold"));
      expect(document.execCommand).toHaveBeenCalledWith(
        "bold",
        false,
        undefined
      );

      fireEvent.click(screen.getByTitle("Italic"));
      expect(document.execCommand).toHaveBeenCalledWith(
        "italic",
        false,
        undefined
      );
    });

    it("executes alignment commands", () => {
      render(<WYSIWYGEditor />);

      fireEvent.click(screen.getByTitle("Align Left"));
      expect(document.execCommand).toHaveBeenCalledWith(
        "justifyLeft",
        false,
        undefined
      );

      fireEvent.click(screen.getByTitle("Align Center"));
      expect(document.execCommand).toHaveBeenCalledWith(
        "justifyCenter",
        false,
        undefined
      );
    });

    it("handles font size changes", async () => {
      render(<WYSIWYGEditor />);

      fireEvent.click(screen.getByText("Font Size"));
      const sizeInput = screen.getByLabelText(/Font Size/);
      fireEvent.change(sizeInput, { target: { value: "20" } });

      expect(document.execCommand).toHaveBeenCalledWith("fontSize", false, "7");
    });
  });

  describe("Advanced Features", () => {
    it("handles image upload", async () => {
      render(<WYSIWYGEditor onImageUpload={mockImageUpload} />);

      const file = new File(["test"], "test.png", { type: "image/png" });
      const imageButton = screen.getByTitle("Insert Image");

      fireEvent.click(imageButton);

      await waitFor(() => {
        expect(mockImageUpload).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith(
          "insertImage",
          false,
          "http://example.com/image.jpg"
        );
      });
    });

    it("handles table insertion", () => {
      const promptSpy = jest.spyOn(window, "prompt");
      promptSpy.mockImplementation(jest.fn(() => "2"));

      render(<WYSIWYGEditor />);
      fireEvent.click(screen.getByTitle("Insert Table"));

      expect(document.execCommand).toHaveBeenCalledWith(
        "insertHTML",
        false,
        expect.stringContaining("<table")
      );

      promptSpy.mockRestore();
    });

    it("handles fullscreen toggle", () => {
      render(<WYSIWYGEditor />);

      const fullscreenButton = screen.getByText("Fullscreen");
      fireEvent.click(fullscreenButton);

      expect(screen.getByText("Exit Fullscreen")).toBeInTheDocument();
      expect(screen.getByRole("tablist").parentElement).toHaveClass("fixed");
    });

    it("exits fullscreen on escape key", () => {
      render(<WYSIWYGEditor />);

      fireEvent.click(screen.getByText("Fullscreen"));
      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.getByText("Fullscreen")).toBeInTheDocument();
    });
  });

  describe("Preview Mode", () => {
    it("switches between edit and preview modes", () => {
      render(<WYSIWYGEditor initialValue="<p>Test content</p>" />);

      fireEvent.click(screen.getByText("Preview"));
      expect(screen.getByText("Test content")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Edit"));
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("sanitizes content in preview mode", () => {
      const content = '<p>Safe content</p><script>alert("xss")</script>';
      render(<WYSIWYGEditor initialValue={content} />);

      fireEvent.click(screen.getByText("Preview"));
      const preview = screen.getByText("Safe content");

      expect(preview).toBeInTheDocument();
      expect(preview.innerHTML).not.toContain("<script>");
    });
  });
});
