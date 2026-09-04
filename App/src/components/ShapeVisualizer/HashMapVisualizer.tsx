import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";

export interface HashMapVisualizerProps {
  entries: Record<string | number, string | number>;
  title?: string;
  keyHeader?: string;
  valueHeader?: string;
  emptyText?: string;
  elementBoxRadius?: React.CSSProperties;
  className?: string;
}

const DEFAULT_BOX_RADIUS: React.CSSProperties = {
  borderBottomLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
  borderTopLeftRadius: "0px",
  borderBottomRightRadius: "0px",
};

export const HashMapVisualizer: React.FC<HashMapVisualizerProps> = ({
  entries,
  title = "HASH MAP",
  keyHeader = "Key",
  valueHeader = "Value",
  emptyText = "HashMap is empty",
  elementBoxRadius = DEFAULT_BOX_RADIUS,
  className = "",
}) => {
  const entryList = Object.entries(entries);

  return (
    <div className={`flex flex-col min-w-[240px] ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 self-start">
        <FontAwesomeIcon
          icon={faTable}
          className="w-3.5 h-3.5 text-neutral-400"
        />
        <h3 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800">
          Entries: {entryList.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {entryList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-neutral-500 gap-2 border border-dashed border-neutral-800/80 rounded-lg">
            <FontAwesomeIcon icon={faTable} className="text-lg text-neutral-600" />
            <p className="text-xs text-neutral-500 font-mono">{emptyText}</p>
          </div>
        ) : (
          <div className="w-full max-w-xs flex flex-col gap-2">
            {/* Table Headers */}
            <div className="grid grid-cols-2 text-[11px] font-mono text-neutral-400 uppercase tracking-wider px-3">
              <span className="text-center font-medium">{keyHeader}</span>
              <span className="text-center font-medium">{valueHeader}</span>
            </div>

            {/* Combined single table box per entry with elementBoxRadius */}
            <div className="flex flex-col gap-2">
              {entryList.map(([key, val]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 text-center text-sm font-mono font-bold border bg-neutral-900 border-neutral-700 text-neutral-100"
                  style={elementBoxRadius}
                >
                  <div className="py-2 px-3 border-r border-neutral-700/60">
                    {key}
                  </div>
                  <div className="py-2 px-3 text-neutral-300">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
