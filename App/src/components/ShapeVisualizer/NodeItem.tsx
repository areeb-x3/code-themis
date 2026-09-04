import React from "react";
import type { CanvasNode, NodeVariant, PortPosition, ShapeType } from "./types";

interface NodeItemProps {
  node: CanvasNode;
  isSelected?: boolean;
  onSelect?: (node: CanvasNode, e: React.MouseEvent) => void;
  onMouseDown?: (node: CanvasNode, e: React.MouseEvent) => void;
}

const VARIANT_STYLES: Record<NodeVariant, { border: string; bg: string; text: string; glow: string }> = {
  default: {
    border: "border-neutral-700 hover:border-neutral-500",
    bg: "bg-neutral-900/95",
    text: "text-neutral-200",
    glow: "shadow-black/60",
  },
  primary: {
    border: "border-sky-500/60 hover:border-sky-400",
    bg: "bg-sky-950/80",
    text: "text-sky-200",
    glow: "shadow-sky-950/50",
  },
  success: {
    border: "border-emerald-500/60 hover:border-emerald-400",
    bg: "bg-emerald-950/80",
    text: "text-emerald-200",
    glow: "shadow-emerald-950/50",
  },
  warning: {
    border: "border-amber-500/60 hover:border-amber-400",
    bg: "bg-amber-950/80",
    text: "text-amber-200",
    glow: "shadow-amber-950/50",
  },
  danger: {
    border: "border-rose-500/60 hover:border-rose-400",
    bg: "bg-rose-950/80",
    text: "text-rose-200",
    glow: "shadow-rose-950/50",
  },
  purple: {
    border: "border-purple-500/60 hover:border-purple-400",
    bg: "bg-purple-950/80",
    text: "text-purple-200",
    glow: "shadow-purple-950/50",
  },
  cyan: {
    border: "border-cyan-500/60 hover:border-cyan-400",
    bg: "bg-cyan-950/80",
    text: "text-cyan-200",
    glow: "shadow-cyan-950/50",
  },
  amber: {
    border: "border-amber-600/60 hover:border-amber-500",
    bg: "bg-amber-950/80",
    text: "text-amber-100",
    glow: "shadow-amber-950/50",
  },
};

