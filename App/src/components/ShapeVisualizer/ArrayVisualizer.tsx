import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faCheck } from "@fortawesome/free-solid-svg-icons";

export interface ArrayVisualizerProps {
  elements: (number | string)[];
  title?: string;
  currentIndex?: number | number[] | null;
  matchIndices?: number[] | null;
  isVisited?: (index: number) => boolean;
  elementBoxRadius?: React.CSSProperties;
  className?: string;
}

const DEFAULT_BOX_RADIUS: React.CSSProperties = {
  borderBottomLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
  borderTopLeftRadius: "0px",
  borderBottomRightRadius: "0px",
};

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  elements,
  title = "ARRAY",
  currentIndex = null,
  matchIndices = null,
  isVisited,
  elementBoxRadius = DEFAULT_BOX_RADIUS,
  className = "",
}) => {
  const currentIndices = Array.isArray(currentIndex)
    ? currentIndex
    : currentIndex !== null
    ? [currentIndex]
    : [];

  const matches = matchIndices ?? [];

  return (
    <div className={`flex flex-col shrink-0 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 self-start">
        <FontAwesomeIcon
          icon={faHashtag}
          className="w-3.5 h-3.5 text-neutral-400"
        />
        <h3 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800">
          Length: {elements.length}
        </span>
      </div>

      {/* Elements in a single non-wrapping row */}
      <div className="flex flex-nowrap gap-3 items-center justify-start">
        {elements.map((val, index) => {
          const isCurrent = currentIndices.includes(index);
          const isMatch = matches.includes(index);
          const visited = isVisited ? isVisited(index) : false;

          return (
            <div key={index} className="flex flex-col items-center shrink-0">
              {/* Element Box */}
              <div
                className={`w-14 h-14 flex items-center justify-center font-bold text-lg border-2 transition-colors duration-150 font-mono relative ${
                  isMatch
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isCurrent
                    ? "bg-amber-400 border-amber-400 text-neutral-950 font-bold"
                    : visited
                    ? "bg-neutral-900 border-neutral-700 text-neutral-300 opacity-90"
                    : "bg-neutral-950 border-neutral-800 text-neutral-500"
                }`}
                style={elementBoxRadius}
              >
                {val}
                {isMatch && (
                  <div className="absolute -top-1.5 -right-1.5 bg-white text-emerald-700 rounded-full w-4 h-4 flex items-center justify-center text-[9px] border border-neutral-900 shadow">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="stroke-[3]"
                    />
                  </div>
                )}
              </div>

              {/* Fixed-height label slot below box */}
              <div className="mt-1.5 h-10 flex flex-col items-center justify-start">
                <span className="text-[10px] text-neutral-500 font-mono leading-tight">
                  i = {index}
                </span>
                {/* Match pointer */}
                {isMatch && (
                  <span className="text-[10px] text-emerald-400 font-semibold leading-tight">
                    Match
                  </span>
                )}
                {/* Current pointer: below match */}
                {isCurrent && (
                  <span className="text-[10px] text-amber-400 font-semibold leading-tight">
                    Current
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
