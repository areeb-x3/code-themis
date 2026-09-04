import type { ReactNode } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export type ShapeType =
  | "rectangle"
  | "rounded"
  | "circle"
  | "diamond"
  | "pill"
  | "database"
  | "asymmetric"
  | "hexagon";

export type NodeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "cyan"
  | "amber";

export type PortPosition = "top" | "bottom" | "left" | "right";

export interface NodePort {
  id: string;
  position: PortPosition;
  label?: string;
  offset?: number; // 0 to 100 percentage offset along edge
}

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  shape?: ShapeType;
  variant?: NodeVariant;
  icon?: string;
  data?: Record<string, unknown>;
  customContent?: ReactNode;
  ports?: NodePort[];
  isDraggable?: boolean;
  isSelected?: boolean;
  className?: string;
}

export type EdgeCurveType = "bezier" | "straight" | "step";

export interface CanvasEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort?: PortPosition | string;
  targetPort?: PortPosition | string;
  label?: string;
  color?: string;
  animated?: boolean;
  dashed?: boolean;
  strokeWidth?: number;
  arrow?: boolean;
  type?: EdgeCurveType;
}

export type GridType = "dots" | "lines" | "crosses" | "none";

export interface CanvasOptions {
  minScale?: number;
  maxScale?: number;
  zoomStep?: number;
  gridType?: GridType;
  gridSize?: number;
  snapToGrid?: boolean;
  readOnly?: boolean;
}

export interface DragState {
  isDraggingCanvas: boolean;
  isDraggingNode: boolean;
  activeNodeId: string | null;
  startMouse: Point;
  startTransform: CanvasTransform;
  startNodePos: Point;
}

export const DEFAULT_CANVAS_OPTIONS: Required<CanvasOptions> = {
  minScale: 0.1,
  maxScale: 3.0,
  zoomStep: 0.15,
  gridType: "dots",
  gridSize: 24,
  snapToGrid: false,
  readOnly: false,
};

export interface SpeedOption {
  label: string;
  value: number;
}

export const DEFAULT_SPEED_OPTIONS: SpeedOption[] = [
  { label: "0.5x", value: 2000 },
  { label: "0.75x", value: 1333 },
  { label: "1.0x", value: 1000 },
  { label: "1.25x", value: 800 },
  { label: "1.5x", value: 667 },
  { label: "2.0x", value: 500 },
];

