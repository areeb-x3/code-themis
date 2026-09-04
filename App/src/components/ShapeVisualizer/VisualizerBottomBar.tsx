import React from "react";

export interface VisualizerBottomBarProps {
  step: number;
  totalSteps: number;
  actionText?: string;
  className?: string;
}

export const VisualizerBottomBar: React.FC<VisualizerBottomBarProps> = ({
  step,
  totalSteps,
  actionText = "",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center border-t border-neutral-800 bg-neutral-900 shrink-0 h-9 p-0 px-2 gap-2 select-none ${className}`}
    >
      {/* Step [X/Y] box sticking to the left */}
      <div
        className="h-6 px-2 flex items-center justify-center text-xs font-mono font-semibold bg-neutral-800 text-neutral-200 shrink-0"
        style={{ borderRadius: "5px" }}
      >
        Step [{step + 1}/{totalSteps}]
      </div>

      {/* Step description taking all the right side */}
      <div
        className="flex-1 text-xs text-neutral-300 truncate"
        title={actionText}
      >
        {actionText}
      </div>
    </div>
  );
};
