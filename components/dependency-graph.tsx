"use client";

import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useTranslations } from "next-intl";
import packageJson from "../package.json";

const dependencies = Object.keys(packageJson.dependencies);

const graphData = {
  nodes: dependencies.map((dep) => ({ id: dep, name: dep, val: 1 })),
  links: dependencies.map((dep) => ({ source: "project", target: dep })),
};

graphData.nodes.push({ id: "project", name: "Project", val: 2 });

export function DependencyGraph() {
  const graphRef = useRef<any>();
  const t = useTranslations("graph");
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge").strength(-200);
      graphRef.current.d3Force("link").distance(100);
    }
  }, []);

  const handleNodeHover = (node: any) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      graphData.links.forEach((link) => {
        if (link.source === node || link.target === node) {
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
          highlightLinks.add(link);
        }
      });
    }

    setHoverNode(node || null);
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
  };

  const paintRing = (node: any, ctx: CanvasRenderingContext2D) => {
    const { x, y } = node;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI, false);
    ctx.fillStyle = node === hoverNode ? "red" : "orange";
    ctx.fill();
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>
      <div className="h-[600px] w-full">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node: any) =>
            highlightNodes.has(node) ? "#F7B801" : "#4CAF50"
          }
          linkColor={(link: any) =>
            highlightLinks.has(link) ? "#F7B801" : "#9E9E9E"
          }
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2
            );

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              bckgDimensions[0],
              bckgDimensions[1]
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);

            node === hoverNode && paintRing(node, ctx);
          }}
          onNodeHover={handleNodeHover}
        />
      </div>
    </section>
  );
}
