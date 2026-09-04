import React, { useMemo } from "react";
import type { CanvasEdge, CanvasNode, PortPosition } from "./types";

interface ConnectionLinesProps {
  edges: CanvasEdge[];
  nodes: CanvasNode[];
}

interface PortCoordinate {
  x: number;
  y: number;
  normal: { dx: number; dy: number };
}

const DEFAULT_WIDTH = 160;
const getNodeHeight = (node: CanvasNode): number => {
  if (node.height) return node.height;
  if (node.shape === "circle") return 120;
  if (node.shape === "diamond") return 140;
  return 70;
};

const getPortCoordinate = (
  node: CanvasNode,
  portPos?: PortPosition | string
): PortCoordinate => {
  const width = node.width ?? DEFAULT_WIDTH;
  const height = getNodeHeight(node);

  switch (portPos) {
    case "top":
      return { x: node.x + width / 2, y: node.y, normal: { dx: 0, dy: -1 } };
    case "bottom":
      return {
        x: node.x + width / 2,
        y: node.y + height,
        normal: { dx: 0, dy: 1 },
      };
    case "left":
      return { x: node.x, y: node.y + height / 2, normal: { dx: -1, dy: 0 } };
    case "right":
    default:
      return {
        x: node.x + width,
        y: node.y + height / 2,
        normal: { dx: 1, dy: 0 },
      };
  }
};

const getAutoPortCoordinates = (
  source: CanvasNode,
  target: CanvasNode,
  explicitSourcePort?: PortPosition | string,
  explicitTargetPort?: PortPosition | string
): { sourceCoord: PortCoordinate; targetCoord: PortCoordinate } => {
  const sourceWidth = source.width ?? DEFAULT_WIDTH;
  const sourceHeight = getNodeHeight(source);
  const targetWidth = target.width ?? DEFAULT_WIDTH;
  const targetHeight = getNodeHeight(target);

  const sourceCenter = {
    x: source.x + sourceWidth / 2,
    y: source.y + sourceHeight / 2,
  };
  const targetCenter = {
    x: target.x + targetWidth / 2,
    y: target.y + targetHeight / 2,
  };

  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  // Decide source port if not provided
  let resolvedSourcePort = explicitSourcePort;
  if (!resolvedSourcePort) {
    if (Math.abs(dx) > Math.abs(dy)) {
      resolvedSourcePort = dx > 0 ? "right" : "left";
    } else {
      resolvedSourcePort = dy > 0 ? "bottom" : "top";
    }
  }

  // Decide target port if not provided
  let resolvedTargetPort = explicitTargetPort;
  if (!resolvedTargetPort) {
    if (Math.abs(dx) > Math.abs(dy)) {
      resolvedTargetPort = dx > 0 ? "left" : "right";
    } else {
      resolvedTargetPort = dy > 0 ? "top" : "bottom";
    }
  }

  return {
    sourceCoord: getPortCoordinate(source, resolvedSourcePort),
    targetCoord: getPortCoordinate(target, resolvedTargetPort),
  };
};

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  edges,
  nodes,
}) => {
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    for (const node of nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [nodes]);

  const computedEdges = useMemo(() => {
    return edges
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.sourceNodeId);
        const targetNode = nodeMap.get(edge.targetNodeId);
        if (!sourceNode || !targetNode) return null;

        const { sourceCoord, targetCoord } = getAutoPortCoordinates(
          sourceNode,
          targetNode,
          edge.sourcePort,
          edge.targetPort
        );

        const distance = Math.hypot(
          targetCoord.x - sourceCoord.x,
          targetCoord.y - sourceCoord.y
        );
        const curvature = Math.max(30, Math.min(180, distance * 0.45));

        const cp1x = sourceCoord.x + sourceCoord.normal.dx * curvature;
        const cp1y = sourceCoord.y + sourceCoord.normal.dy * curvature;
        const cp2x = targetCoord.x + targetCoord.normal.dx * curvature;
        const cp2y = targetCoord.y + targetCoord.normal.dy * curvature;

        let pathData: string;
        if (edge.type === "straight") {
          pathData = `M ${sourceCoord.x} ${sourceCoord.y} L ${targetCoord.x} ${targetCoord.y}`;
        } else if (edge.type === "step") {
          const midX = (sourceCoord.x + targetCoord.x) / 2;
          pathData = `M ${sourceCoord.x} ${sourceCoord.y} L ${midX} ${sourceCoord.y} L ${midX} ${targetCoord.y} L ${targetCoord.x} ${targetCoord.y}`;
        } else {
          // Bezier default
          pathData = `M ${sourceCoord.x} ${sourceCoord.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetCoord.x} ${targetCoord.y}`;
        }

        // Midpoint for label
        const midX = (sourceCoord.x + targetCoord.x) / 2;
        const midY = (sourceCoord.y + targetCoord.y) / 2;

        return {
          ...edge,
          pathData,
          midX,
          midY,
          color: edge.color ?? "#52525b", // neutral-600
        };
      })
      .filter(Boolean);
  }, [edges, nodeMap]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
      style={{ minWidth: "100%", minHeight: "100%" }}
    >
      <defs>
        {/* Style tag for animated stroke dash */}
        <style>
          {`
            @keyframes flowDash {
              from {
                stroke-dashoffset: 24;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
            .edge-animated {
              animation: flowDash 1.2s linear infinite;
            }
          `}
        </style>

        {/* Dynamic Arrowhead Markers */}
        <marker
          id="arrow-default"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#71717a" />
        </marker>
        <marker
          id="arrow-emerald"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
        </marker>
        <marker
          id="arrow-sky"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
        </marker>
        <marker
          id="arrow-amber"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
        </marker>
        <marker
          id="arrow-purple"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7" />
        </marker>
      </defs>

      {/* Render Edges */}
      {computedEdges.map((edge) => {
        if (!edge) return null;

        let markerId = "arrow-default";
        if (edge.color?.includes("10b981") || edge.color?.includes("emerald")) {
          markerId = "arrow-emerald";
        } else if (
          edge.color?.includes("38bdf8") ||
          edge.color?.includes("sky")
        ) {
          markerId = "arrow-sky";
        } else if (
          edge.color?.includes("f59e0b") ||
          edge.color?.includes("amber")
        ) {
          markerId = "arrow-amber";
        } else if (
          edge.color?.includes("a855f7") ||
          edge.color?.includes("purple")
        ) {
          markerId = "arrow-purple";
        }

        return (
          <g key={edge.id} className="transition-opacity">
            {/* Wider invisible stroke for hover hit-testing */}
            <path
              d={edge.pathData}
              fill="none"
              stroke="transparent"
              strokeWidth={(edge.strokeWidth ?? 2) + 8}
              className="pointer-events-auto cursor-pointer"
            />

            {/* Visual SVG Bezier Line */}
            <path
              d={edge.pathData}
              fill="none"
              stroke={edge.color}
              strokeWidth={edge.strokeWidth ?? 2}
              strokeDasharray={
                edge.animated || edge.dashed ? "6 6" : undefined
              }
              markerEnd={edge.arrow !== false ? `url(#${markerId})` : undefined}
              className={`transition-colors ${
                edge.animated ? "edge-animated" : ""
              }`}
            />

            {/* Edge Label Pill */}
            {edge.label && (
              <g
                transform={`translate(${edge.midX}, ${edge.midY})`}
                className="select-none pointer-events-none"
              >
                <rect
                  x="-28"
                  y="-11"
                  width="56"
                  height="22"
                  rx="6"
                  fill="#18181b"
                  stroke="#3f3f46"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3.5"
                  fill="#d4d4d8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
