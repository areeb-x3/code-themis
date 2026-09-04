import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type {
  CanvasEdge,
  CanvasNode,
  CanvasOptions,
  CanvasTransform,
  Point,
} from "./types";
import { DEFAULT_CANVAS_OPTIONS } from "./types";
import { NodeItem } from "./NodeItem";
import { ConnectionLines } from "./ConnectionLines";
import { ControlsOverlay } from "./ControlsOverlay";

export interface FlowchartCanvasProps {
  nodes?: CanvasNode[];
  edges?: CanvasEdge[];
  children?: React.ReactNode;
  initialTransform?: Partial<CanvasTransform>;
  options?: CanvasOptions;
  onNodesChange?: (nodes: CanvasNode[]) => void;
  onEdgesChange?: (edges: CanvasEdge[]) => void;
  onNodeSelect?: (node: CanvasNode | null) => void;
  className?: string;
  headerContent?: React.ReactNode;
}

export const FlowchartCanvas: React.FC<FlowchartCanvasProps> = ({
  nodes: controlledNodes,
  edges = [],
  children,
  initialTransform,
  options = {},
  onNodesChange,
  onNodeSelect,
  className = "",
  headerContent,
}) => {
  const mergedOptions = { ...DEFAULT_CANVAS_OPTIONS, ...options };
  const { minScale, maxScale, zoomStep, gridSize, snapToGrid } = mergedOptions;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Internal node state if uncontrolled
  const [internalNodes, setInternalNodes] = useState<CanvasNode[]>(
    controlledNodes ?? []
  );
  const currentNodes = controlledNodes ?? internalNodes;

  // Viewport transformation
  const [transform, setTransform] = useState<CanvasTransform>({
    x: initialTransform?.x ?? 0,
    y: initialTransform?.y ?? 0,
    scale: initialTransform?.scale ?? 1.0,
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeDrag, setActiveDrag] = useState<"canvas" | "node" | null>(null);

  // Dragging state references
  const dragRef = useRef<{
    startMouse: Point;
    startTransform: CanvasTransform;
    nodeId: string | null;
    startNodePos: Point;
  }>({
    startMouse: { x: 0, y: 0 },
    startTransform: { x: 0, y: 0, scale: 1 },
    nodeId: null,
    startNodePos: { x: 0, y: 0 },
  });

  // Non-passive wheel event listener for cursor-centered zooming
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setTransform((prev) => {
        const factor = e.deltaY < 0 ? 1 + zoomStep : 1 - zoomStep;
        const newScale = Math.min(
          maxScale,
          Math.max(minScale, prev.scale * factor)
        );
        if (newScale === prev.scale) return prev;

        // Position on canvas in unscaled coordinates
        const canvasX = (cursorX - prev.x) / prev.scale;
        const canvasY = (cursorY - prev.y) / prev.scale;

        // Calculate new origin to center zoom on mouse cursor
        const newX = cursorX - canvasX * newScale;
        const newY = cursorY - canvasY * newScale;

        return { x: newX, y: newY, scale: newScale };
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [minScale, maxScale, zoomStep]);

  // Window drag listeners attached when activeDrag is truthy
  useEffect(() => {
    if (!activeDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { startMouse, startTransform, nodeId, startNodePos } =
        dragRef.current;

      if (activeDrag === "canvas") {
        const dx = e.clientX - startMouse.x;
        const dy = e.clientY - startMouse.y;
        setTransform({
          ...startTransform,
          x: startTransform.x + dx,
          y: startTransform.y + dy,
        });
      } else if (activeDrag === "node" && nodeId) {
        const currentScale = transform.scale;
        const dx = (e.clientX - startMouse.x) / currentScale;
        const dy = (e.clientY - startMouse.y) / currentScale;

        let newX = startNodePos.x + dx;
        let newY = startNodePos.y + dy;

        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }

        const updateNodes = (prevNodes: CanvasNode[]) =>
          prevNodes.map((n) =>
            n.id === nodeId ? { ...n, x: newX, y: newY } : n
          );

        if (onNodesChange) {
          onNodesChange(updateNodes(currentNodes));
        } else {
          setInternalNodes(updateNodes);
        }
      }
    };

    const handleMouseUp = () => {
      setActiveDrag(null);
      dragRef.current.nodeId = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    activeDrag,
    currentNodes,
    gridSize,
    onNodesChange,
    snapToGrid,
    transform.scale,
  ]);

  const startCanvasDrag = (e: React.MouseEvent) => {
    dragRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startTransform: { ...transform },
      nodeId: null,
      startNodePos: { x: 0, y: 0 },
    };
    setActiveDrag("canvas");
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.closest("button")
      ) {
        return;
      }
      startCanvasDrag(e);
    }
  };

  const handleNodeMouseDown = (node: CanvasNode, e: React.MouseEvent) => {
    if (node.isDraggable === false || mergedOptions.readOnly) {
      startCanvasDrag(e);
      return;
    }

    dragRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startTransform: { ...transform },
      nodeId: node.id,
      startNodePos: { x: node.x, y: node.y },
    };
    setActiveDrag("node");
  };

  const handleNodeSelect = (node: CanvasNode) => {
    setSelectedNodeId(node.id);
    onNodeSelect?.(node);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTransform((prev) => {
      const newScale = Math.min(maxScale, prev.scale * (1 + zoomStep * 1.5));
      const canvasX = (centerX - prev.x) / prev.scale;
      const canvasY = (centerY - prev.y) / prev.scale;
      return {
        scale: newScale,
        x: centerX - canvasX * newScale,
        y: centerY - canvasY * newScale,
      };
    });
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTransform((prev) => {
      const newScale = Math.max(minScale, prev.scale * (1 - zoomStep * 1.5));
      const canvasX = (centerX - prev.x) / prev.scale;
      const canvasY = (centerY - prev.y) / prev.scale;
      return {
        scale: newScale,
        x: centerX - canvasX * newScale,
        y: centerY - canvasY * newScale,
      };
    });
  };

  const handleResetView = useCallback(() => {
    if (!containerRef.current) {
      setTransform({ x: 0, y: 0, scale: 1.0 });
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();

    // If children content exists, center it
    const firstChild = contentWrapperRef.current
      ?.firstElementChild as HTMLElement | null;
    if (firstChild) {
      const childW = firstChild.offsetWidth || firstChild.scrollWidth || 500;
      const childH = firstChild.offsetHeight || firstChild.scrollHeight || 250;
      const centerX = Math.max(16, (rect.width - childW) / 2);
      const centerY = Math.max(16, (rect.height - childH) / 2);
      setTransform({ x: centerX, y: centerY, scale: 1.0 });
      return;
    }

    setTransform({
      x: rect.width / 4,
      y: rect.height / 4,
      scale: 1.0,
    });
  }, []);

  const handleFitToContent = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (currentNodes.length > 0) {
      const padding = 40;
      const minX = Math.min(...currentNodes.map((n) => n.x));
      const minY = Math.min(...currentNodes.map((n) => n.y));
      const maxX = Math.max(
        ...currentNodes.map((n) => n.x + (n.width ?? 160))
      );
      const maxY = Math.max(
        ...currentNodes.map(
          (n) => n.y + (n.height ?? (n.shape === "circle" ? 120 : 70))
        )
      );

      const contentWidth = Math.max(maxX - minX, 100);
      const contentHeight = Math.max(maxY - minY, 100);

      const availableWidth = Math.max(rect.width - padding * 2, 100);
      const availableHeight = Math.max(rect.height - padding * 2, 100);

      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;
      const fitScale = Math.min(
        Math.max(Math.min(scaleX, scaleY), minScale),
        Math.min(1.2, maxScale)
      );

      const newX = (rect.width - contentWidth * fitScale) / 2 - minX * fitScale;
      const newY =
        (rect.height - contentHeight * fitScale) / 2 - minY * fitScale;

      setTransform({ x: newX, y: newY, scale: fitScale });
      return;
    }

    // Measure children element if available
    const firstChild = contentWrapperRef.current
      ?.firstElementChild as HTMLElement | null;
    if (firstChild) {
      const padding = 40;
      const contentWidth =
        firstChild.offsetWidth || firstChild.scrollWidth || 500;
      const contentHeight =
        firstChild.offsetHeight || firstChild.scrollHeight || 250;

      const availableWidth = Math.max(rect.width - padding * 2, 100);
      const availableHeight = Math.max(rect.height - padding * 2, 100);

      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;
      const fitScale = Math.min(
        Math.max(Math.min(scaleX, scaleY), minScale),
        Math.min(1.1, maxScale)
      );

      const newX = Math.max(16, (rect.width - contentWidth * fitScale) / 2);
      const newY = Math.max(16, (rect.height - contentHeight * fitScale) / 2);
      setTransform({ x: newX, y: newY, scale: fitScale });
      return;
    }

    setTransform({ x: 0, y: 0, scale: 1.0 });
  }, [currentNodes, maxScale, minScale]);

  // Center initial view once container has size if at origin
  useEffect(() => {
    if (initialTransform) return;
    const timer = setTimeout(() => {
      handleFitToContent();
    }, 50);
    return () => clearTimeout(timer);
  }, [handleFitToContent, initialTransform]);

  const cursorClass =
    activeDrag === "canvas" ? "cursor-grabbing" : "cursor-grab";

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      className={`relative w-full h-full overflow-hidden select-none bg-transparent font-sans ${cursorClass} ${className}`}
    >
      {/* Header Slot */}
      {headerContent && (
        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          {headerContent}
        </div>
      )}

      {/* Transformed Canvas Content Wrapper */}
      <div
        ref={contentWrapperRef}
        className="absolute top-0 left-0 origin-top-left will-change-transform pointer-events-auto"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
        }}
      >
        {/* Connection Lines (SVG Bezier Curves) if edges provided */}
        {edges.length > 0 && (
          <ConnectionLines edges={edges} nodes={currentNodes} />
        )}

        {/* Nodes Layer if nodes provided */}
        {currentNodes.map((node) => (
          <NodeItem
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id || node.isSelected}
            onSelect={handleNodeSelect}
            onMouseDown={handleNodeMouseDown}
          />
        ))}

        {/* Custom children (e.g. Classic layout blocks) */}
        {children}
      </div>

      {/* Controls Toolbar Overlay */}
      <ControlsOverlay
        scale={transform.scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onFitToContent={handleFitToContent}
      />
    </div>
  );
};