export const NodeItem: React.FC<NodeItemProps> = ({
  node,
  isSelected = false,
  onSelect,
  onMouseDown,
}) => {
  const width = node.width ?? 160;
  const height = node.height ?? (node.shape === "circle" ? 120 : node.shape === "diamond" ? 140 : 70);
  const variant = node.variant ?? "default";
  const shape = node.shape ?? "rectangle";
  const styles = VARIANT_STYLES[variant];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary mouse button initiates drag
    e.stopPropagation();
    onSelect?.(node, e);
    onMouseDown?.(node, e);
  };

  // Helper to render port dots
  const renderPorts = () => {
    const ports: PortPosition[] = ["top", "bottom", "left", "right"];
    return ports.map((pos) => {
      let positionClass = "";
      switch (pos) {
        case "top":
          positionClass = "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
          break;
        case "bottom":
          positionClass = "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
          break;
        case "left":
          positionClass = "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2";
          break;
        case "right":
          positionClass = "right-0 top-1/2 -translate-y-1/2 translate-x-1/2";
          break;
      }

      return (
        <div
          key={pos}
          data-port={pos}
          className={`absolute w-2.5 h-2.5 rounded-full border border-neutral-600 bg-neutral-900 transition-all opacity-0 group-hover:opacity-100 hover:scale-125 hover:bg-emerald-400 hover:border-white z-20 ${positionClass}`}
        />
      );
    });
  };

  const renderShapeContent = (currentShape: ShapeType) => {
    if (node.customContent) {
      return node.customContent;
    }

    switch (currentShape) {
      case "diamond":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-[72%] h-[72%] rotate-45 border flex items-center justify-center shadow-lg transition-transform duration-150 group-hover:scale-105 overflow-hidden"
              style={{
                borderColor: styles.border.split(" ")[0].replace("border-", ""),
                backgroundColor: styles.bg.replace("bg-", ""),
              }}
            >
              <div className="-rotate-45 text-center flex flex-col items-center justify-center px-1">
                {node.title && <div className="font-semibold text-xs leading-tight line-clamp-2">{node.title}</div>}
                {node.subtitle && <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{node.subtitle}</div>}
              </div>
            </div>
          </div>
        );

      case "circle":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-3">
            {node.icon && <span className="text-lg mb-1">{node.icon}</span>}
            {node.title && <div className="font-semibold text-xs leading-tight line-clamp-2">{node.title}</div>}
            {node.subtitle && <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{node.subtitle}</div>}
          </div>
        );

      case "database":
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900/90 shadow-lg">
            {/* Top Cylinder Rim */}
            <div className="w-full h-4 border-b border-neutral-700 bg-neutral-800/80 rounded-t-xl flex items-center justify-center">
              <div className="w-8 h-1 bg-neutral-600/60 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-3 py-1 text-center">
              {node.title && <div className="font-semibold text-xs leading-tight">{node.title}</div>}
              {node.subtitle && <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{node.subtitle}</div>}
            </div>
            {/* Bottom Cylinder Rim line */}
            <div className="w-full h-2 border-t border-neutral-800 bg-neutral-900 rounded-b-xl" />
          </div>
        );

      case "asymmetric":
        return (
          <div className="w-full h-full skew-x-[-8deg] rounded-lg border border-neutral-700 bg-neutral-900/90 flex flex-col items-center justify-center p-3 shadow-lg">
            <div className="skew-x-[8deg] text-center flex flex-col items-center justify-center">
              {node.title && <div className="font-semibold text-xs leading-tight">{node.title}</div>}
              {node.subtitle && <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{node.subtitle}</div>}
            </div>
          </div>
        );

      case "pill":
        return (
          <div className="w-full h-full flex items-center justify-center px-4 py-2">
            <div className="text-center">
              {node.title && <div className="font-semibold text-xs leading-tight">{node.title}</div>}
              {node.subtitle && <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{node.subtitle}</div>}
            </div>
          </div>
        );

      case "rounded":
      case "rectangle":
      default:
        return (
          <div className="w-full h-full flex flex-col justify-center px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              {node.icon && <span className="text-sm shrink-0">{node.icon}</span>}
              <div className="min-w-0 flex-1">
                {node.title && (
                  <div className="font-medium text-xs text-neutral-100 truncate">
                    {node.title}
                  </div>
                )}
                {node.subtitle && (
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {node.subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  const getContainerShapeClasses = (currentShape: ShapeType) => {
    switch (currentShape) {
      case "circle":
        return "rounded-full border";
      case "pill":
        return "rounded-full border";
      case "rounded":
        return "rounded-2xl border";
      case "database":
      case "asymmetric":
      case "diamond":
        return ""; // Shapes manage their own styling
      case "rectangle":
      default:
        return "rounded-xl border";
    }
  };

  const isCustomRender = shape === "database" || shape === "asymmetric" || shape === "diamond";

  return (
    <div
      data-node-id={node.id}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      className={`group absolute top-0 left-0 select-none cursor-grab active:cursor-grabbing transition-shadow ${
        node.className ?? ""
      }`}
    >
      <div
        className={`w-full h-full relative transition-all duration-150 ${
          !isCustomRender ? `${styles.bg} ${styles.border} ${styles.text} shadow-xl ${styles.glow} ${getContainerShapeClasses(shape)}` : styles.text
        } ${
          isSelected
            ? "ring-2 ring-emerald-400/90 shadow-[0_0_16px_rgba(52,211,153,0.4)]"
            : ""
        }`}
      >
        {renderShapeContent(shape)}
        {renderPorts()}
      </div>
    </div>
  );
};
