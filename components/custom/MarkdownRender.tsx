import React from "react";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import remarkEmoji from "remark-emoji";
import "katex/dist/katex.min.css";
import "prismjs/themes/prism-tomorrow.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  enableToc?: boolean;
  enableMath?: boolean;
  enableEmoji?: boolean;
  enableMermaid?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  enableToc = true,
  enableMath = true,
  enableEmoji = true,
  enableMermaid = true,
}) => {
  const [renderedContent, setRenderedContent] = React.useState("");

  React.useEffect(() => {
    const remarkChain = remark().use(remarkGfm);

    if (enableToc) {
      remarkChain.use(remarkToc, { heading: "Table of Contents" });
    }

    if (enableMath) {
      remarkChain.use(remarkMath);
    }

    if (enableEmoji) {
      remarkChain.use(remarkEmoji);
    }

    remarkChain
      .use(html, { sanitize: false })
      .use(rehypeKatex)
      .use(rehypePrism)
      .use(rehypeSlug)
      .process(content)
      .then((processed) => {
        setRenderedContent(processed.toString());
      });
  }, [content, enableToc, enableMath, enableEmoji]);

  React.useEffect(() => {
    if (enableMermaid) {
      import("mermaid").then((mermaid) => {
        mermaid.default.initialize({ startOnLoad: true });
        mermaid.default.run();
      });
    }
  }, [renderedContent, enableMermaid]);

  return (
    <div className={`markdown-body ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
    </div>
  );
};
