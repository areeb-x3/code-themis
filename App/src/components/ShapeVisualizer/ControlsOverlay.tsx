import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faRotateLeft,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

interface ControlsOverlayProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToContent: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToContent,
}) => {
  const percentage = Math.round(scale * 100);

  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 px-2 py-1.5 rounded-md bg-neutral-900 border border-neutral-800/80 shadow-2xl select-none">
      {/* Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        title="Zoom Out (Wheel Down)"
        className="p-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faMinus} className="w-3.5 h-3.5" />
      </button>

      {/* Zoom Indicator (Click resets to 100%) */}
      <button
        type="button"
        onClick={onResetView}
        title="Reset zoom to 100%"
        className="px-2 py-0.5 text-xs font-mono font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition cursor-pointer min-w-[52px] text-center"
      >
        {percentage}%
      </button>

      {/* Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        title="Zoom In (Wheel Up)"
        className="p-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-neutral-800 mx-0.5" />

      {/* Reset View */}
      <button
        type="button"
        onClick={onResetView}
        title="Reset View (100%)"
        className="p-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faRotateLeft} className="w-3.5 h-3.5" />
      </button>

      {/* Fit to Content */}
      <button
        type="button"
        onClick={onFitToContent}
        title="Fit to Content"
        className="p-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faExpand} className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
