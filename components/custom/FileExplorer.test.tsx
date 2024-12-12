import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FileExplorer } from "./FileExplorer";
import { toast } from "@/hooks/use-toast";

jest.mock("@/hooks/use-toast");

const mockData = [
  "file1.txt",
  ["folder1", "file2.txt", ["subfolder1", "file3.txt"]],
  "file4.txt",
];

describe("FileExplorer", () => {
  it("renders file explorer correctly", () => {
    render(<FileExplorer data={mockData} />);
    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("folder1")).toBeInTheDocument();
    expect(screen.getByText("file4.txt")).toBeInTheDocument();
  });

  it("searches files correctly", () => {
    render(<FileExplorer data={mockData} />);
    fireEvent.change(screen.getByPlaceholderText("Search files..."), {
      target: { value: "file1" },
    });
    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.queryByText("file4.txt")).not.toBeInTheDocument();
  });

  it("creates a new file", () => {
    render(<FileExplorer data={mockData} />);
    fireEvent.click(screen.getByText("New File"));
    fireEvent.change(
      screen.getByPlaceholderText("Enter a name for the new file."),
      {
        target: { value: "newFile.txt" },
      }
    );
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("newFile.txt")).toBeInTheDocument();
    expect(toast).toHaveBeenCalledWith({
      title: "File created",
      description: "newFile.txt has been created.",
    });
  });

  it("creates a new folder", () => {
    render(<FileExplorer data={mockData} />);
    fireEvent.click(screen.getByText("New Folder"));
    fireEvent.change(
      screen.getByPlaceholderText("Enter a name for the new folder."),
      {
        target: { value: "newFolder" },
      }
    );
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("newFolder")).toBeInTheDocument();
    expect(toast).toHaveBeenCalledWith({
      title: "Folder created",
      description: "newFolder has been created.",
    });
  });

  it("renames a file", () => {
    render(<FileExplorer data={mockData} />);
    fireEvent.click(screen.getByText("file1.txt"));
    fireEvent.click(screen.getByText("Rename"));
    fireEvent.change(
      screen.getByPlaceholderText("Enter a new name for the file."),
      {
        target: { value: "renamedFile.txt" },
      }
    );
    fireEvent.click(screen.getByText("Rename"));
    expect(screen.getByText("renamedFile.txt")).toBeInTheDocument();
    expect(toast).toHaveBeenCalledWith({
      title: "File renamed",
      description: "file1.txt has been renamed to renamedFile.txt.",
    });
  });

  it("deletes a file", () => {
    window.confirm = jest.fn(() => true);
    render(<FileExplorer data={mockData} />);
    fireEvent.click(screen.getByText("file1.txt"));
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("file1.txt")).not.toBeInTheDocument();
    expect(toast).toHaveBeenCalledWith({
      title: "File deleted",
      description: "file1.txt has been deleted.",
    });
  });

  it("copies file path", () => {
    render(<FileExplorer data={mockData} />);
    fireEvent.click(screen.getByText("file1.txt"));
    fireEvent.click(screen.getByText("Copy Path"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("file1.txt");
    expect(toast).toHaveBeenCalledWith({
      title: "Path copied",
      description: 'Path "file1.txt" has been copied to clipboard.',
    });
  });

  it("expands and collapses folders", () => {
    render(<FileExplorer data={mockData} />);
    fireEvent.click(screen.getByText("folder1"));
    expect(screen.getByText("file2.txt")).toBeInTheDocument();
    fireEvent.click(screen.getByText("folder1"));
    expect(screen.queryByText("file2.txt")).not.toBeInTheDocument();
  });
});
