import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MarkdownRenderer } from "./MarkdownRender";

describe("MarkdownRenderer", () => {
    it("renders markdown content", async () => {
        const content = "# Hello World";
        render(<MarkdownRenderer content={content} />);
        expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Hello World");
    });

    it("renders with custom className", () => {
        const content = "# Hello World";
        const className = "custom-class";
        render(<MarkdownRenderer content={content} className={className} />);
        expect(screen.getByRole("heading", { level: 1 }).parentElement).toHaveClass("custom-class");
    });

    it("renders Table of Contents when enableToc is true", async () => {
        const content = "# Heading 1\n## Heading 2";
        render(<MarkdownRenderer content={content} enableToc={true} />);
        expect(await screen.findByText("Table of Contents")).toBeInTheDocument();
    });

    it("renders math expressions when enableMath is true", async () => {
        const content = "$$a^2 + b^2 = c^2$$";
        render(<MarkdownRenderer content={content} enableMath={true} />);
        expect(await screen.findByRole("img", { name: /katex/i })).toBeInTheDocument();
    });

    it("renders emojis when enableEmoji is true", async () => {
        const content = ":smile:";
        render(<MarkdownRenderer content={content} enableEmoji={true} />);
        expect(await screen.findByText("😄")).toBeInTheDocument();
    });

    it("initializes and runs mermaid when enableMermaid is true", async () => {
        const content = "```mermaid\ngraph TD;\nA-->B;\n```";
        render(<MarkdownRenderer content={content} enableMermaid={true} />);
        expect(await screen.findByText("A")).toBeInTheDocument();
        expect(await screen.findByText("B")).toBeInTheDocument();
    });
});