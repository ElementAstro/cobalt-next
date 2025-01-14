"use client";

import { Dependency } from "@/store/useOtherStore";
import { ForceGraph2D } from "react-force-graph";
import { useMemo } from "react";

interface DependencyGraphProps {
  dependencies: Dependency[];
}

export function DependencyGraph({ dependencies }: DependencyGraphProps) {
  const graphData = useMemo(() => {
    const nodes = dependencies.map((dep) => ({
      id: dep.name,
      name: dep.name,
      version: dep.version,
      status: dep.status,
    }));

    const links = dependencies.flatMap((dep) =>
      (dep.dependencies || []).map((dependencyName) => ({
        source: dep.name,
        target: dependencyName,
      }))
    );

    return { nodes, links };
  }, [dependencies]);

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="name"
      nodeAutoColorBy="status"
      linkDirectionalArrowLength={6}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.25}
      width={800}
      height={400}
    />
  );
}
