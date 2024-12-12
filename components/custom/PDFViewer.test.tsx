import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PDFViewer from "./PDFViewer";
import { Document, Page } from "react-pdf";
import { motion } from "framer-motion";

// Mock framer-motion to avoid animations during testing
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef((props, ref) => <div {...props} ref={ref} />),
    },
  };
});

// Mock react-pdf components
jest.mock("react-pdf", () => ({
  Document: jest.fn(({ children }) => <div>{children}</div>),
  Page: jest.fn(() => <div>Page</div>),
}));

describe("PDFViewer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly without a PDF file", () => {
    render(<PDFViewer />);
    expect(
      screen.getByText(
        "Drag 'n' drop a PDF file here, or click to select a file"
      )
    ).toBeInTheDocument();
  });

  it("renders correctly with a PDF file", () => {
    const file = new File(["dummy content"], "example.pdf", {
      type: "application/pdf",
    });
    render(<PDFViewer />);
    fireEvent.drop(
      screen.getByText(
        "Drag 'n' drop a PDF file here, or click to select a file"
      ),
      {
        dataTransfer: { files: [file] },
      }
    );
    expect(screen.getByText("Page 1 of --")).toBeInTheDocument();
  });

  it("handles zoom in and zoom out", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Zoom In"));
    fireEvent.click(screen.getByText("Zoom Out"));
    // Add assertions to check the scale state
  });

  it("handles page navigation", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Next Page"));
    fireEvent.click(screen.getByText("Previous Page"));
    // Add assertions to check the page number state
  });

  it("handles rotation", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Rotate"));
    // Add assertions to check the rotation state
  });

  it("handles fullscreen toggle", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Fullscreen"));
    // Add assertions to check the fullscreen state
  });

  it("handles search functionality", () => {
    render(<PDFViewer />);
    fireEvent.change(screen.getByPlaceholderText("Search in PDF"), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByText("Search"));
    expect(screen.getByText("Searching for: test")).toBeInTheDocument();
  });

  it("handles download functionality", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Download"));
    // Add assertions to check the download functionality
  });

  it("handles print functionality", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Print"));
    // Add assertions to check the print functionality
  });

  it("handles adding bookmarks", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Bookmark"));
    expect(screen.getByText("Bookmark on page 1")).toBeInTheDocument();
  });

  it("handles adding annotations", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Add Annotation"));
    fireEvent.change(
      screen.getByPlaceholderText("Enter your annotation here"),
      { target: { value: "Test annotation" } }
    );
    fireEvent.blur(screen.getByPlaceholderText("Enter your annotation here"));
    expect(screen.getByText("Test annotation")).toBeInTheDocument();
  });

  it("handles dark mode toggle", () => {
    render(<PDFViewer />);
    fireEvent.click(screen.getByText("Dark Mode"));
    // Add assertions to check the dark mode state
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<PDFViewer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
